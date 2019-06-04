<?php

require_once 'functions.php';

$conn = connect();

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'main')) {
     $regList = stripslashes($regList);
     if ($regList == "") {
          $regList = "''";
     }
    if ($_REQUEST['test']=='2G Traffic, CSSR, Availability') {
     

         $i = 4;
         $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
         TCH_Traffic AS DATA0, SDCCH_Traffic AS DATA1, CSSR AS DATA2,
         BSS_Availability_Rate AS DATA3
    FROM [dbo].T_massEvents_Result_2G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
      //  echo $sql;
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


    } else if ($_REQUEST['test']=='2G DCR, BCR') {
     $i = 3;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Drop_Call_Rate AS DATA0, SDCCH_Blocking_Rate AS DATA1,
     TCH_Serv_Blocking_Rate AS DATA2
FROM [dbo].T_massEvents_Result_2G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='2G Cells, Calls') {
     $i = 2;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     CELL_Count_2G AS DATA0, Calls_Count_2G AS DATA1
FROM [dbo].T_massEvents_Result_2G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='3G SP') {
     $i = 5;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Traff_Sp AS DATA0, Drop_Sp AS DATA1, CSSR_Sp AS DATA2,
Block_Sp AS DATA3, RAN_Availability AS DATA4
FROM [dbo].T_massEvents_Result_3G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='3G Data') {
     $i = 3;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Drop_Data AS DATA0, CSSR_Data AS DATA1, Block_Data AS DATA2
FROM [dbo].T_massEvents_Result_3G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='3G Cells, Calls') {
     $i = 2;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     CELL_Count_3G AS DATA0, Calls_Count_3G AS DATA1
FROM [dbo].T_massEvents_Result_3G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='3G Data Traffic, THR') {
     $i = 5;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Traff_Data_3G AS DATA0, Traff_Data_DL_3G AS DATA1, Traff_Data_UL_3G AS DATA2,
     HSDPA_USER_DC_THR AS DATA3, HSUPA_USER_THR AS DATA4
FROM [dbo].T_massEvents_Result_3G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='4G DPH_UE, CSSR_LTE') {
     $i = 3;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     DpH_UE AS DATA0, CSSR_LTE AS DATA1, LTE_RAN_Avail AS DATA2
FROM [dbo].T_massEvents_Result_4G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='4G Traffic, Thr, User_Max') {
     $i = 7;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Traff_Data_4G AS DATA0, Traff_Data_DL_4G AS DATA1, Traff_Data_UL_4G AS DATA2,
     UE_Throughput_DL AS DATA3, UE_Throughput_UL AS DATA4, LTE_User_Max AS DATA5, CELL_Count_4G AS DATA6
FROM [dbo].T_massEvents_Result_4G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='4G VoLTE') {
     $i = 3;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Traff_VoLTE AS DATA0, DpH_VoLTE_UE AS DATA1, CSSR_VoLTE AS DATA2
FROM [dbo].T_massEvents_Result_4G_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='4G Sharing') {
     $i = 3;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     E_RAB_Retainability_Sharing AS DATA0, InitialEPSBEstabSR_Sharing AS DATA1,
     CellAvailability_Sharing AS DATA2
FROM [dbo].T_massEvents_Result_4G_Sharing_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    } else if ($_REQUEST['test']=='4G Sharing Traffic, Thp') {
     $i = 5;
     $sql = "SELECT CONVERT(NVARCHAR(50),STime,120) AS DATE,
     Traff_Sharing AS DATA0, Traff_DL_Sharing AS DATA1, Traff_UL_Sharing AS DATA2,
     Downlink_Thp_Sharing AS DATA3, Uplink_Thp_Sharing AS DATA4
FROM [dbo].T_massEvents_Result_4G_Sharing_SLA
where Managed_Object IN ($regList)
and STime BETWEEN '$startDate' and '$endDate'
ORDER BY STime";
  //  echo $sql;
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
    }
/*
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
     ));*/
} 