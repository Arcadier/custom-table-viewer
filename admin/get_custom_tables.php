<?php
    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);
    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();

    $table_name = $content['table_name'];
    $plugin_id = $content['plugin_id'];

    $url = $baseUrl . '/api/v2/plugins/' . $plugin_id . '/custom-tables/' . $table_name;
    $response  = callAPI('GET', $admin_token['access_token'], $url, false);

    echo json_encode($response);
?>