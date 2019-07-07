<?php

require_once 'functions.php';

$conn = connect();

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'minDate')) {
     $sql = "SELECT min(Stime) AS Stime from [Stat_Result].[dbo].T_massEvents_Result_2G";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'maxDate')) {
     $sql = "SELECT max(Stime) AS Stime from [Stat_Result].[dbo].T_massEvents_Result_2G";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'btsCell')) {
     $sql = "SELECT a.EXTERNAL_KEY
             FROM
               (SELECT * FROM openquery(extpm,'
                    SELECT b.EXTERNAL_KEY
                    FROM mts_objectrepository.rem_sla_$obj a
                    JOIN mts_if.dc_managed_object b ON b.id = a.source_mo_id
               ')) a
             JOIN [dbo].[T_massEvents_BTS_CELL_Load_List] b
                    ON a.external_key = b.bts_name collate Cyrillic_General_CI_AS
             UNION
             SELECT a.EXTERNAL_KEY
             FROM
               (SELECT * FROM openquery(extpm,'
                    SELECT b.external_key
                    FROM mts_objectrepository.rem_sla_$obj a
                    JOIN mts_if.dc_managed_object b on b.id = a.source_mo_id
               ')) a
             JOIN [dbo].[T_massEvents_BTS_CELL_Load_List] b
                    ON a.external_key = b.CELLNAME collate Cyrillic_General_CI_AS";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'geoBtsCell')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     $sql = "SELECT * FROM openquery(extpm,
     'SELECT DISTINCT NE_ALIAS as EXTERNAL_KEY
      FROM ETL.V_MV_CELL_BTS_FOR_EXTPM
      WHERE GEO_UNIT = ''$obj''
      ORDER BY NE_ALIAS ')";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'regionBtsCell')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     $sql = "SELECT DISTINCT BTS_NAME as EXTERNAL_KEY
             FROM [Stat_Result].[dbo].T_massEvents_BTS_CELL_Load_List
             WHERE REG = '$obj'
             ORDER BY BTS_NAME";
     $result = odbc_exec($conn, $sql);
     if ($result) {
          $data   = getData($result);
          echo json_encode(array('data' => $data));
     } else {
          return "";
     }
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'plBtsCell')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     $sql = "SELECT * FROM openquery(extpm,
     'SELECT DISTINCT NE_ALIAS as EXTERNAL_KEY
      FROM ETL.V_MV_CELL_BTS_FOR_EXTPM
      WHERE NE_SITE_NAME = ''$obj''
      ORDER BY NE_ALIAS ')";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'inputLike')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     $sql = "SELECT MREG
             FROM [Stat_Result].[dbo].T_massEvents_REGION_Load_List
             WHERE MREG like '%$obj%'
             UNION
             SELECT REG
             FROM [Stat_Result].[dbo].T_massEvents_REGION_Load_List
             WHERE REG like '%$obj%'
             UNION
             SELECT GEO_UNIT
             FROM [Stat_Result].[dbo].T_massEvents_GEO_Load_List
             WHERE GEO_UNIT like '%$obj%'
             UNION
             SELECT EXTERNAL_KEY
             FROM [Stat_Result].[dbo].T_massEvents_SLA_Load_List
             WHERE EXTERNAL_KEY like '%$obj%'
             UNION
             SELECT BTS_NAME collate Cyrillic_General_CI_AS
             FROM [Stat_Result].[dbo].T_massEvents_BTS_CELL_Load_List
             WHERE BTS_NAME like '%$obj%'
             UNION
             SELECT CELLNAME collate Cyrillic_General_CI_AS
             FROM [Stat_Result].[dbo].T_massEvents_BTS_CELL_Load_List
             WHERE CELLNAME like '%$obj%'";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'clearTables')) {
     $sql = "DELETE [Stat_Result].[dbo].T_massEvents_Result_H_2g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_H_3g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_H_4g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_H_Sh
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_D_2g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_D_3g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_D_4g
             WHERE ([USER] = '$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_D_Sh
             WHERE ([USER] = '$user')";
     odbc_exec($conn, $sql);
}


if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'deleteEmpty')) {
     $sql = "SELECT name
             FROM sys.columns
             WHERE object_id =  (SELECT object_id
                                FROM sys.tables
                                WHERE name = 'T_massEvents_Result_H_$kpiType')
             AND name NOT IN ('Managed_Object', 'STime', 'USER')";
     $result = odbc_exec($conn, $sql);

     $rows = array();
     $columns = array();

     while ($myRow = odbc_fetch_array($result)) {
          $rows[] = $myRow;
     }
     foreach ($rows as $row) {
          foreach ($row as $key => $value) {
               array_push($columns, $value);
          }
     }

     $isNullString = "";
     $countColumns = count($columns);
     for ($i = 0; $i < $countColumns; $i++) {
          $isNullString .= "AND (" . $columns[$i] . " IS NULL) ";
     }

     $sql = "DELETE [Stat_Result].[dbo].T_massEvents_Result_H_$kpiType
             WHERE ([USER]='$user') " . $isNullString;
     print_r($sql);
     odbc_exec($conn, $sql);
     $sql = "DELETE [Stat_Result].[dbo].T_massEvents_Result_D_$kpiType
             WHERE ([USER]='$user') " . $isNullString;
     print_r($sql);
     odbc_exec($conn, $sql);
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'chooseKpiSet')) {
     $kpiSet = iconv('utf-8', 'cp1251', $kpiSet);
     $sql = "SELECT KPI
             FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
             WHERE ([USER] = 'ALL' OR [USER]='$user')
             AND KPI_Set = '$kpiSet'";
     odbc_exec($conn, $sql);
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'checkCommonKpiSet')) {
     $kpiSet = iconv('utf-8', 'cp1251', $kpiSet);

     $sql = "SELECT top 1 1 as 'counts'
             FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
             WHERE KPI_Set = '$kpiSet' AND [USER]='$user'";
     $result = odbc_exec($conn, $sql);
     $counts = odbc_result($result, "counts");
     if ($counts) {
          echo json_encode(array('total' => "1"));
     } else {
          echo json_encode(array('total' => "0"));
          return;
     }
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'deleteKpiSet')) {
     $kpiSet = iconv('utf-8', 'cp1251', $kpiSet);

     $sql = "DELETE FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
              WHERE KPI_Set = '$kpiSet' AND [USER]='$user'";
     odbc_exec($conn, $sql);
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'replaceKpiSet')) {
     $kpiSet = iconv('utf-8', 'cp1251', $kpiSet);
     $kpiArr = split(',', $kpis);
     $countKpi = count($kpiArr);

     $sql1 = "DELETE FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
              WHERE KPI_Set = '$kpiSet' AND [USER]='$user'";
     odbc_exec($conn, $sql1);

     for ($i = 0; $i < $countKpi; $i++) {
          $kpi = $kpiArr[$i];
          $sql2 = "INSERT INTO [Stat_Result].[dbo].T_massEvents_KPI_Sets
                   values('$kpiSet', '$kpi', '$user')";
          odbc_exec($conn, $sql2);
     }
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'addNewKpiSet')) {
     $kpiSet = iconv('utf-8', 'cp1251', $kpiSet);
     $kpiArr = split(',', $kpis);
     $countKpi = count($kpiArr);

     for ($i = 0; $i < $countKpi; $i++) {
          $kpi = $kpiArr[$i];
          $sql = "INSERT INTO [Stat_Result].[dbo].T_massEvents_KPI_Sets
                   values('$kpiSet', '$kpi', '$user')";
          odbc_exec($conn, $sql);
     }
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'insertKpi')) {
     $obj = iconv('utf-8', 'cp1251', $obj);

     if ($kpi == 'HSDPA_USER_DC_THR' && $aggregation == 'H') {
          $kpiColumnString = "CASE WHEN round(MAX(a.HSDPA_USER_THR_1H_AGG_3),2) IS NOT NULL
          THEN round(MAX(a.HSDPA_USER_THR_1H_AGG_3),2)
          ELSE round(MAX(a.HSDPA_USER_THR_1H_AGG),2) END AS HSDPA_USER_DC_THR, ";
     } else if ($kpi == 'HSDPA_USER_DC_THR' && $aggregation == 'D') {
          $kpiColumnString = "CASE WHEN round(MAX(a.HSDPA_USER_THR_1D_AGG_4),2) IS NOT NULL
          THEN round(MAX(a.HSDPA_USER_THR_1D_AGG_4),2)
          ELSE round(MAX(a.HSDPA_USER_THR_1D_AGG),2) END AS HSDPA_USER_DC_THR, ";
     } else {
          $kpiColumnString = "round(MAX(a." . $kpiColumn . "),2) AS $kpi, ";
     }

     $sql = "UPDATE table_a
             SET table_a.$kpi = table_b.$kpi
             FROM ([Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType AS table_a
             JOIN
               (SELECT * FROM openquery([EXT_PM], '
                    SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object,
                                              a.stime AS STime, "
          . $kpiColumnString . "''$user'' as \"USER\"              
               FROM mts_if.dc_managed_object bs
               LEFT JOIN mts_datacollector.$kpiTable a ON a.mo_id = bs.id           
               WHERE bs.external_key = N''$obj''
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, a.stime
               ORDER BY 1, 2 ')) AS table_b ON table_a.Managed_Object = table_b.MANAGED_OBJECT collate Cyrillic_General_CI_AS
			AND table_a.STime = table_b.STIME AND table_a.[USER] = table_b.[USER] collate Cyrillic_General_CI_AS)";
     print_r($sql);
     odbc_exec($conn, $sql);
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'insertObject')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     if ($aggregation == "D" && substr($startDate, 11) != "00:00:00") {
          $startDate = substr_replace($startDate, "00:00:00", 11);
          $startDate = strtotime($startDate . ' + 1 days');
          $startDate = date('Y-m-d H:i:s', $startDate);
     }
     $day_or_hour = "";
     if ($aggregation == "D") {
          $day_or_hour = "day";
     } else {
          $day_or_hour = "hour";
     }
     $sql = "INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType(Managed_Object, STime, [USER])
             SELECT t.Managed_Object, t.STime, t.[USER]
             FROM openquery([EXTPM], '
               SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object,
                                          t.stime as STime, ''$user'' as \"USER\"
               FROM mts_if.dc_managed_object bs
               CROSS JOIN
                    (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' $day_or_hour * (level - 1) as stime From dual
                     connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' $day_or_hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t               
               WHERE bs.external_key = ''$obj''
               GROUP BY bs.external_key, t.stime ORDER BY 1, 2 ') as t
             WHERE NOT EXISTS
             (SELECT Managed_Object, STime, [USER]
              FROM [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType a2
              WHERE a2.Managed_Object = t.Managed_Object collate Cyrillic_General_CI_AS
              AND a2.STime = t.STime
              AND a2.[USER] = t.[USER] collate Cyrillic_General_CI_AS)
              ORDER BY 1, 2";
     print_r($sql);
     odbc_exec($conn, $sql);
}

if ($_REQUEST['table_name'] == 'loadKpiSet') {
     $sql = "SELECT DISTINCT KPI_Set
             FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
             WHERE [USER] = 'ALL' OR [USER]='$user'
             ORDER BY 1";

     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ($_REQUEST['table_name'] == 'loadUserKpiSet') {
     $sql = "SELECT DISTINCT KPI_Set
             FROM [Stat_Result].[dbo].T_massEvents_KPI_Sets
             WHERE [USER] = '$user'
             ORDER BY 1";

     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ($_REQUEST['table_name'] == 'loadStore') {
     $obj = stripslashes($obj);
     $obj = iconv('utf-8', 'cp1251', $obj);
     $start = (empty($_REQUEST['start'])) ? 0 : (int) $_REQUEST['start'];
     $kpiArr = split(',', $kpis);

     $sql = "SELECT count(*) counts
             FROM [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType
             WHERE ((Managed_Object in ($obj))
             AND (STime between '$startDate' AND '$endDate')
             AND ([USER] = '$user'))";
     $result = odbc_exec($conn, $sql);
     $counts = 0;
     if ($result) {
          $counts = odbc_result($result, "counts");
     } else {
          echo json_encode(array('data' => null, 'total' => null));
          return;
     }
     $coalesceString = "";
     $countKpi = count($kpiArr);
     for ($i = 0; $i < $countKpi - 1; $i++) {
          $coalesceString .= "coalesce(" . $kpiArr[$i] . ", '-9999') " . $kpiArr[$i] . ", ";
     }
     $coalesceString .= "coalesce(" . $kpiArr[$countKpi - 1] . ", '-9999') " . $kpiArr[$countKpi - 1];
     $sql = "SELECT Managed_Object, STime, " . $coalesceString . "
             FROM [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType
             WHERE ((Managed_Object in ($obj))
             AND (STime between '$startDate' AND '$endDate')
             AND ([USER] = '$user'))
             ORDER BY 1, 2";
     if ($xls == "nonXls") {
          $sql .= " OFFSET $start ROWS FETCH NEXT 1000 ROWS ONLY";
     }
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data, 'total' => $counts));
}

if ($_REQUEST['table_name'] == 'previousLoad') {
     $start = (empty($_REQUEST['start'])) ? 0 : (int) $_REQUEST['start'];

     $sql = "SELECT count(*) counts
     FROM [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType
     WHERE [USER] = '$user'";
     $result = odbc_exec($conn, $sql);
     $counts = 0;
     if ($result) {
          $counts = odbc_result($result, "counts");
     } else {
          echo json_encode(array('data' => null, 'total' => null));
          return;
     }

     $sql = "SELECT name
             FROM sys.columns
             WHERE object_id = (SELECT object_id
                                FROM sys.tables
                                WHERE name = 'T_massEvents_Result_$aggregation" . "_$kpiType')
             AND name NOT IN ('Managed_Object', 'STime', 'USER')";
     $result = odbc_exec($conn, $sql);

     $rows = array();
     $columns = array();

     while ($myRow = odbc_fetch_array($result)) {
          $rows[] = $myRow;
     }
     foreach ($rows as $row) {
          foreach ($row as $key => $value) {
               array_push($columns, $value);
          }
     }

     $coalesceString = "";
     $isNotNullString = "";
     $countColumns = count($columns);

     for ($i = 0; $i < $countColumns; $i++) {
          if ($i == ($countColumns - 1)) {
               $coalesceString .= "coalesce(" . $columns[$countColumns - 1] . ", '-9999') " . $columns[$countColumns - 1];
          } else {
               $coalesceString .= "coalesce(" . $columns[$i] . ", '-9999') " . $columns[$i] . ", ";
          }
          if ($i == 0) {
               $isNotNullString .= "(" . $columns[$i] . " IS NOT NULL) ";
          } else {
               $isNotNullString .= "OR (" . $columns[$i] . " IS NOT NULL) ";
          }
     }

     $sql = "SELECT Managed_Object, STime, " . $coalesceString . "
             FROM [Stat_Result].[dbo].T_massEvents_Result_$aggregation" . "_$kpiType
             WHERE [USER] = '$user' AND " . $isNotNullString . "     
             ORDER BY 1, 2";
     if ($xls == "nonXls") {
          $sql .= " OFFSET $start ROWS FETCH NEXT 1000 ROWS ONLY";
     }

     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data, 'total' => $counts));
}
