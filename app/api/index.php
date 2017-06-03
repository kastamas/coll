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
                    $pageNumber = $spans[0]->nodeValue . $spans[1]->nodeValue;//склейка
                    $collocation = $spans[2]->nodeValue . $spans[3]->nodeValue . $spans[4]->nodeValue;//склейка

                    if (count($spans) == 0 || $collocation == null) {
                        continue;
                    }

                    $pageNumber = preg_replace('/[^0-9]/','',$pageNumber);// best finded solution for removing non-breakable html spaces from numerals
                    $collocation = str_replace("&nbsp;",'',htmlentities($collocation));


                    $result[] = array("page_number"=>$pageNumber, "collocation"=>$collocation);
                }
            }

            echo json_encode($result,JSON_UNESCAPED_UNICODE);
        }
        else {
            header('HTTP/ 400 NO_SUCH_API');
        }
        break;

    case 'collocations':
            if ($route[3]) {
                if ($method === 'GET') {
                    $explodedString = explode("?", $route[3]);
                    $options = json_decode(urldecode($explodedString[1]),true);

                    $result = $collCRUD->queryCollocations($options);
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
            } else {
                echo json_encode(array('error' => 'INCORRECT_ID_OR_METHOD'));
            }

        break;

    case 'collocation': {
        if ($route[3]) {

            if ($method === 'GET') {
                $explodedString = explode("?", $route[3]);
                $id = $explodedString[0];
                $options = json_decode(urldecode($explodedString[1]), true);

                $result = $collCRUD->getCollocation($id);
                if ($result === false) {
                    header('HTTP/ 404 NOT_FOUND ');
                    exit();
                }
                //echo json_encode($result);

                $surroundings = $collCRUD->getCollocationSurroundings($id, $options);
                if ($surroundings === false) {
                    header('HTTP/ 400 QUERY_ERROR');
                    exit();
                }
                $result["surroundings"] = $surroundings;

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