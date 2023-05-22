<?php
    include 'callAPI.php';                        //functions to call APIs
	include_once 'admin_token.php';               //function to get admin token
	include_once 'api.php';                       //functions for specific APIs. explore the file to see the contents

	$admin_token = getAdminToken()['access_token'];  //admin token
	$contentBodyJson = file_get_contents('php://input');
	$content = json_decode($contentBodyJson, true);
	$arc = new ApiSdk();  //not used in this example, but this calls functions from api.php

	$baseUrl = getMarketplaceBaseUrl(); //get the marketplace URL
	$packageId = getPackageID(); //get the plugin ID

	//in this example, we're receiving an ID from an external platform
	$product_id = $content['id'];
	error_log(json_encode('Product ID from webhook: '.$product_id));

	//we want to search for that ID in our custom table
    //according to the API documentation, below is the request body for Search Custom Table API
    $data = [
        [
            'Name' => 'product_id',
            'Operator' => 'eq',
            'Value' => $product_id
        ]
    ];

    //build the URL of the API
	$url =  $baseUrl . '/api/v2/plugins/'. $packageId .'/custom-tables/items';  // "items" here should be replaced by your custom table name

    //call the API by providing the arguments: method, token, url, request body
	$arcadier_item =  callAPI("POST", $admin_token, $url, $data);

    //log the response in /errors.php
	error_log(json_encode($arcadier_item));

    //further processing of data as you require

?>