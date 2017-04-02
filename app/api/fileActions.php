<?php
/*todo: it should be refactored!*/
require_once "config.php";

class fileActions
{
    /* uploads file in $dir directory
     * return */

    public function uploadFile($data, $dir){

        $uploadDir = './'.$dir;
        $uploadFile = $uploadDir . basename($_FILES['userfile']['name']);

        if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadFile)) {
            return "success";
        } else return "fail";
    }

    /*html parser*/
}