<?php

//require_once 'checkaccess.php';
//checkaccess();
set_time_limit(36000 * 6);
require_once 'functions.php';
$conn = connect();

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'NEW_MR_TREE') {
     $sql = "exec [availReg].[MAIN] @TYPE = '{$_REQUEST['type']}'";
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     $i = 0;
     while ($data[$i]) {
          $sql = "exec [availReg].[MAIN] @TYPE = 'NEW_REGION_TREE', @MR = '{$data[$i]['Id']}'";
          $result = odbc_exec($conn, $sql);
          $dt = getData($result);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          if ($data[$i]['Name'] === 'БЕР') {
               $data[$i]['checked'] = false;
          } else {
               $data[$i]['checked'] = true;
          }
//          if ($_REQUEST['type'] == 'NEW_MR_TREE_ALARM') {
//               $data[$i]['checked'] = false;
//          } else {
//               $data[$i]['checked'] = true;
//          }
          $i++;
     }
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'CLUSTER_TREE') {
     $sql = "exec FIKSSI_MAIN @TYPE = '{$_REQUEST['type']}'";
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     $i = 0;
     while ($data[$i]) {
          $sql = "exec FIKSSI_MAIN @TYPE = 'CLUSTER_REGION_TREE', @CLUSTER_ID = '{$data[$i]['Id']}'";

          $result = odbc_exec($conn, $sql);
          $dt = getData($result);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $data[$i]['checked'] = true;
          $i++;
     }
     returnData($data);
} else

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'SEND_GROUP_TREE')) {
     $sql = "exec FIKSSI_MAIN @TYPE = '{$_REQUEST['type']}'";
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     $i = 0;
     while ($data[$i]) {
          $sql = "exec FIKSSI_MAIN @TYPE = 'SEND_USER_TREE', @ID_GROUP = '{$data[$i]['ID']}'";
          $result = odbc_exec($conn, $sql);
          $dt = getData($result);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     returnData($data);
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'search')) {
     $OBJ = iconv("utf-8", "windows-1251", filter_input(INPUT_POST, 'obj'));
//    echo $ID;
     $sql = "exec FIKSSI_MAIN @TYPE  = 'SEARCH_MR', @SEARCH_OBJ = '{$OBJ}'";
//    echo $sql;
     $result = odbc_exec($conn, $sql);
     $nColumn = odbc_num_fields($result);
     while ($row = odbc_fetch_row($result)) {
          for ($i = 1; $i <= $nColumn; $i++) {
               $res[odbc_field_name($result, $i)] = trim(iconv('cp1251', 'utf-8', odbc_result($result, $i)));
          };
          $finalData[] = $res;
     }
     if ($finalData === null) {
//        echo json_encode('no reply');
          $err = array();
          $err['failure'] = true;
          $err['msg'] = odbc_errormsg();
          echo json_encode($err);
     } else {
          returnData($finalData);
     }
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'SAVE_ALARMS')) {
//    print_r($_SERVER);
     $regions = trim($_REQUEST['REGIONS']);
     $TV_DAY_PERS = $_REQUEST['TV_DAY_PERS'];
     $CPD_DAY_PERS = $_REQUEST['CPD_DAY_PERS'];
     $TLF_DAY_PERS = $_REQUEST['TLF_DAY_PERS'];
     $TV_NIGHT_PERS = $_REQUEST['TV_NIGHT_PERS'];
     $CPD_NIGHT_PERS = $_REQUEST['CPD_NIGHT_PERS'];
     $TLF_NIGHT_PERS = $_REQUEST['TLF_NIGHT_PERS'];
     $sql = "UPDATE FIKSSI_REGION_ALARMS"
              . " SET TV_NIGHT_PERS = '{$TV_NIGHT_PERS}', CPD_NIGHT_PERS = '{$CPD_NIGHT_PERS}', TLF_NIGHT_PERS = '{$TLF_NIGHT_PERS}',"
              . " TV_DAY_PERS = '{$TV_DAY_PERS}', CPD_DAY_PERS = '{$CPD_DAY_PERS}', TLF_DAY_PERS = '{$TLF_DAY_PERS}'"
              . " WHERE STAT_KOD_REG IN ({$regions})";
//     print $sql;
     odbc_exec($conn, $sql);
     $result = odbc_exec($conn, $sql);
     addSendLog($conn, 'change_region_alarms', $regions);
     echo str_replace("null", "\"\"", json_encode(array(
         'success' => true,
         'msg' => 'Данные успешно изменены!'
     )));
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'SAVE_USERS')) {
//    print_r($_SERVER);
//     $regions = trim($_REQUEST['REGIONS']);
     $FIO = iconv("utf-8", "windows-1251", $_REQUEST['FIO']);
     $ID = $_REQUEST['ID'];
     $ID_GROUP = $_REQUEST['ID_GROUP'];
     $COUNT_SEL = $_REQUEST['COUNT_SEL'];
     $SEND_FLAG = $_REQUEST['SEND_FLAG'];
     $NAME = $_REQUEST['Name'];
     if ($COUNT_SEL > 0) {
          $sql = "UPDATE FIKSSI_SEND_USERS"
                   . " SET FIO = '{$FIO}', ID_GROUP = '{$ID_GROUP}', SEND_FLAG = '{$SEND_FLAG}',[USER] = '{$NAME}'"
                   . " WHERE ID IN ({$ID})";
          $action = 'update_user';
     } else {
          $sql = "INSERT INTO FIKSSI_SEND_USERS"
                   . " SELECT '{$NAME}', '{$ID_GROUP}', '{$SEND_FLAG}', '{$FIO}'";
          $action = 'add_user';
     }
//     print $sql;
     odbc_exec($conn, $sql);
     addSendLog($conn, $action, $NAME);
     echo str_replace("null", "\"\"", json_encode(array(
         'success' => true,
         'msg' => 'Данные успешно изменены!'
     )));
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'REMOVE_USER')) {
//    print_r($_SERVER);
//     $regions = trim($_REQUEST['REGIONS']);
     $FIO = iconv("utf-8", "windows-1251", $_REQUEST['FIO']);
     $ID_GROUP = $_REQUEST['ID_GROUP'];
     $COUNT_SEL = $_REQUEST['COUNT_SEL'];
     $SEND_FLAG = $_REQUEST['SEND_FLAG'];
     $NAME = $_REQUEST['Name'];
     $ID = $_REQUEST['ID'];

     $sql = "DELETE FROM FIKSSI_SEND_USERS"
              . " WHERE ID IN ({$ID})";
//     print $sql;
     odbc_exec($conn, $sql);
     $result = odbc_exec($conn, $sql);

     addSendLog($conn, 'remove_user', $NAME);

     echo str_replace("null", "\"\"", json_encode(array(
         'success' => true,
         'msg' => 'Данные успешно изменены!'
     )));
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'GET_GROUPS')) {

     $sql = "SELECT ID, NAME FROM   FIKSSI_SEND_GROUP";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     returnData($data);
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'INC_DRILLDOWN')) {

     $regType = $_REQUEST['regType'];
     $time = $_REQUEST['time'];
     $aggr = $_REQUEST['aggr'];
     $regId = $_REQUEST['regId'];
     $downtime = $_REQUEST['downtime'];

     $sql = "exec [availReg].[MAIN] @TYPE  = '{$_REQUEST['type']}', @DATE = '{$time}', @AGGR = '{$aggr}', @REGION_ID = '{$regId}', @DOWNTIME = '{$downtime}'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     returnData($data);
} else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'SMILE_TABLE')) {
     
     $sql = "exec [availReg].[MAIN] @TYPE  = '{$_REQUEST['type']}', @WEEK='{$week}',@YEAR='{$year}'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     returnData($data);
}else
if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'SMILE_WEEK_COMBO')) {

     $sql = "exec [availReg].[MAIN] @TYPE  = '{$_REQUEST['type']}'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     returnData($data);
}