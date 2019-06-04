<?php

require_once 'checkaccess.php';
checkaccess();
require_once 'functions.php';
$conn = connect();
$response = array();
$width = $_REQUEST['width'];
$height = $_REQUEST['height'];
$browserName = $_REQUEST['browserName'];
$windowZoomLvl = $_REQUEST['windowZoomLvl'];
$response = array();
$response['USER'] = $_SERVER['REMOTE_USER'];
echo json_encode(array(
    'USER' => $response
));

addLog($conn, 'MassEvents', 'ENTER');

header('Content-Type: application/x-json');


