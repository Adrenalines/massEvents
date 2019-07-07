<?php

set_time_limit(36000 * 6);
require_once 'functions.php';
$conn = connect();

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'NEW_GR_TREE') {
     $sql = "select distinct gruppa
             FROM [Stat_Result].[dbo].[T_massEvents_GR_List]
             ORDER BY gruppa";
     $result = odbc_exec($conn, $sql);
     $data = getData($result);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['gruppa'];
          $data[$i]['name'] = $data[$i]['gruppa'];
          $data[$i]['text'] = $data[$i]['gruppa'];
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $sql = "select distinct external_key
                  FROM [Stat_Result].[dbo].[T_massEvents_GR_List] m where gruppa = '{$data[$i]['gruppa']}'
                  ORDER BY external_key";
          $result = odbc_exec($conn, $sql);
          $dt = getData($result);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['external_key'];
               $dt[$j]['name'] = $dt[$j]['external_key'];
               $dt[$j]['text'] = $dt[$j]['external_key'];
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
          $j = 0;
          $data[$j]['children'][$j]['checked'] = true;
          $data[$j]['expanded'] = true;
     }
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'SLA_LOAD_TREE') {
     $sql1 = "SELECT DISTINCT MREG
              FROM [Stat_Result].[dbo].[T_massEvents_SLA_Load_List]
              ORDER BY MREG";
     $result1 = odbc_exec($conn, $sql1);
     $data = getData($result1);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['MREG'];
          $data[$i]['name'] = $data[$i]['MREG'];
          $data[$i]['text'] = $data[$i]['MREG'];
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $normStrMREG = iconv('utf-8', 'cp1251', $data[$i]['MREG']);
          $sql2 = "SELECT DISTINCT REG
                   FROM [Stat_Result].[dbo].[T_massEvents_SLA_Load_List]
                   WHERE MREG = '$normStrMREG'
                   ORDER BY REG";
          $result2 = odbc_exec($conn, $sql2);
          $dt = getData($result2);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['REG'];
               $dt[$j]['name'] = $dt[$j]['REG'];
               $dt[$j]['text'] = $dt[$j]['REG'];
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = false;
               $normStrREG = iconv('utf-8', 'cp1251', $dt[$j]['REG']);
               $sql3 = "SELECT DISTINCT EXTERNAL_KEY
                        FROM [Stat_Result].[dbo].[T_massEvents_SLA_Load_List]
                        WHERE REG = '$normStrREG'
                        ORDER BY EXTERNAL_KEY";
               $result3 = odbc_exec($conn, $sql3);
               $st = getData($result3);
               $k = 0;
               while ($st[$k]) {
                    $st[$k]['id'] = $st[$k]['EXTERNAL_KEY'];
                    $st[$k]['name'] = $st[$k]['EXTERNAL_KEY'];
                    $st[$k]['text'] = $st[$k]['EXTERNAL_KEY'];
                    $st[$k]['checked'] = false;
                    $st[$k]['leaf'] = true;
                    $k++;
               }
               $dt[$j]['children'] = $st;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     $k = 0;
     $data[$k]['expanded'] = true;
     $data[$k]['children'][$k]['expanded'] = true;
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'GEO_LOAD_TREE') {
     $sql1 = "SELECT DISTINCT MREG
              FROM [Stat_Result].[dbo].[T_massEvents_GEO_Load_List]
              ORDER BY MREG";
     $result1 = odbc_exec($conn, $sql1);
     $data = getData($result1);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['MREG'];
          $data[$i]['name'] = $data[$i]['MREG'];
          $data[$i]['text'] = $data[$i]['MREG'];
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $normStrMREG = iconv('utf-8', 'cp1251', $data[$i]['MREG']);
          $sql2 = "SELECT DISTINCT REG
                   FROM [Stat_Result].[dbo].[T_massEvents_GEO_Load_List]
                   WHERE MREG = '$normStrMREG'
                   ORDER BY REG";
          $result2 = odbc_exec($conn, $sql2);
          $dt = getData($result2);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['REG'];
               $dt[$j]['name'] = $dt[$j]['REG'];
               $dt[$j]['text'] = $dt[$j]['REG'];
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = false;
               $normStrREG = iconv('utf-8', 'cp1251', $dt[$j]['REG']);
               $sql3 = "SELECT DISTINCT GEO_UNIT
                        FROM [Stat_Result].[dbo].[T_massEvents_GEO_Load_List]
                        WHERE REG = '$normStrREG'
                        ORDER BY GEO_UNIT";
               $result3 = odbc_exec($conn, $sql3);
               $st = getData($result3);
               $k = 0;
               while ($st[$k]) {
                    $st[$k]['id'] = $st[$k]['GEO_UNIT'];
                    $st[$k]['name'] = $st[$k]['GEO_UNIT'];
                    $st[$k]['text'] = $st[$k]['GEO_UNIT'];
                    $st[$k]['checked'] = false;
                    $st[$k]['leaf'] = true;
                    $k++;
               }
               $dt[$j]['children'] = $st;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     $k = 0;
     $data[$k]['expanded'] = true;
     $data[$k]['children'][$k]['expanded'] = true;
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'REGION_LOAD_TREE') {
     $sql1 = "SELECT DISTINCT MREG
              FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
              ORDER BY MREG";
     $result1 = odbc_exec($conn, $sql1);
     $data = getData($result1);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['MREG'];
          $data[$i]['name'] = $data[$i]['MREG'];
          $data[$i]['text'] = $data[$i]['MREG'];
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $normStr = iconv('utf-8', 'cp1251', $data[$i]['MREG']);
          $sql2 = "SELECT DISTINCT REG
                   FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
                   WHERE MREG = '$normStr'
                   ORDER BY REG";
          $result2 = odbc_exec($conn, $sql2);
          $dt = getData($result2);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['REG'];
               $dt[$j]['name'] = $dt[$j]['REG'];
               $dt[$j]['text'] = $dt[$j]['REG'];
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'PL_LOAD_TREE') {
     $sql1 = "SELECT DISTINCT MREG
              FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
              ORDER BY MREG";
     $result1 = odbc_exec($conn, $sql1);
     $data = getData($result1);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['MREG'];
          $data[$i]['name'] = $data[$i]['MREG'];
          $data[$i]['text'] = $data[$i]['MREG'];
          $data[$i]['expandRegion'] = false;
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $normStrMREG = iconv('utf-8', 'cp1251', $data[$i]['MREG']);
          $sql2 = "SELECT DISTINCT REG
                   FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
                   WHERE MREG = '$normStrMREG'
                   ORDER BY REG";
          $result2 = odbc_exec($conn, $sql2);
          $dt = getData($result2);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['REG'];
               $dt[$j]['name'] = $dt[$j]['REG'];
               $dt[$j]['text'] = $dt[$j]['REG'];
               $dt[$j]['expandRegion'] = true;
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = false;
               $dt[$j]['children']['text'] = 'Идёт загрузка...';
               $dt[$j]['children']['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     $help['id'] = "KPI по PL не выгружаются, они для выбора BTS/сот";
     $help['name'] = "KPI по PL не выгружаются, они для выбора BTS/сот";
     $help['text'] = "KPI по PL не выгружаются, они для выбора BTS/сот";
     $help['leaf'] = true;
     array_unshift($data, $help);
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'PL_LOAD_TREE_ADD_PL') {
     $region = iconv('utf-8', 'cp1251', $region);
     $sql3 = "SELECT DISTINCT NE_SITE_NAME
               FROM [Stat_Result].[dbo].[T_massEvents_PL_Load_List]
               WHERE REG = '$region'
               ORDER BY NE_SITE_NAME";
     $result3 = odbc_exec($conn, $sql3);
     $st = getData($result3);
     $k = 0;
     while ($st[$k]) {
          $st[$k]['id'] = $st[$k]['NE_SITE_NAME'];
          $st[$k]['name'] = $st[$k]['NE_SITE_NAME'];
          $st[$k]['text'] = $st[$k]['NE_SITE_NAME'];
          $bt[$k]['expandRegion'] = false;
          $st[$k]['checked'] = false;
          $st[$k]['leaf'] = true;
          $k++;
     }
     $data = $st;
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'BTS_CELL_LOAD_TREE') {
     $sql1 = "SELECT DISTINCT MREG
              FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
              ORDER BY MREG";
     $result1 = odbc_exec($conn, $sql1);
     $data = getData($result1);
     $i = 0;
     while ($data[$i]) {
          $data[$i]['id'] = $data[$i]['MREG'];
          $data[$i]['name'] = $data[$i]['MREG'];
          $data[$i]['text'] = $data[$i]['MREG'];
          $data[$i]['expandRegion'] = false;
          $data[$i]['expandBts'] = false;
          $data[$i]['checked'] = false;
          $data[$i]['leaf'] = false;
          $normStrMREG = iconv('utf-8', 'cp1251', $data[$i]['MREG']);
          $sql2 = "SELECT DISTINCT REG
                   FROM [Stat_Result].[dbo].[T_massEvents_REGION_Load_List]
                   WHERE MREG = '$normStrMREG'
                   ORDER BY REG";
          $result2 = odbc_exec($conn, $sql2);
          $dt = getData($result2);
          $j = 0;
          while ($dt[$j]) {
               $dt[$j]['id'] = $dt[$j]['REG'];
               $dt[$j]['name'] = $dt[$j]['REG'];
               $dt[$j]['text'] = $dt[$j]['REG'];
               $dt[$j]['expandRegion'] = true;
               $dt[$j]['expandBts'] = false;
               $dt[$j]['checked'] = false;
               $dt[$j]['leaf'] = false;
               $dt[$j]['children']['text'] = 'Идёт загрузка...';
               $dt[$j]['children']['leaf'] = true;
               $j++;
          }
          $data[$i]['children'] = $dt;
          $i++;
     }
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'BTS_CELL_LOAD_TREE_ADD_BTS') {
     $region = iconv('utf-8', 'cp1251', $region);
     $sql3 = "SELECT DISTINCT BTS_NAME
               FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
               WHERE REG = '$region'
               ORDER BY BTS_NAME";
     $result3 = odbc_exec($conn, $sql3);
     $bt = getData($result3);
     $k = 0;
     while ($bt[$k]) {
          $bt[$k]['id'] = $bt[$k]['BTS_NAME'];
          $bt[$k]['name'] = $bt[$k]['BTS_NAME'];
          $bt[$k]['text'] = $bt[$k]['BTS_NAME'];
          $bt[$k]['expandRegion'] = false;
          $bt[$k]['expandBts'] = true;
          $bt[$k]['checked'] = false;
          $bt[$k]['leaf'] = false;
          $bt[$k]['children']['text'] = 'Идёт загрузка...';
          $bt[$k]['children']['leaf'] = true;
          $k++;
     }
     $data = $bt;
     returnData($data);
} else

if (isset($_REQUEST['type']) && $_REQUEST['type'] == 'BTS_CELL_LOAD_TREE_ADD_CELL') {
     $bts = iconv('utf-8', 'cp1251', $bts);
     $sql4 = "SELECT DISTINCT CELLNAME
               FROM [Stat_Result].[dbo].[T_massEvents_BTS_CELL_Load_List]
               WHERE BTS_NAME = '$bts'
               ORDER BY CELLNAME";
     $result4 = odbc_exec($conn, $sql4);
     $ct = getData($result4);
     $m = 0;
     while ($ct[$m]) {
          $ct[$m]['id'] = $bts . $ct[$m]['CELLNAME'];
          $ct[$m]['name'] = $ct[$m]['CELLNAME'];
          $ct[$m]['text'] = $ct[$m]['CELLNAME'];
          $ct[$m]['checked'] = false;
          $ct[$m]['leaf'] = true;
          $m++;
     }
     $data = $ct;
     returnData($data);
}
