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
        $query_str = "SELECT id, title, status, created_at, updated_at FROM " . self::$texts . " ORDER BY created_at DESC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCollocations() {

        //todo: improve this
        $query_str  = "SELECT c.*,
                              t.title as text_name,
                              ch_ex_1.expansion as expansion_1, ch_ex_1.characteristic_id as characteristic_1,
                              ch_ex_2.expansion as expansion_2, ch_ex_2.characteristic_id as characteristic_2,
                              ch_1.characteristic as characteristic_1_name,
                              ch_2.characteristic as characteristic_2_name,
                              ch_d.characteristic as characteristic_d_name

                        FROM " . self::$collocations . " AS c
                            INNER JOIN texts AS t ON c.text_id = t.id
                            LEFT JOIN characteristics_expansion AS ch_ex_1 ON c.characteristic_attr1 = ch_ex_1.id
                            LEFT JOIN characteristics_expansion AS ch_ex_2 ON c.characteristic_attr2 = ch_ex_2.id
                            LEFT JOIN characteristics AS ch_1 ON ch_ex_1.characteristic_id = ch_1.id
                            LEFT JOIN characteristics AS ch_2 ON ch_ex_2.characteristic_id = ch_2.id
                            LEFT JOIN characteristics AS ch_d ON c.characteristic_divider = ch_d.id
                        ORDER BY created_at ASC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

	public function queryCharacteristics() {
        $query_str = "SELECT id, characteristic FROM " . self::$characteristics . " ORDER BY characteristic ASC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCharacteristicsExpansion() {
            $query_str = "SELECT id, expansion, characteristic_id FROM " . self::$characteristicsExpansion . " ORDER BY expansion ASC";
            $query = $this->pdo->prepare($query_str);
            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
    }


      //todo:make it more simple
     protected function setCharsUpdateFields($data) {
            $updateFields = array();
            $replacements = array();

            if ($data['characteristic']) {
                array_push($updateFields, "characteristic = :characteristic");
                $replacements["characteristic"] = $data['characteristic'];
            }

            return array('fields' => $updateFields, 'replacements' => $replacements);
        }

        public function updateCharacteristic($data) {
            $params = $this->setCharsUpdateFields($data);

            if (count($params['fields']) == 0) {
                header('HTTP/ 200 NOTHING_TO_UPDATE');
                exit();
            } else {
                $fields = join(',',$params['fields']);
                $query_str = "UPDATE " . self::$characteristics . " SET " . $fields . " WHERE id =  ". $data['id'] ." RETURNING *";
                $query = $this->pdo->prepare($query_str);
                $query->execute($params['replacements']);
                return $query->fetch(PDO::FETCH_ASSOC);
            }
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
                             ch_ex_1.expansion as expansion_1, ch_ex_1.characteristic_id as characteristic_1,
                             ch_ex_2.expansion as expansion_2, ch_ex_2.characteristic_id as characteristic_2,
                             ch_1.characteristic as characteristic_1_name,
                             ch_2.characteristic as characteristic_2_name,
                             ch_d.characteristic as characteristic_d_name

                       FROM " . self::$collocations . " AS c
                             INNER JOIN texts AS t ON c.text_id = t.id
                             LEFT JOIN characteristics_expansion AS ch_ex_1 ON c.characteristic_attr1 = ch_ex_1.id
                             LEFT JOIN characteristics_expansion AS ch_ex_2 ON c.characteristic_attr2 = ch_ex_2.id
                             LEFT JOIN characteristics AS ch_1 ON ch_ex_1.characteristic_id = ch_1.id
                             LEFT JOIN characteristics AS ch_2 ON ch_ex_2.characteristic_id = ch_2.id
                             LEFT JOIN characteristics AS ch_d ON c.characteristic_divider = ch_d.id
                     WHERE c.id = :id LIMIT 1";
        $params = array(
            "id" => $id
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
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

    public function createCharacteristic($data) {

         $query_str = "INSERT INTO " . self::$characteristics . " ( characteristic) VALUES (lower(:characteristic)) RETURNING *";
         $params = array(
             "characteristic" => $data['characteristic']
         );
         $query = $this->pdo->prepare($query_str);
         $query->execute($params);
         return $query->fetch(PDO::FETCH_ASSOC);
     }

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

        //todo:strange situation with the null values
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

    public function createCollocation($data) {
        $this->checkCollocation($data);

         /*function to_pg_array($set) {
                  settype($set, 'array'); // can be called with a scalar or array
                  $result = array();
                  foreach ($set as $t) {
                      if (is_array($t)) {
                          $result[] = to_pg_array($t);
                      } else {
                          $t = str_replace('"', '\\"', $t); // escape double quote
                          if (! is_numeric($t)) // quote only non-numeric values
                              $t = '"' . $t . '"';
                          $result[] = $t;
                      }
                  }
                  return '{' . implode(",", $result) . '}'; // format
              }*/

        //$data['charact_2'] = to_pg_array($data['charact_2']);
        $query_str = "INSERT INTO " . self::$collocations . " (collocation, characteristic_quantity, characteristic_relation_to_main, characteristic_attr1, characteristic_attr2, characteristic_divider, page_number, status, text_id)
                        VALUES (:collocation, :characteristic_quantity, :characteristic_relation_to_main, :characteristic_attr1, :characteristic_attr2, :characteristic_divider, :page_number,   :status, :text_id) RETURNING *";
        $params = array(
            "collocation" => $data['collocation'],
            "characteristic_quantity" => $data['characteristic_quantity'],
            "characteristic_relation_to_main" => $data['characteristic_relation_to_main'],
            "characteristic_attr1" => $data['characteristic_attr1'],
            "characteristic_attr2" => $data['characteristic_attr2'],
            "characteristic_divider" => $data['characteristic_divider'],

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