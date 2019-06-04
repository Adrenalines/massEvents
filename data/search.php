<?php
require_once 'checkaccess.php';
checkaccess();

require_once 'functions.php';
$conn = connect();
$FIELD = iconv("utf-8", "windows-1251", filter_input(INPUT_POST, 'field'));
$OBJ = iconv("utf-8", "windows-1251", filter_input(INPUT_POST, 'obj'));
$TREE = iconv("utf-8", "windows-1251", filter_input(INPUT_POST, 'tree'));

if ($TREE == "slaTreeLoad") {
     $sql = "SELECT DISTINCT external_key obj
             FROM [Stat_Result].[dbo].[T_massEvents_SLA_Load_List]
             WHERE external_key like '%{$OBJ}%'";
} else if ($TREE == "geoTreeLoad") {
     $sql = "SELECT DISTINCT geo_unit obj
             FROM [Stat_Result].[dbo].[T_massEvents_GEO_Load_List]
             WHERE geo_unit like '%{$OBJ}%'";
} else if ($TREE == "regionTreeLoad") {
     $sql = "SELECT DISTINCT reg obj
             FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
             WHERE reg like '%{$OBJ}%'";
} else if ($TREE == "btsCellTreeLoad") {
     $sql = "SELECT DISTINCT BTS_NAME obj
             FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
             WHERE BTS_NAME like '%{$OBJ}%'
             UNION ALL
             SELECT DISTINCT CELLNAME obj
             FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
             WHERE CELLNAME like '%{$OBJ}%'";
} else if ($TREE == "slaTree") {
     $sql = "SELECT DISTINCT external_key obj
             FROM [Stat_Result].[dbo].[T_massEvents_GR_List]
             WHERE external_key like '%{$OBJ}%'";
} else if ($TREE == "btsSearch") {
     $sql = "SELECT top 1 REG obj
             FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
             WHERE BTS_NAME = '{$OBJ}'";
} else if ($TREE == "cellSearch") {
     $sql = "SELECT top 1 BTS_NAME obj
             FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
             WHERE CELLNAME = '{$OBJ}'";
}

$result = odbc_exec($conn, $sql);
$nColumn = odbc_num_fields($result);
while ($row = odbc_fetch_row($result)) {
     for ($i = 1; $i <= $nColumn; $i++) {
          $res[odbc_field_name($result, $i)] = trim(iconv('cp1251', 'utf-8', odbc_result($result, $i)));
     };
     $finalData[] = $res;
}

if ($finalData === null) {
     $err = array();
     $err['failure'] = true;
     $err['msg'] = odbc_errormsg();
     echo json_encode($err);
} else {
     returnData($finalData);
}
