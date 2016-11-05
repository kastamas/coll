<?php
require_once "collCRUD.php";
$route = $_SERVER['REQUEST_URI'];
$route = explode("/",$route);
$method = $_SERVER['REQUEST_METHOD'];
$collCRUD = new collCRUD();
switch ($route[2]) {
    case 'texts':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                echo "good_texts";
            }
            else {
                echo "fucking_error";
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->query("texts");
                echo json_encode($result);
            }
            if ($method === 'POST') {
                echo json_encode(array("result" => 'POST'));
            }
        }
        break;
    case 'collocations':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                echo "good_collocations r";
            }
            else {
                echo "fucking_error";
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->query("collocations");
                echo json_encode($result);
            }
            if ($method === 'POST') {
                echo json_encode(array("result" => 'POST'));
            }
        }
        break;
    default:
        echo "<script>window.location = '/';</script>";
}