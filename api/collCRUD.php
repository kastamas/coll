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

    public function queryTexts($filter = null) {
        if ($filter !== null) {

        }
        $query_str = "SELECT id, title, status, created_at, updated_at FROM " . self::$texts;
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryCollocations($filter = null) {
        $query_str = "SELECT id, collocation, charact_1, charact_2, status, created_at, updated_at, text_id FROM " . self::$collocations;
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
}