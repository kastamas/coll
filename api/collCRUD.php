<?php
require_once "config.php";

class collCRUD
{
    protected $pdo;

    public function __construct()
    {
        try {
            $this->pdo = new PDO("pgsql:host=" . HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
        } catch (\PDOException $e) {
            trigger_error($e->getMessage());
            exit;
        }
    }

    public function query($table, $filter = null) {
        $query_str = "SELECT * FROM " . $table;
        $query = $this->pdo->prepare($query_str);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}