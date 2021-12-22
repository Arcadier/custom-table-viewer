<?php
    //include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);

    $field1 = $content["field1"];
    $field2 = $content["field2"];

    //process
    //API call
    $response = "FIeld 1 is " . $field1 . " and field 2 is " . $field2;  //sync of items

    echo $response;

?>


