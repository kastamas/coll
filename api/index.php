<?php
require_once "collCRUD.php";
$route = $_SERVER['REQUEST_URI'];
$route = explode("/",$route);
$method = $_SERVER['REQUEST_METHOD'];
$collCRUD = new collCRUD();
switch ($route[2]) {
    case 'texts':
        if ($route[3] && !$route[4]) {
            if (is_numeric($route[3])) {
                if ($method === 'GET') {
                    $result = $collCRUD->getText($route[3]);
                    if (!$result) {
                        header('HTTP/ 404 NOT_FOUND');
                        exit();
                    }
                    echo json_encode($result);
                }
                if ($method === 'PUT') {
                    
                }
            }
            else {
                header('HTTP/ 400 INCORRECT_ID');
                exit();
            }
        } else {
            if ($method === 'GET') {
                $data = null;
                if ($route[3] && $route[3] === 'filter' && $route[4]) {
                    $data = json_decode(urldecode($route[4]));
                }
                $result = $collCRUD->queryTexts($data);
                if (!$result) {
                    header('HTTP/ 400 GET_ERROR');
                    exit();
                }
                echo json_encode($result);
            }
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if ($data === null) {
                    header('HTTP/ 400 INCORRECT_INPUT');
                    exit();
                } else {
                    $result = $collCRUD->createText($data);
                    if (!$result) {
                        header('HTTP/ 400 CREATE_ERROR');
                        exit();
                    }
                    echo json_encode($result);
                }
            }
        }
        break;
    case 'collocations':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                if ($method === 'GET') {
                    $result = $collCRUD->getCollocation($route[3]);
                    echo json_encode($result);
                }
                if ($method === 'PUT') {

                }
            }
            else {
                echo json_encode(array('error' => 'INCORRECT_ID'));
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->queryCollocations();
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