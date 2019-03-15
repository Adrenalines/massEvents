<?php

//require_once 'checkaccess.php';
//checkaccess();
require_once 'functions.php';

//function connect() {
//     $conn = odbc_connect("DSN=" . DSN . ";UID=" . BD_USER . ";PWD=" . BD_PASS . "", "", "");
//     return $conn;
//}

$conn = connect();

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'main')) {
    if ($_REQUEST['test']=='second_chart'){


         $i = 2;
         $sql = "SELECT CONVERT(NVARCHAR(50),start_time,104) AS DATE
         , CONVERT(INT,hrs) AS DATA1
         , CONVERT(INT,INPUT_BYTES_DISPLAY) AS DATA0
    FROM OPENQUERY (extpm,'SELECT /*+ parallel(8) */ trunc(a.stime) start_time
                                  , round(MAX(a.TCH_TRAFFIC_1D_AGG),2) hrs
                                  , round(MAX(a.SDCCH_TRAFFIC_1D_AGG),2) INPUT_BYTES_DISPLAY
                             FROM mts_if.dc_managed_object bs
                             LEFT JOIN mts_datacollector.BSS_2G_G3_L1_D a ON a.mo_id = bs.id
where bs.external_key IN (''SLA_OBJECT[78]:SPB_ARENA_FWCR_C2'')  
and a.stime BETWEEN to_date(''$startDate'') and to_date(''$endDate'')
GROUP BY bs.external_key, a.stime ORDER BY bs.external_key, a.stime
   ')";
         //echo $sql;
         $result = odbc_exec($conn, $sql);
         $data = getData($result);
    //     print_r($data);
         $j = 0;
         $points = array();
         $dates = array();

         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }

              //array_push($dates, $data[$j]['DATE']);
              array_push($dates, date('Y-m-d H:i:s.u', strtotime($data[$j]['DATE'])));

              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end' => $end_date,
             'points' => $points,
             'dates' => $dates,
             'data' => $data
         ));


    } else if ($_REQUEST['test']=='third_chart'){

      /*
        $sql = "exec [perfmonExtPM].[MAIN] @TYPE = 'CHART'"
                    . ", @KPI_FIELD='{$regList}', @START_DATE = '{$startDate}', @END_DATE = '{$endDate}', @TIME_AGGR = '{$aggregation}'"
                    . ", @SRV_LIST = '{$list}',@SRV_TYPE = '{$srvType}', @SRV_LIST_H = '{$listHead}', @COUNT_REG ='{$countReg}'";
      */

        $startDate = $_REQUEST['startDate'];
        $newtimestamp = strtotime('+86399 seconds', strtotime($_REQUEST['endDate'])); // Добавляем к конечной дате 23:59:59
        $endDate = date('Y-m-d H:i:s', $newtimestamp);



        $tableName = 'v$rman_backup_job_details';
        $i = 2;
        //$sql = "EXEC [dbo].[PEFR_DB_EXT_MAIN] @INPUT_TYPE = 'DB FULL'";
        $sql = "SELECT CONVERT(NVARCHAR(50),start_time,104) AS DATE
                     , hrs AS DATA1
                     , INPUT_BYTES_DISPLAY AS DATA0
                FROM OPENQUERY ([ext_pm],'SELECT /*+ parallel(8) */ trunc(a.stime) start_time
                                              , round(MAX(a.TCH_TRAFFIC_1D_AGG),2) hrs
                                              , round(MAX(a.SDCCH_TRAFFIC_1D_AGG),2) INPUT_BYTES_DISPLAY
                                         FROM mts_if.dc_managed_object bs
                                         LEFT JOIN mts_datacollector.BSS_2G_G3_L1_D a ON a.mo_id = bs.id
          where bs.external_key IN (''SLA_OBJECT[78]:SPB_ARENA_FWCR_C2'')  
          and a.stime BETWEEN to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') and to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')
          GROUP BY bs.external_key, a.stime ORDER BY bs.external_key, a.stime
               ')";

        //echo $sql;        

        $result = odbc_exec($conn, $sql);
         $data = getData($result);
    //     print_r($data);
         $j = 0;
         $points = array();
         $dates = array();

         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }

              //array_push($dates, $data[$j]['DATE']);
              array_push($dates, date('Y-m-d H:i:s.u', strtotime($data[$j]['DATE'])));

              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end' => $end_date,
             'points' => $points,
             'dates' => $dates,
             'data' => $data
         ));






         /*$i = 2;
         $sql = "EXEC dbo.PEFR_DB_EXT_MAIN @INPUT_TYPE = 'DB FULL'";
         //echo $sql;
         $result = odbc_exec($conn, $sql);
         $data = getData($result);
    //     print_r($data);
         $j = 0;
         $points = array();
         $dates = array();
         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }
              //array_push($dates, $data[$j]['DATE']);
              //array_push($dates, date('Y-m-d H:i:s.u', strtotime($data[$j]['DATE'])));
              //array_push($dates, (strtotime($data[$j]['DATE']) + 3 * 60 * 60)*1000);


              $datetime1 = date('Y, n, j', strtotime($data[$j]['DATE']. ' - 1 month') + 3 * 60 * 60); //converts date from 2012-01-10 (mysql date format) to the format Highcharts understands 2012, 1, 10
              //$datetime2 = 'Date.UTC('.$datetime1.'), '.$data[$j]['DATA0']; //getting the date into the required format for pushing the Data into the Series
              $datetime2 = 'Date.UTC('.$datetime1.')';
              array_push($dates, $datetime2);


              //array_push($dates, "Date.UTC(1970, 10, 25)");
              //array_push($dates, gmdate('Y-m-d H:i:s', strtotime($data[$j]['DATE'])+ 3 * 60 * 60));

              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end' => $end_date,
             'points' => $points,
             'dates' => $dates,
             'data' => $data
         ));*/

    } else if ($_REQUEST['test'] == 'fifth_chart'){

         $i = 3;
         $sql = "SELECT STIME as DATE
                      , CONVERT(INT,ORADATA) as DATA0
                      , CONVERT(INT,ORADATASSD) as DATA1
                      , CONVERT(INT,ORADATAFAST) as DATA2
                 FROM (
                      SELECT *
                      FROM (SELECT STIME,NAME,used_PRC  FROM VM_ASM_DISKGROUP) SourceTable
                      UNPIVOT(a FOR Properties  in (used_PRC))as UnpivotResultTable) UnpivotTable
                PIVOT (
                    MAX(a) FOR NAME in ([ORADATA],[ORADATASSD],[ORADATAFAST])) PivotTable order by STIME ASC";
         //echo $sql;
         $result = odbc_exec($conn, $sql);
         $data = getData($result);
    //     print_r($data);
         $j = 0;
         $points = array();
         $dates = array();

         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }
              array_push($dates, $data[$j]['DATE']);
              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end'   => $end_date,
             'points'      => $points,
             'dates'       => $dates,
             'data'        => $data
         ));




    } else if ($_REQUEST['test'] == 'six_chart'){

        $startDate = $_REQUEST['startDate'];
        $endDate = $_REQUEST['endDate'];

         $i = 2;
         $sql = "SELECT STIME as DATE
                      , CONVERT(INT,SIZE_TB) as DATA0
                      , CONVERT(INT,USEDSIZE_TB) as DATA1
               FROM OPENQUERY ([EXTPM], 'SELECT STIME
                                              , SIZE_TB
                                              , USEDSIZE_TB
                                         FROM MTS_NIOSS.V_DB_SIZE
                                         WHERE STIME BETWEEN ''$startDate'' and ''$endDate''
                  ')";
         //echo $sql;
         $result = odbc_exec($conn, $sql);
         $data = getData($result);
         //print_r($data);
         $j = 0;
         $points = array();
         $dates = array();

         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }
              array_push($dates, $data[$j]['DATE']);
              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end'   => $end_date,
             'points'      => $points,
             'dates'       => $dates,
             'data'        => $data
         ));




    } else if ($_REQUEST['test'] == 'fourth_chart'){

         $i = 2;
         $sql = "EXEC dbo.PEFR_DB_EXT_MAIN @INPUT_PARAMETR = 'SECOND_PART'";
         //echo $sql;
         $result = odbc_exec($conn, $sql);
         $data = getData($result);
    //     print_r($data);
         $j = 0;
         $points = array();
         $dates = array();
         while ($data[$j]) {
              for ($k = 0; $k < $i; $k++) {
                   if ($j == 0) {
                        $points[$k] = array();
                   }
                   array_push($points[$k], $data[$j]['DATA' . $k]);
              }
              array_push($dates, $data[$j]['DATE']);
              $j++;
         }
         $start_date = strtotime($data[0]['DATE']) + 3 * 60 * 60;
         $end_date = strtotime($data[$j - 1]['DATE']) + 3 * 60 * 60;
         echo json_encode(array(
             'point_start' => $start_date,
             'point_end' => $end_date,
             'points' => $points,
             'dates' => $dates,
             'data' => $data

         ));

    } else {

           $startDate = $_REQUEST['startDate'];
           $endDate = $_REQUEST['endDate'];
           $aggregation = $_REQUEST['aggregation'];
           $srvData = split(',', $_REQUEST['srv']);
           $srvType = $_REQUEST['srvType'];
           $countReg = $_REQUEST['countReg'];
           $regList =  $_REQUEST['regList'];
           $i = 0;
           while ($srvData[$i]) {
                if ($list == '') {
                     $list = $list . '[' . $srvData[$i] . ']';
                } else {
                     $list = $list . ',[' . $srvData[$i] . ']';
                }
                if ($listHead == '') {
                     $listHead = $listHead . 'ISNULL([' . $srvData[$i] . '],-1) as DATA' . $i;
                } else {
                     $listHead = $listHead . ',ISNULL([' . $srvData[$i] . '],-1) as DATA' . $i;
                }
                $i++;
           }
           $sql = "exec [perfmonExtPM].[MAIN] @TYPE = 'CHART'"
                    . ", @KPI_FIELD='{$regList}', @START_DATE = '{$startDate}', @END_DATE = '{$endDate}', @TIME_AGGR = '{$aggregation}'"
                    . ", @SRV_LIST = '{$list}',@SRV_TYPE = '{$srvType}', @SRV_LIST_H = '{$listHead}', @COUNT_REG ='{$countReg}'";
      //     echo $sql;
           $result = odbc_exec($conn, $sql);
           $data = getData($result);

           $j = 0;
           $start_date = $data[0]['DATE_SS'];
           $points = array();
           $dates = array();
           while ($data[$j]) {
                for ($k = 0; $k < $i; $k++) {
                     if ($j == 0) {
                          $points[$k] = array();
                     }
      //               $points[$j].push($data[$j]['DATA'.$k]);
                     array_push($points[$k], $data[$j]['DATA' . $k]);
                }
                array_push($dates, $data[$j]['DATE']);
                $j++;
           }
           $end_date = $data[$j - 1]['DATE_SS'];
           echo json_encode(array(
               'point_start' => $start_date,
               'point_end' => $end_date,
               'points' => $points,
               'dates' => $dates,
               'data' => $data
           ));

    }




} else if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'target')) {

     $startDate = $_REQUEST['startDate'];
     $endDate = $_REQUEST['endDate'];
     $aggregation = $_REQUEST['aggregation'];
     $srvData = $_REQUEST['srv'];
     $countReg = $_REQUEST['countReg'];
     $regList = $_REQUEST['regList'];
     $i = 2; // два целевых значения и один регион
     $sql = "exec [availReg].[MAIN] @TYPE = 'TARGET_CHART'"
              . ", @KPI_FIELD='{$srvData}', @START_DATE = '{$startDate}', @END_DATE = '{$endDate}', @TIME_AGGR = '{$aggregation}', @REG_LIST = '{$regList}'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);

     $j = 0;
     //$min=-1000;
     $start_date = $data[0]['DATE_SS'];
     $points = array();
     $dates = array();
     while ($data[$j]) {
          for ($k = 0; $k <= $i; $k++) {
               if ($j == 0) {
                    $points[$k] = array();
                    $min = $data[$j]['DATA' . $k];
               }
               array_push($points[$k], $data[$j]['DATA' . $k]);
               if ($min > $data[$j]['DATA' . $k]) {
                    $min = $data[$j]['DATA' . $k];
               }
          }
          array_push($dates, $data[$j]['DATE']);
          $j++;
     }
     $end_date = $data[$j - 1]['DATE_SS'];

     echo json_encode(array(
         'point_start' => $start_date,
         'point_end' => $end_date,
         'points' => $points,
         'dates' => $dates,
         'data' => $data,
         'min' => $min
     ));
} else if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'grid')) {

     $startDate = $_REQUEST['startDate'];
     $endDate = $_REQUEST['endDate'];
     $aggregation = $_REQUEST['aggregation'];
     $srvData = $_REQUEST['srv'];
     $regList = $_REQUEST['regList'];
     $i = 0;
     $typeProc = $_REQUEST['target'] == 'true' ? 'TARGET_CHART' : 'TABLE_DATA_CHART_V2';
     $sql = "exec [availReg].[MAIN] @TYPE = '{$typeProc}',@SRV_TYPE = '{$srvType}', @START_DATE = '{$startDate}', @END_DATE = '{$endDate}', @TIME_AGGR = '{$aggregation}', @REG_LIST = '{$regList}'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     $data = getData($result);

     echo json_encode(array(
         'data' => $data
     ));
}