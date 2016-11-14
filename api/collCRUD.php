<?php
require_once "config.php";

class collCRUD
{
    protected $pdo;
    protected static $texts = "texts";
    protected static $collocations = "collocations";

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
        $query_str = "SELECT id, title, status, created_at, updated_at FROM " . self::$texts . "ORDER BY created_at DESC";
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCollocations() {
        $query_str = "SELECT id, collocation, charact_1, charact_2, status, created_at, updated_at, text_id FROM " . self::$collocations . "ORDER BY created_at DESC";
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
        $query_str = "SELECT * FROM " . self::$collocations . " WHERE id = :id LIMIT 1";
        $params = array(
            "id" => $id
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function createText($data) {
        $this->checkText($data);

        $query_str = "INSERT INTO " . self::$texts . " (title, text, status) VALUES (:title, :text, :status) RETURNING *";
        $params = array(
            "title" => $data['title'],
            "text" => $data['text'],
            "status" => $data['status']
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    protected function checkText($data) {
        if (!$data['text'] || !$data['status'] || !$data['title']) {
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

        return array('fields' => $updateFields, 'replacements' => $replacements);
    }

    public function updateText($data) {
        $params = $this->setTextUpdateFields($data);

        if (count($params['fields']) == 0) {
            header('HTTP/ 200 NOTHING_TO_UPDATE');
            exit();
        } else {
            $fields = join(',',$params['fields']);
            $query_str = "UPDATE " . self::$texts . " SET " . $fields . " RETURNING *";
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

        if ($data['charact_1']) {
            array_push($updateFields, "charact_1 = :charact_1");
            $replacements["charact_1"] = $data['charact_1'];
        }

        if ($data['charact_2']) {
            array_push($updateFields, "charact_2 = :charact_2");
            $replacements["charact_2"] = $data['charact_2'];
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
            $query_str = "UPDATE " . self::$collocations . " SET " . $fields . " RETURNING *";
            $query = $this->pdo->prepare($query_str);
            $query->execute($params['replacements']);
            return $query->fetch(PDO::FETCH_ASSOC);
        }
    }

    public function createCollocation($data) {
        $this->checkCollocation($data);

        $query_str = "INSERT INTO " . self::$collocations . " (collocation, charact_1, charact_2, status, text_id) VALUES (:collocation, :charact_1, :charact_2, :status, :text_id) RETURNING *";
        $params = array(
            "collocation" => $data['collocation'],
            "charact_1" => $data['charact_1'],
            "charact_2" => $data['charact_2'],
            "text_id" => $data['text_id'],
            "status" => $data['status']
        );
        $query = $this->pdo->prepare($query_str);
        $query->execute($params);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    protected function checkCollocation($data) {
        if (!$data['collocation'] || !$data['status'] || !$data['charact_1'] || !$data['charact_2'] || !$data['text_id']) {
            header('HTTP/ 400 INCORRECT_INPUT');
            exit();
        }

        if (strlen($data['status']) > 1) {
            header('HTTP/ 400 INCORRECT_FIELDS_LENGTH');
            exit();
        }
    }
}