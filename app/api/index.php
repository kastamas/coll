<?php
require_once "collCRUD.php";
require_once "fileActions.php";
$route = $_SERVER['REQUEST_URI'];
$route = explode("/", $route);
$method = $_SERVER['REQUEST_METHOD'];
$collCRUD = new collCRUD();
$fileActions = new fileActions();


switch ($route[2]) {
    case 'texts':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                if ($method === 'GET') {
                    $result = $collCRUD->getText($route[3]);
                    if ($result === false) {
                        header('HTTP/ 404 NOT_FOUND');
                        exit();
                    }
                    echo json_encode($result);
                }
                if ($method === 'PUT') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    if ($data === null) {
                        header('HTTP/ 400 INCORRECT_INPUT');
                        exit();
                    } else {
                        $result = $collCRUD->updateText($data);
                        if ($result === false) {
                            header('HTTP/ 400 UPDATE_ERROR');
                            exit();
                        }
                        echo json_encode($result);
                    }
                }
            } else {
                header('HTTP/ 400 INCORRECT_ID');
                exit();
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->queryTexts();
                if ($result === false) {
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
                    if ($result === false) {
                        header('HTTP/ 400 CREATE_ERROR');
                        exit();
                    }
                    echo json_encode($result);
                }
            }
        }
        break;

    case 'htmlParseSpec' :
        if ($method === 'POST') {
            $result = array();
            $tmp = array_values($_FILES);
            $doc = new DOMDocument();
            $doc->loadHTMLFile($tmp[0]['tmp_name']);

            $trs = $doc->getElementsByTagName('tr');// a lot of <tr>

            foreach ($trs as $tr) {
                $tds = $tr->getElementsByTagName('td');
                foreach ($tds as $td) {
                    $spans = $td->getElementsByTagName('span');
                    $pageNumber = $spans[0]->nodeValue;
                    $collocation = $spans[3]->nodeValue;
                    if (count($spans) == 0 || $collocation == null) {
                        continue;
                    }

                    $result[] = array("page_number"=>$pageNumber, "collocation" =>$collocation);
                }
            }

            echo json_encode($result,JSON_UNESCAPED_UNICODE);
        } else {
            header('HTTP/ 400 NO_SUCH_API');
        }
        break;


    case 'collocations':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                if ($method === 'GET') {
                    $result = $collCRUD->getCollocation($route[3]);
                    if ($result === false) {
                        header('HTTP/ 404 NOT_FOUND ');
                        exit();
                    }
                    echo json_encode($result);
                }
                if ($method === 'PUT') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    if ($data === null) {
                        header('HTTP/ 400 INCORRECT_INPUT');
                        exit();
                    } else {
                        $result = $collCRUD->updateCollocation($data);
                        if ($result === false) {
                            header('HTTP/ 400 UPDATE_ERROR');
                            exit();
                        }
                        echo json_encode($result);
                    }
                }
                if ($method === 'DELETE') {
                    //todo:add more security
                    $result = $collCRUD->deleteCollocation($route[3]);
                    if ($result === false) {
                        header('HTTP/ 404 NOT_FOUND');
                        exit();
                    }
                    echo json_encode($result);
                }
            } else {
                echo json_encode(array('error' => 'INCORRECT_ID_OR_METHOD'));
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->queryCollocations();
                if ($result === false) {
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
                    $result = $collCRUD->createCollocation($data);
                    if ($result === false) {
                        header('HTTP/ 400 CREATE_ERROR');
                        exit();
                    }
                    echo json_encode($result);
                }
            }
        }
        break;
    case 'characteristics':
        if ($route[3]) {
            if (is_numeric($route[3])) {
                /*if ($method === 'GET') {
                    $result = $collCRUD -> getText($route[3]);
                    if ($result === false){
                        header('HTTP/ 404 NOT_FOUND');
                        exit();
                    }
                    echo json_encode($result);
                }*/
                if ($method === 'PUT') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    if ($data === null) {
                        header('HTTP/ 400 INCORRECT_INPUT');
                        exit();
                    } else {
                        $result = $collCRUD->updateCharacteristic($data);
                        if ($result === false) {
                            header('HTTP/ 400 UPDATE_ERROR');
                            exit();
                        }
                        echo json_encode($result);
                    }
                }
            }
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->queryCharacteristics();
                if ($result === false) {
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
                    $result = $collCRUD->createCharacteristic($data);
                    if ($result === false) {
                        header('HTTP/ 400 CREATE_ERROR');
                        exit();
                    }
                    echo json_encode($result);
                }
            }
        }
        break;
    case 'characteristicsExpansion':
        if ($route[3]) {
            header('HTTP/ 400 NO_SUCH_API');
        } else {
            if ($method === 'GET') {
                $result = $collCRUD->queryCharacteristicsExpansion();
                if ($result === false) {
                    header('HTTP/ 400 GET_ERROR');
                    exit();
                }
                echo json_encode($result);
            } else {
                header('HTTP/ 400 NO_SUCH_API');
            }
        }
        break;
    default:
        echo("<script>window.location = '/';</script>");
}