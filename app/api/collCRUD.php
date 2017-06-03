<?php
require_once "config.php";

class collCRUD
{
    protected $pdo;
    protected static $texts = "texts";
    protected static $collocations = "collocations";
    protected static $characteristics = "characteristics";
    protected static $characteristicsExpansion = "characteristics_expansion";

    public function __construct()
    {
        try {
            $this->pdo = new PDO("pgsql:host=" . HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
        } catch (\PDOException $e) {
            trigger_error($e->getMessage());
            exit;
        }
    }

    public function queryTexts() {
        $query_str = "SELECT t.id, t.title, t.status, t.created_at, t.updated_at, COUNT(c.text_id) as number_of_collocations  FROM public.texts AS t
                      LEFT JOIN collocations AS c ON t.id = c.text_id GROUP BY t.id  ORDER BY created_at DESC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCollocations($options) {
        $params = $this->setCollocationFilterFields($options);//filter
        $fields = join(' AND ',$params['fields']);


        $order = $this->setCollocationSortingFields($options);

        //ToDo:improve this
        if (count($params['fields']) == 0) {
            $query_str  = "SELECT c.*,
                              t.title as text_name,
                              ch_1.characteristic as ch_1_name,
                              ch_2.characteristic as ch_2_name,
                              ch_d.characteristic as ch_d_name,
                              ch_ex_1.expansion as ch_addition_1_name,
                              ch_ex_2.expansion as ch_addition_2_name

                        FROM " . self::$collocations . " AS c
                            INNER JOIN texts AS t ON c.text_id = t.id
                            LEFT JOIN characteristics AS ch_1 ON c.characteristic_attr1 = ch_1.id
                            LEFT JOIN characteristics AS ch_2 ON c.characteristic_attr2 = ch_2.id
                            LEFT JOIN characteristics AS ch_d ON c.characteristic_divider = ch_d.id
                            LEFT JOIN characteristics_expansion AS ch_ex_1 ON c.characteristic_attr1_addition = ch_ex_1.id
                            LEFT JOIN characteristics_expansion AS ch_ex_2 ON c.characteristic_attr2_addition = ch_ex_2.id
                        ORDER BY " . $order;
        } else {
            $query_str  = "SELECT c.*,
                              t.title as text_name,
                              ch_1.characteristic as ch_1_name,
                              ch_2.characteristic as ch_2_name,
                              ch_d.characteristic as ch_d_name,
                              ch_ex_1.expansion as ch_addition_1_name,
                              ch_ex_2.expansion as ch_addition_2_name

                        FROM " . self::$collocations . " AS c
                            INNER JOIN texts AS t ON c.text_id = t.id
                            LEFT JOIN characteristics AS ch_1 ON c.characteristic_attr1 = ch_1.id
                            LEFT JOIN characteristics AS ch_2 ON c.characteristic_attr2 = ch_2.id
                            LEFT JOIN characteristics AS ch_d ON c.characteristic_divider = ch_d.id
                            LEFT JOIN characteristics_expansion AS ch_ex_1 ON c.characteristic_attr1_addition = ch_ex_1.id
                            LEFT JOIN characteristics_expansion AS ch_ex_2 ON c.characteristic_attr2_addition = ch_ex_2.id
                        WHERE  " .$fields. "   
                        ORDER BY " . $order;
        }

        $query = $this->pdo->prepare($query_str);
        $query->execute($params['replacements']);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

	public function queryCharacteristics() {
        $query_str = "SELECT id, type, characteristic FROM " . self::$characteristics . " ORDER BY characteristic ASC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCharacteristicsExpansion() {
            $query_str = "SELECT t.id, t.expansion, unnest(t.characteristic_ids) as characteristic_id FROM " . self::$characteristicsExpansion . " AS t ORDER BY expansion ASC LIMIT 50";
            $query = $this->pdo->prepare($query_str);
            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public  function  getText($id) {
        $query_str = "SELECT * FROM " . self::$texts . " WHERE id = :id LIMIT 1";
        $params = array(
          "id" => $id
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public  function  getCollocation($id) {
        $query_str = "SELECT c.*,
                             t.title as text_name,
                             ch_1.characteristic as characteristic_1_name,
                             ch_2.characteristic as characteristic_2_name,
                             ch_d.characteristic as characteristic_d_name,
                             ch_ex_1.expansion as ch_addition_1_name,
                             ch_ex_2.expansion as ch_addition_2_name 

                       FROM " . self::$collocations . " AS c
                             INNER JOIN texts AS t ON c.text_id = t.id
                             LEFT JOIN characteristics AS ch_1 ON c.characteristic_attr1 = ch_1.id
                             LEFT JOIN characteristics AS ch_2 ON c.characteristic_attr2 = ch_2.id
                             LEFT JOIN characteristics AS ch_d ON c.characteristic_divider = ch_d.id
                             LEFT JOIN characteristics_expansion AS ch_ex_1 ON c.characteristic_attr1_addition = ch_ex_1.id
                             LEFT JOIN characteristics_expansion AS ch_ex_2 ON c.characteristic_attr2_addition = ch_ex_2.id
                     WHERE c.id = :id LIMIT 1";
        $params = array(
            "id" => $id
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);

        return $query->fetch(PDO::FETCH_ASSOC);

    }

    public function getCollocationSurroundings($id, $options) {
        $params = $this->setCollocationFilterFields($options);//filter
        $fields = join(' AND ',$params['fields']);

        if (count($params['fields']) == 0) {
            // запрос на общее число сс
            $query_str = "SELECT COUNT(id) as total  FROM " . self::$collocations;

        } else {
            // запрос на общее число сс c фильтром
            $query_str = "SELECT COUNT(id) as total  FROM " . self::$collocations . " WHERE " . $fields;
        }
        $query = $this->pdo->prepare($query_str);
        $query->execute($params['replacements']);
        $total = $query->fetch(PDO::FETCH_ASSOC);

        $order = $this->setCollocationSortingFields($options);

        if (count($params['fields']) == 0) {
            $query_str = "SELECT id FROM " . self::$collocations . "  ORDER BY " . $order;//highlighted warning is ok
        } else {
            $query_str = "SELECT id FROM " . self::$collocations . " WHERE " .$fields. " ORDER BY  " . $order;//highlighted warning is ok todo:fix
        }

        $query = $this->pdo->prepare($query_str);
        $query->execute($params['replacements']);

        $collection = $query->fetchAll(PDO::FETCH_ASSOC);



        //перебор отфильтрованного и отсортированного массива айдишников словосочетаний
        foreach($collection as $key => $value){
            if($value["id"] == $id) {
                $current = $key + 1;
                break;
            }
        }

        $prev = $collection[$current - 2];
        $next = $collection[$current];

        $surroundings = $total;
        $surroundings["previous"] = $prev["id"];
        $surroundings["next"] = $next["id"];
        $surroundings["current"] = $current;

        return $surroundings;
    }

    public function setCollocationSortingFields($options){
        if($options['reverse']){
            $direction = "DESC";
        } else {
            $direction = "ASC";
        }

        if ($options['rows']== "page_number"){
            return ("page_number ".$direction." , created_at ".$direction);
        } else {
            return ("created_at ".$direction);
        }
    }

    /*indian boy*/
    public function setCollocationFilterFields($data){
        $updateFields = [];
        $replacements = [];

        if ($data['text_id']) {
            array_push($updateFields, "text_id = :text_id");
            $replacements["text_id"] = $data['text_id'];
        }

        if ($data['status'] && strlen($data['status']) < 2) {
            array_push($updateFields, "status = :status");
            $replacements["status"] = $data['status'];
        }

        if ($data['collocation']) {
            array_push($updateFields, "collocation = :collocation");
            $replacements["collocation"] = $data['collocation'];
        }

        if ($data['page_number']) {
            array_push($updateFields, "page_number = :page_number");
            $replacements["page_number"] = $data['page_number'];
        }

        if ($data['characteristic_quantity'] != 'any') {
            array_push($updateFields, "characteristic_quantity = :characteristic_quantity");
            $replacements["characteristic_quantity"] = $data['characteristic_quantity'];
        }

        if ($data['characteristic_relation_to_main'] != 'any') {
            array_push($updateFields, "characteristic_relation_to_main = :characteristic_relation_to_main");
            $replacements["characteristic_relation_to_main"] = $data['characteristic_relation_to_main'];
        }

        //todo: strange situation with the null values
        if ($data['characteristic_attr1']) {
            array_push($updateFields, "characteristic_attr1 = :characteristic_attr1");
            $replacements["characteristic_attr1"] = $data['characteristic_attr1'];
        }

        if ($data['characteristic_attr2']) {
            array_push($updateFields, "characteristic_attr2 = :characteristic_attr2");
            $replacements["characteristic_attr2"] = $data['characteristic_attr2'];
        }

        if ($data['characteristic_divider']) {
            array_push($updateFields, "characteristic_divider = :characteristic_divider");
            $replacements["characteristic_divider"] = $data['characteristic_divider'];
        }

        if ($data['characteristic_attr1_addition']) {
            array_push($updateFields, "characteristic_attr1_addition = :characteristic_attr1_addition");
            $replacements["characteristic_attr1_addition"] = $data['characteristic_attr1_addition'];
        }

        if ($data['characteristic_attr2_addition']) {
            array_push($updateFields, "characteristic_attr2_addition = :characteristic_attr2_addition");
            $replacements["characteristic_attr2_addition"] = $data['characteristic_attr2_addition'];
        }


        if ($data['characteristic_preposition'] != 'any') {
            array_push($updateFields, "characteristic_preposition = :characteristic_preposition");
            $replacements["characteristic_preposition"] = $data['characteristic_preposition'];
        }


        if ($data['characteristic_substantive_lg'] != 'any') {
            array_push($updateFields, "characteristic_substantive_lg = :characteristic_substantive_lg");
            $replacements["characteristic_substantive_lg"] = $data['characteristic_substantive_lg'];
        }

        if ($data['characteristic_substantive_lg_explicit'] != 'any')  {
            array_push($updateFields, "characteristic_substantive_lg_explicit = :characteristic_substantive_lg_explicit");
            $replacements["characteristic_substantive_lg_explicit"] = $data['characteristic_substantive_lg_explicit'];
        }

        if ($data['characteristic_substantive_animacy'] != 'any') {
            array_push($updateFields, "characteristic_substantive_animacy = :characteristic_substantive_animacy");
            $replacements["characteristic_substantive_animacy"] = $data['characteristic_substantive_animacy'];
        }

        if ($data['characteristic_substantive_case'] != 'any') {
            array_push($updateFields, "characteristic_substantive_case = :characteristic_substantive_case");
            $replacements["characteristic_substantive_case"] = $data['characteristic_substantive_case'];
        }

        return array('fields' => $updateFields, 'replacements' => $replacements);
    }

    public function deleteCollocation($id) {
        $query_str = "DELETE FROM  " . self::$collocations . " WHERE id = :id ";

        $params = array(
            "id" => $id
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function createText($data) {
        $this->checkText($data);

        $query_str = "INSERT INTO " . self::$texts . " (title, text, status, bibliography) VALUES (:title, :text, :status , :bibliography) RETURNING *";
        $params = array(
            "title" => $data['title'],
            "text" => $data['text'],
            "status" => $data['status'],
            "bibliography" => $data['bibliography']
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

   /* public function createCharacteeristic($data) {

         $query_str = "INSERT INTO " . self::$characteristics . " ( characteristic) VALUES (lower(:characteristic)) RETURNING *";
         $params = array(
             "characteristic" => $data['characteristic']
         );
         $query = $this->pdo->prepare($query_str);
         $query->execute($params);
         return $query->fetch(PDO::FETCH_ASSOC);
     }*/

    protected function checkText($data) {
        if (!$data['status'] || !$data['title']) {
            header('HTTP/ 400 INCORRECT_INPUT');
            exit();
        }

        if (strlen($data['text']) > 250000 || strlen($data['title']) > 256 || strlen($data['status']) > 1) {
            header('HTTP/ 400 INCORRECT_FIELDS_LENGTH');
            exit();
        }
    }

    protected function setTextUpdateFields($data) {
        $updateFields = array();
        $replacements = array();
        if ($data['status'] && strlen($data['status']) < 2) {
            array_push($updateFields, "status = :status");
            $replacements["status"] = $data['status'];
        }

        if ($data['title']) {
            array_push($updateFields, "title = :title");
            $replacements["title"] = $data['title'];
        }

        if ($data['text']) {
            array_push($updateFields, "text = :text");
            $replacements["text"] = $data['text'];
        }
        if ($data['bibliography']) {
            array_push($updateFields, "bibliography = :bibliography");
            $replacements["bibliography"] = $data['bibliography'];
        }


        return array('fields' => $updateFields, 'replacements' => $replacements);
    }

    public function updateText($data) {
        $params = $this->setTextUpdateFields($data);

        if (count($params['fields']) == 0) {
            header('HTTP/ 200 NOTHING_TO_UPDATE');
            exit();
        } else {
            $fields = join(',',$params['fields']);
            $query_str = "UPDATE " . self::$texts . " SET " . $fields . " WHERE id =  ". $data['id'] ." RETURNING *";
            $query = $this->pdo->prepare($query_str);
            $query->execute($params['replacements']);
            return $query->fetch(PDO::FETCH_ASSOC);
        }
    }

    protected function setCollocationUpdateFields($data) {
        $updateFields = array();
        $replacements = array();


        if ($data['text_id']) {
            array_push($updateFields, "text_id = :text_id");
            $replacements["text_id"] = $data['text_id'];
        }

        if ($data['status'] && strlen($data['status']) < 2) {
            array_push($updateFields, "status = :status");
            $replacements["status"] = $data['status'];
        }

        if ($data['collocation']) {
            array_push($updateFields, "collocation = :collocation");
            $replacements["collocation"] = $data['collocation'];
        }

        if ($data['page_number']) {
            array_push($updateFields, "page_number = :page_number");
            $replacements["page_number"] = $data['page_number'];
        }

        if ($data['characteristic_quantity']) {
            array_push($updateFields, "characteristic_quantity = :characteristic_quantity");
            $replacements["characteristic_quantity"] = $data['characteristic_quantity'];
        }

        if ($data['characteristic_relation_to_main']) {
            array_push($updateFields, "characteristic_relation_to_main = :characteristic_relation_to_main");
            $replacements["characteristic_relation_to_main"] = $data['characteristic_relation_to_main'];
        }

        //todo: strange situation with the null values
        if ($data['characteristic_attr1']) {
            array_push($updateFields, "characteristic_attr1 = :characteristic_attr1");
            $replacements["characteristic_attr1"] = $data['characteristic_attr1'];
        } else {
            array_push($updateFields, "characteristic_attr1 = :characteristic_attr1");
            $replacements["characteristic_attr1"] = NULL;
        }

        if ($data['characteristic_attr2']) {
            array_push($updateFields, "characteristic_attr2 = :characteristic_attr2");
            $replacements["characteristic_attr2"] = $data['characteristic_attr2'];
        } else {
             array_push($updateFields, "characteristic_attr2 = :characteristic_attr2");
             $replacements["characteristic_attr2"] = NULL;
        }

        if ($data['characteristic_divider']) {
            array_push($updateFields, "characteristic_divider = :characteristic_divider");
            $replacements["characteristic_divider"] = $data['characteristic_divider'];
        } else {
            array_push($updateFields, "characteristic_divider = :characteristic_divider");
            $replacements["characteristic_divider"] = NULL;
        }

        if ($data['characteristic_attr1_addition']) {
            array_push($updateFields, "characteristic_attr1_addition = :characteristic_attr1_addition");
            $replacements["characteristic_attr1_addition"] = $data['characteristic_attr1_addition'];
        } else {
            array_push($updateFields, "characteristic_attr1_addition = :characteristic_attr1_addition");
            $replacements["characteristic_attr1_addition"] = NULL;
        }

        if ($data['characteristic_attr2_addition']) {
            array_push($updateFields, "characteristic_attr2_addition = :characteristic_attr2_addition");
            $replacements["characteristic_attr2_addition"] = $data['characteristic_attr2_addition'];
        } else {
            array_push($updateFields, "characteristic_attr2_addition = :characteristic_attr2_addition");
            $replacements["characteristic_attr2_addition"] = NULL;
        }




        if ($data['characteristic_preposition']) {
            array_push($updateFields, "characteristic_preposition = :characteristic_preposition");
            $replacements["characteristic_preposition"] = $data['characteristic_preposition'];
        } else {
            array_push($updateFields, "characteristic_preposition = :characteristic_preposition");
            $replacements["characteristic_preposition"] = NULL;
        }


        if ($data['characteristic_substantive_lg']) {
            array_push($updateFields, "characteristic_substantive_lg = :characteristic_substantive_lg");
            $replacements["characteristic_substantive_lg"] = $data['characteristic_substantive_lg'];
        } else {
            array_push($updateFields, "characteristic_substantive_lg = :characteristic_substantive_lg");
            $replacements["characteristic_substantive_lg"] = NULL;
        }

        if ($data['characteristic_substantive_lg_explicit']) {
            array_push($updateFields, "characteristic_substantive_lg_explicit = :characteristic_substantive_lg_explicit");
            $replacements["characteristic_substantive_lg_explicit"] = $data['characteristic_substantive_lg_explicit'];
        } else {
            array_push($updateFields, "characteristic_substantive_lg_explicit = :characteristic_substantive_lg_explicit");
            $replacements["characteristic_substantive_lg_explicit"] = NULL;
        }

        if ($data['characteristic_substantive_animacy']) {
            array_push($updateFields, "characteristic_substantive_animacy = :characteristic_substantive_animacy");
            $replacements["characteristic_substantive_animacy"] = $data['characteristic_substantive_animacy'];
        } else {
            array_push($updateFields, "characteristic_substantive_animacy = :characteristic_substantive_animacy");
            $replacements["characteristic_substantive_animacy"] = NULL;
        }

        if ($data['characteristic_substantive_case']) {
            array_push($updateFields, "characteristic_substantive_case = :characteristic_substantive_case");
            $replacements["characteristic_substantive_case"] = $data['characteristic_substantive_case'];
        } else {
            array_push($updateFields, "characteristic_substantive_case = :characteristic_substantive_case");
            $replacements["characteristic_substantive_case"] = NULL;
        }


        return array('fields' => $updateFields, 'replacements' => $replacements);
    }


    public function updateCollocation($data) {

        $params = $this->setCollocationUpdateFields($data);

        if (count($params['fields']) == 0) {
            header('HTTP/ 200 NOTHING_TO_UPDATE');
            exit();
        } else {
            $fields = join(',',$params['fields']);
            $query_str = "UPDATE " . self::$collocations . " SET " . $fields . "  WHERE id =  ". $data['id'] ." RETURNING *";
            $query = $this->pdo->prepare($query_str);
            $query->execute($params['replacements']);
            return $query->fetch(PDO::FETCH_ASSOC);
        }
    }

    //todo: you can make it better
    public function createCollocation($data) {
        $this->checkCollocation($data);//check status,text,collocation's text
        //todo:refactor query style
        $query_str = "INSERT INTO " . self::$collocations . " (
                     collocation, 
                     characteristic_quantity, 
                     characteristic_relation_to_main, 
                     characteristic_attr1, 
                     characteristic_attr2, 
                     characteristic_divider, 
                     characteristic_attr1_addition, 
                     characteristic_attr2_addition,
                     characteristic_preposition,
                     
                     characteristic_substantive_lg,
                     characteristic_substantive_lg_explicit,
                     characteristic_substantive_animacy,
                     characteristic_substantive_case,
                     
                     page_number, 
                     status, 
                     text_id
                )VALUES (
                     :collocation,
                     :characteristic_quantity, 
                     :characteristic_relation_to_main, 
                     :characteristic_attr1, 
                     :characteristic_attr2, 
                     :characteristic_divider, 
                     :characteristic_attr1_addition, 
                     :characteristic_attr2_addition,
                     :characteristic_preposition,
                     
                     :characteristic_substantive_lg,
                     :characteristic_substantive_lg_explicit,
                     :characteristic_substantive_animacy,
                     :characteristic_substantive_case,
                     
                     :page_number,   
                     :status, 
                     :text_id
                 ) RETURNING * ";
        $params = array(
            "collocation" => $data['collocation'],

            "characteristic_quantity" => $data['characteristic_quantity'],
            "characteristic_relation_to_main" => $data['characteristic_relation_to_main'],
            "characteristic_attr1" => $data['characteristic_attr1'],
            "characteristic_attr2" => $data['characteristic_attr2'],
            "characteristic_attr1_addition" => $data['characteristic_attr1_addition'],
            "characteristic_attr2_addition" => $data['characteristic_attr2_addition'],
            "characteristic_divider" => $data['characteristic_divider'],
            "characteristic_preposition" => $data['characteristic_preposition'],

            "characteristic_substantive_lg" => $data['characteristic_substantive_lg'],
            "characteristic_substantive_lg_explicit" => $data['characteristic_substantive_lg_explicit'],
            "characteristic_substantive_animacy" => $data['characteristic_substantive_animacy'],
            "characteristic_substantive_case" => $data['characteristic_substantive_case'],

            "page_number" => $data['page_number'],
            "text_id" => $data['text_id'],
            "status" => $data['status']
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    protected function checkCollocation($data) {
        if (!$data['collocation'] || !$data['status'] || !$data['text_id']) {
            header('HTTP/ 400 INCORRECT_INPUT');
            exit();
        }

        if (strlen($data['status']) > 1) {
            header('HTTP/ 400 INCORRECT_FIELDS_LENGTH');
            exit();
        }
    }
}