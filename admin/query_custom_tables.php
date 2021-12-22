<?php
    include 'callAPI.php';
    include 'admin_token.php';

    $contentBodyJson = file_get_contents('php://input');
    $content = json_decode($contentBodyJson, true);
    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();

    $name = $content['Name'];
    $operator = $content['Operator'];
    $value = $content['Value'];
    $table_name = $content['table_name'];
    $plugin_id = $content['plugin_id'];

    $url = $baseUrl . '/api/v2/plugins/' . $plugin_id . '/custom-tables/' . $table_name;
    $data = [
        [
            'Name' => $name,
            'Operator' => $operator,
            'Value' => $value
        ]
    ];
    $response  = callAPI('POST', $admin_token['access_token'], $url, $data);

    echo json_encode($response);
?>