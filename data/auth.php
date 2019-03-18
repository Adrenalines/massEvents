<?php

require_once 'checkaccess.php';
checkaccess();

//require_once '../../resources/phpcommon/addLogs.php';
require_once 'functions.php';
$conn = connect();
$response = array();
$width = $_REQUEST['width'];
$height = $_REQUEST['height'];
$browserName = $_REQUEST['browserName'];
$windowZoomLvl = $_REQUEST['windowZoomLvl'];
$response = array(
);
$response['USER'] = $_SERVER['REMOTE_USER'];

addLog($conn, 'PERF_MON_EXTPM', 'ENTER');

header('Content-Type: application/x-json');
//echo json_encode($response);

echo json_encode(array(
    'USER' => $response
));
