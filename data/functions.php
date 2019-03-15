<?php

//require_once 'checkaccess.php';
//checkaccess();

require_once(dirname(__FILE__) . "/settings.php");
/*
 * Функция соединения с сервером данных через ODBC 
 */

function connect() {
     $conn = odbc_connect("DSN=" . DSN . ";UID=" . BD_USER . ";PWD=" . BD_PASS . "", "", "");
     return $conn;
}

;
/*
 * Функция вывода данных на клиент. Выводим в формате json.
 * $finalData - массив с данными для вывода
 */

function returnData($finalData) {
     @header('Content-Type: application/json');
     echo json_encode($finalData);
}

function getData($result, $res_type = 'json') {
     $data = array();
     $n_column = odbc_num_fields($result);
     switch ($res_type) {
          case 'json':
               while ($row = odbc_fetch_row($result)) {
                    $res = null;
//                    print_r($row);
                    for ($i = 1; $i <= $n_column; $i++) {
                         $field_type = odbc_field_type($result, $i);
                         $field_name = odbc_field_name($result, $i);
//                         echo ("  " . $field_name . "|||" . $field_type);
                         switch ($field_type) {
                              case 'nvarchar': case 'ntext':
                                   $res[odbc_field_name($result, $i)] = iconv('cp1251', 'utf-8', odbc_result($result, $i));
                                   break;
                              case 'int':
//                                   echo ("  ".$field_name."|||".$field_type."-".odbc_result($result, $i));
                                   if (intval(odbc_result($result, $i)) == -1) {
                                        $res[odbc_field_name($result, $i)] = null;
                                   } else {
                                        $res[odbc_field_name($result, $i)] = intval(odbc_result($result, $i));
                                   }
                                   break;
                              case 'float':
//                                   echo round(odbc_result($result, $i), 4);
//                                   echo ($field_name);
                                   if (round(odbc_result($result, $i), 4) == -1) {
                                        $res[odbc_field_name($result, $i)] = null;
//                                        echo 'nen';
                                   } else {
                                        $res[odbc_field_name($result, $i)] = round(odbc_result($result, $i), 4);
                                   }
                                   break;
                              default:
                                   $res[odbc_field_name($result, $i)] = iconv('cp1251', 'utf-8', odbc_result($result, $i));
                         }

//                    $res[odbc_field_name($result, $i)] = iconv('cp1251', 'utf-8', odbc_result($result, $i));
                    }
                    $data[] = $res;
               }
               break;
          case 'array':
               while ($row = odbc_fetch_row($result)) {
                    $res = null;
                    for ($i = 1; $i <= $n_column; $i++) {

                         $field_type = odbc_field_type($result, $i);
//                        echo $field_type;
                         switch ($field_type) {
                              case 'nvarchar': case 'ntext':
                                   $res = iconv('cp1251', 'utf-8', odbc_result($result, $i));
                                   break;
                              case 'int':
//                                    echo round(odbc_result($result, $i), 4);
                                   $res = intval(odbc_result($result, $i));
                                   break;
                              case 'float':
//                                   echo round(odbc_result($result, $i), 4);
                                   $res = round(odbc_result($result, $i), 4);
                                   break;
                              default:
                                   $res = odbc_result($result, $i);
//                                    echo round(odbc_result($result, $i), 4);
                         }
                         $data[$i - 1][] = $res;
                    }
               }
               break;
     }
     return $data;
}

/*
 * Функция занесения манипуляции с приложением в логи в логи
 * $type - тип манипуляции
 */

function addLog($conn, $type, $flag1 = Null) {
//    if ($_SERVER['REMOTE_HOST'] !== '0600wstrgko0004.ug.mts.ru') {
     $sql = "INSERT INTO WR_Logs
        SELECT '{$_SERVER['REMOTE_USER']}', '{$_SERVER['REMOTE_HOST']}', '{$_SERVER['REMOTE_ADDR']}', '{$type}', GETDATE(), '{$flag1}', NULL";
     odbc_exec($conn, $sql);
//        $sql = "INSERT INTO WR_Users_Info
//        SELECT '{$_SERVER['REMOTE_USER']}', '{$_SERVER['REMOTE_HOST']}', '{$_SERVER['REMOTE_ADDR']}', '{$type}', GETDATE(), '{$flag1}', NULL";
//        odbc_exec($conn, $sql);
//    }
}

/*
 * Функция занесения дополнительной информации о пользователе
 * $type - тип манипуляции
 */

function addExtUserInfo($conn, $width, $height, $browserName, $browserVersion, $userAgent, $osName, $osDeviceType, $windowZoomLvl) {

     $sql = "INSERT INTO WR_Users_Info
        SELECT '{$height}', '{$width}', '{$browserName}', '{$browserVersion}', '{$osName}', '{$osDeviceType}', '{$windowZoomLvl}','{$userAgent}', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['REMOTE_USER']}', '{$_SERVER['REMOTE_HOST']}',   GETDATE()";
//     echo $sql;
     odbc_exec($conn, $sql);
}

/*
 * Функция занесения манипуляции с изменением рассылки в логи
 * $type - тип манипуляции
 */

function addSendLog($conn, $action, $field1 = Null) {
     $sql = "INSERT INTO FIKSSI_CHANGE_LOG
        SELECT '{$action}' as ACTION, '{$field1}' AS FIELD1, '{$_SERVER['REMOTE_USER']}' as LOGIN, GETDATE() AS DATE_ACTION";
     odbc_exec($conn, $sql);
}
