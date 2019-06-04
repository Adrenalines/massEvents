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
     'SELECT DISTINCT NE_NAME as EXTERNAL_KEY
      FROM ETL.V_MV_CELL_BTS_FOR_EXTPM
      WHERE GEO_UNIT = ''$obj''
      ORDER BY NE_NAME ')";
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
     $data   = getData($result);
     echo json_encode(array('data' => $data));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'clearTables')) {
     $sql = "DELETE [Stat_Result].[dbo].T_massEvents_Result_2g
             WHERE ([USER]='$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_3g
             WHERE ([USER]='$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_4g
             WHERE ([USER]='$user')
             DELETE [Stat_Result].[dbo].T_massEvents_Result_4gShr
             WHERE ([USER] = '$user')";
     odbc_exec($conn, $sql);
}


if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'deleteEmpty')) {
     $sql = "SELECT name
             FROM sys.columns
             WHERE object_id = (SELECT object_id
                                FROM sys.tables
                                WHERE name = 'T_massEvents_Result_$kpiType')
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
          $isNullString .= "AND (" . $columns[$i] . "IS NULL) ";
     }

     $sql = "DELETE [Stat_Result].[dbo].T_massEvents_Result_$kpiType
             WHERE ([USER]='$user') " . $isNullString;
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

     if ($kpi == 'HSDPA_USER_DC_THR') {
          $kpiColumnString = "CASE WHEN round(MAX(a.HSDPA_USER_THR_1H_AGG_3),2) IS NOT NULL
          THEN round(MAX(a.HSDPA_USER_THR_1H_AGG_3),2)
          ELSE round(MAX(a.HSDPA_USER_THR_1H_AGG),2) END AS HSDPA_USER_DC_THR, ";
     } else {
          $kpiColumnString = "round(MAX(a." . $kpiColumn . "),2) AS $kpi, ";
     }


     $sql = "UPDATE table_a
             SET table_a.$kpi = table_b.$kpi
             FROM ([Stat_Result].[dbo].T_massEvents_Result_$kpiType AS table_a
             JOIN
               (SELECT * FROM openquery([EXT_PM], '
                    SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object,
                                              a.stime AS STime, "
          . $kpiColumnString .
          "''$user'' as \"USER\"              
               FROM mts_if.dc_managed_object bs
               LEFT JOIN mts_datacollector.$kpiTable a ON a.mo_id = bs.id           
               WHERE bs.external_key = N''$obj''
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, a.stime
               ORDER BY 1, 2 ')) AS table_b ON table_a.Managed_Object = table_b.MANAGED_OBJECT collate Cyrillic_General_CI_AS
			AND table_a.STime = table_b.STIME AND table_a.[USER] = table_b.[USER] collate Cyrillic_General_CI_AS)";
     odbc_exec($conn, $sql);
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'insertObject')) {
     $obj = iconv('utf-8', 'cp1251', $obj);
     $sql = "INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_$kpiType(Managed_Object, STime, [USER])
             SELECT t.Managed_Object, t.STime, t.[USER]
             FROM openquery([EXTPM], '
               SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object,
                                          t.stime as STime, ''$user'' as \"USER\"
               FROM mts_if.dc_managed_object bs
               CROSS JOIN
                    (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
                     connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t               
               WHERE bs.external_key = ''$obj''
               GROUP BY bs.external_key, t.stime ORDER BY 1, 2 ') as t
             WHERE NOT EXISTS
             (SELECT Managed_Object, STime, [USER]
              FROM [Stat_Result].[dbo].T_massEvents_Result_$kpiType a2
              WHERE a2.Managed_Object = t.Managed_Object collate Cyrillic_General_CI_AS
              AND a2.STime = t.STime
              AND a2.[USER] = t.[USER] collate Cyrillic_General_CI_AS)
              ORDER BY 1, 2";
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
     $start = (empty($_REQUEST['start'])) ? 0 : (int)$_REQUEST['start'];
     $kpiArr = split(',', $kpis);

     $sql = "SELECT count(*) counts
             FROM [Stat_Result].[dbo].T_massEvents_Result_$kpiType
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
             FROM [Stat_Result].[dbo].T_massEvents_Result_$kpiType
             WHERE ((Managed_Object in ($obj))
             AND (STime between '$startDate' AND '$endDate')
             AND ([USER] = '$user'))
             ORDER BY 1, 2 OFFSET $start ROWS FETCH NEXT 1000 ROWS ONLY";

     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data, 'total' => $counts));
}

if ($_REQUEST['table_name'] == 'previousLoad') {
     $start = (empty($_REQUEST['start'])) ? 0 : (int)$_REQUEST['start'];

     $sql = "SELECT count(*) counts
     FROM [Stat_Result].[dbo].T_massEvents_Result_$kpiType
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
                                WHERE name = 'T_massEvents_Result_$kpiType')
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
     $countColumns = count($columns);
     for ($i = 0; $i < $countColumns - 1; $i++) {
          $coalesceString .= "coalesce(" . $columns[$i] . ", '-9999') " . $columns[$i] . ", ";
     }
     $coalesceString .= "coalesce(" . $columns[$countColumns - 1] . ", '-9999') " . $columns[$countColumns - 1];

     $sql = "SELECT Managed_Object, STime, " . $coalesceString . "
             FROM [Stat_Result].[dbo].T_massEvents_Result_$kpiType
             WHERE [USER] = '$user'
             ORDER BY 1, 2 OFFSET $start ROWS FETCH NEXT 1000 ROWS ONLY";
     $result = odbc_exec($conn, $sql);
     $data   = getData($result);
     echo json_encode(array('data' => $data, 'total' => $counts));
}

if ((isset($_REQUEST['type']) && $_REQUEST['type'] == 'sla_bts_cell')) {
     $regList2 = stripslashes($regList2);
     $btsList = stripslashes($btsList);
     $cellList = stripslashes($cellList);
     if ($regList2 == "") {
          $regList2 = "''''";
     }
     if ($btsList == "") {
          $btsList = "''''";
     }
     if ($cellList == "") {
          $cellList = "''''";
     }
     $sql = "INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_2G_SLA
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(a.TCH_TRAFFIC_1H_AGG),2) AS TCH_Traffic,
               round(MAX(a.SDCCH_TRAFFIC_1H_AGG),2) AS SDCCH_Traffic,
               round(MAX(b.CSSR_1H_AGG),2) AS CSSR,
               round(MAX(d.BSS_AVAILA_ATE_1H_AGG_2),2) AS BSS_Availability_Rate,
               round(MAX(c.DROP_CALL_ATE_1H_AGG),2) AS Drop_Call_Rate,
               round(MAX(b.SDCCH_BLOC_ATE_1H_AGG),2) AS SDCCH_Blocking_Rate,
               round(MAX(b.TCH_SERV_B_ATE_1H_AGG),2) AS TCH_Serv_Blocking_Rate,
               round(MAX(e.CELL_COUNT_1H_AGG),2) AS CELL_Count_2G,
               round(MAX(c.CALLS_1H_AGG),2) AS Calls_Count_2G
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_2G_G3_L1_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G1_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G2_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G5_L2_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.CELL_COUNT_2G_L1_H e ON e.mo_id = bs.id AND e.stime = t.stime
               WHERE bs.external_key IN ($regList2)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(a.TCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(a.SDCCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(b.CSSR_1H_AGG) is not null)
               OR (MAX(d.BSS_AVAILA_ATE_1H_AGG_2) is not null)
               OR (MAX(c.DROP_CALL_ATE_1H_AGG) is not null)
               OR (MAX(b.SDCCH_BLOC_ATE_1H_AGG) is not null)
               OR (MAX(b.TCH_SERV_B_ATE_1H_AGG) is not null)
               OR (MAX(e.CELL_COUNT_1H_AGG) is not null)
               OR (MAX(c.CALLS_1H_AGG) is not null) ORDER BY 1, 2 ')

               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_3G_SLA
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(d.TRAFF_SP_AVG_1H_AGG),2) AS Traff_Sp,
               round(MAX(b.DROP_SP_RATE_1H_AGG),2) AS Drop_Sp,
               round(MAX(a.CSSR_CS_1H_AGG),2) AS CSSR_Sp,
               round(MAX(c.BLOCK_SP_RATE_1H_AGG),2) AS Block_Sp,
               round(MAX(g.RAN_AVAILA_ITY_1H_AGG),2) AS RAN_Availability,
               round(MAX(b.DROP_PS_RATE_1H_AGG),2) AS Drop_Data,
               round(MAX(a.CSSR_PS_1H_AGG),2) AS CSSR_Data,
               round(MAX(c.BLOCK_PS_RATE_1H_AGG),2) AS Block_Data,
               round(MAX(h.CELL_COUNT_1H_AGG_2),2) AS CELL_Count_3G,
               round(MAX(i.SP_DROP_DN_1H_AGG),2) AS Calls_Count_3G,
               round(MAX(e.TRAFF_PS_1H_AGG),2) AS Traff_Data_3G,
               round(MAX(e.TRAFF_PS_DL_1H_AGG),2) AS Traff_Data_DL_3G,
               round(MAX(e.TRAFF_PS_UL_1H_AGG),2) AS Traff_Data_UL_3G,
               CASE WHEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2) IS NOT NULL
               THEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2)
               ELSE round(MAX(f.HSDPA_USER_THR_1H_AGG),2) END AS HSDPA_USER_DC_THR,
               round(MAX(f.HSUPA_USER_THR_1H_AGG),2) AS HSUPA_USER_THR
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_3G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L25_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_AVG_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L22_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L24_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G5_L2_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_INT_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L1_H i ON i.mo_id = bs.id AND i.stime = t.stime
               WHERE bs.external_key IN ($regList2)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(d.TRAFF_SP_AVG_1H_AGG) is not null)
               OR (MAX(b.DROP_SP_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_CS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_SP_RATE_1H_AGG) is not null)
               OR (MAX(g.RAN_AVAILA_ITY_1H_AGG) is not null)
               OR (MAX(b.DROP_PS_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_PS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_PS_RATE_1H_AGG) is not null)
               OR (MAX(h.CELL_COUNT_1H_AGG_2) is not null)
               OR (MAX(i.SP_DROP_DN_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_DL_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_UL_1H_AGG) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG_3) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG) is not null)
               OR (MAX(f.HSUPA_USER_THR_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_SLA
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.DPH_UE_1H_AGG),2) AS DpH_UE,
               round(MAX(a.CSSR_LTE_1H_AGG),2) AS CSSR_LTE,
               round(MAX(e.LTE_RAN_AVAIL_1H_AGG),2) AS LTE_RAN_Avail,
               round(MAX(c.TRAFF_DATA_ELL_1H_AGG_2),2) AS Traff_Data_4G,
               round(MAX(d.TRAFF_DL_D_ELL_1H_AGG),2) AS Traff_Data_DL_4G,
               round(MAX(d.TRAFF_UL_D_ELL_1H_AGG),2) AS Traff_Data_UL_4G,
               round(MAX(c.UE_THROUGH_DL_1H_AGG),2) AS UE_Throughput_DL,
               round(MAX(c.UE_THROUGH_UL_1H_AGG),2) AS UE_Throughput_UL,
               round(MAX(g.LTE_USER_MAX_1H_MAX),2) AS LTE_User_Max,
               round(MAX(f.CELL_COUNT_1H_MAX),2) AS CELL_Count_4G,
               round(MAX(j.TRAFF_VOLTE_1H_AGG),2) AS Traff_VoLTE,
               round(MAX(i.DPH_VOLTE_UE_1H_AGG),2) AS DpH_VoLTE_UE,
               round(MAX(h.CSSR_VOLTE_1H_AGG),2) AS CSSR_VoLTE
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_4G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G5_L2_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G1_L2_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G2_L2_H i ON i.mo_id = bs.id AND i.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G6_L1_H j ON j.mo_id = bs.id AND j.stime = t.stime
               WHERE bs.external_key IN ($regList2)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (j.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.DPH_UE_1H_AGG) is not null)
               OR (MAX(a.CSSR_LTE_1H_AGG) is not null)
               OR (MAX(e.LTE_RAN_AVAIL_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DATA_ELL_1H_AGG_2) is not null)
               OR (MAX(d.TRAFF_DL_D_ELL_1H_AGG) is not null)
               OR (MAX(d.TRAFF_UL_D_ELL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_DL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_UL_1H_AGG) is not null)
               OR (MAX(g.LTE_USER_MAX_1H_MAX) is not null)
               OR (MAX(f.CELL_COUNT_1H_MAX) is not null)
               OR (MAX(j.TRAFF_VOLTE_1H_AGG) is not null)
               OR (MAX(i.DPH_VOLTE_UE_1H_AGG) is not null)
               OR (MAX(h.CSSR_VOLTE_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_Sharing_SLA
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.E_RAB_RETA_ING_1H_AGG),2) AS E_RAB_Retainability_Sharing,
               round(MAX(a.INITIALEPS_ING_1H_AGG),2) AS InitialEPSBEstabSR_Sharing,
               round(MAX(b.CELLAVAILA_ING_1H_AGG),2) AS CellAvailability_Sharing,
               round(MAX(b.TRAFF_SHARING_1H_AGG),2) AS Traff_Sharing,
               round(MAX(c.TRAFF_DL_S_ING_1H_AGG),2) AS Traff_DL_Sharing,
               round(MAX(c.TRAFF_UL_S_ING_1H_AGG),2) AS Traff_UL_Sharing,
               round(MAX(b.DOWNLINK_T_ING_1H_AGG),2) AS Downlink_Thp_Sharing,
               round(MAX(b.UPLINK_THP_ING_1H_AGG),2) AS Uplink_Thp_Sharing
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L3_CC_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L2_CC_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L1_H c ON c.mo_id = bs.id AND c.stime = t.stime
               WHERE bs.external_key IN ($regList2)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.E_RAB_RETA_ING_1H_AGG) is not null)
               OR (MAX(a.INITIALEPS_ING_1H_AGG) is not null)
               OR (MAX(b.CELLAVAILA_ING_1H_AGG) is not null)
               OR (MAX(b.TRAFF_SHARING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DL_S_ING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_UL_S_ING_1H_AGG) is not null)
               OR (MAX(b.DOWNLINK_T_ING_1H_AGG) is not null)
               OR (MAX(b.UPLINK_THP_ING_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_2G_BTS
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(a.TCH_TRAFFIC_1H_AGG),2) AS TCH_Traffic,
               round(MAX(a.SDCCH_TRAFFIC_1H_AGG),2) AS SDCCH_Traffic,
               round(MAX(b.CSSR_1H_AGG),2) AS CSSR,
               round(MAX(d.BSS_AVAILA_ATE_1H_AGG_2),2) AS BSS_Availability_Rate,
               round(MAX(c.DROP_CALL_ATE_1H_AGG),2) AS Drop_Call_Rate,
               round(MAX(b.SDCCH_BLOC_ATE_1H_AGG),2) AS SDCCH_Blocking_Rate,
               round(MAX(b.TCH_SERV_B_ATE_1H_AGG),2) AS TCH_Serv_Blocking_Rate,
               round(MAX(e.CELL_COUNT_1H_AGG),2) AS CELL_Count_2G,
               round(MAX(c.CALLS_1H_AGG),2) AS Calls_Count_2G
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_2G_G3_L1_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G1_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G2_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G5_L2_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.CELL_COUNT_2G_L1_H e ON e.mo_id = bs.id AND e.stime = t.stime
               WHERE bs.external_key IN ($btsList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(a.TCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(a.SDCCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(b.CSSR_1H_AGG) is not null)
               OR (MAX(d.BSS_AVAILA_ATE_1H_AGG_2) is not null)
               OR (MAX(c.DROP_CALL_ATE_1H_AGG) is not null)
               OR (MAX(b.SDCCH_BLOC_ATE_1H_AGG) is not null)
               OR (MAX(b.TCH_SERV_B_ATE_1H_AGG) is not null)
               OR (MAX(e.CELL_COUNT_1H_AGG) is not null)
               OR (MAX(c.CALLS_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_3G_BTS
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(d.TRAFF_SP_AVG_1H_AGG),2) AS Traff_Sp,
               round(MAX(b.DROP_SP_RATE_1H_AGG),2) AS Drop_Sp,
               round(MAX(a.CSSR_CS_1H_AGG),2) AS CSSR_Sp,
               round(MAX(c.BLOCK_SP_RATE_1H_AGG),2) AS Block_Sp,
               round(MAX(g.RAN_AVAILA_ITY_1H_AGG),2) AS RAN_Availability,
               round(MAX(b.DROP_PS_RATE_1H_AGG),2) AS Drop_Data,
               round(MAX(a.CSSR_PS_1H_AGG),2) AS CSSR_Data,
               round(MAX(c.BLOCK_PS_RATE_1H_AGG),2) AS Block_Data,
               round(MAX(h.CELL_COUNT_1H_AGG_2),2) AS CELL_Count_3G,
               round(MAX(i.SP_DROP_DN_1H_AGG),2) AS Calls_Count_3G,
               round(MAX(e.TRAFF_PS_1H_AGG),2) AS Traff_Data_3G,
               round(MAX(e.TRAFF_PS_DL_1H_AGG),2) AS Traff_Data_DL_3G,
               round(MAX(e.TRAFF_PS_UL_1H_AGG),2) AS Traff_Data_UL_3G,
               CASE WHEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2) IS NOT NULL
               THEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2)
               ELSE round(MAX(f.HSDPA_USER_THR_1H_AGG),2) END AS HSDPA_USER_DC_THR,
               round(MAX(f.HSUPA_USER_THR_1H_AGG),2) AS HSUPA_USER_THR
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_3G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L25_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_AVG_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L22_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L24_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G5_L2_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_INT_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L1_H i ON i.mo_id = bs.id AND i.stime = t.stime
               WHERE bs.external_key IN ($btsList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(d.TRAFF_SP_AVG_1H_AGG) is not null)
               OR (MAX(b.DROP_SP_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_CS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_SP_RATE_1H_AGG) is not null)
               OR (MAX(g.RAN_AVAILA_ITY_1H_AGG) is not null)
               OR (MAX(b.DROP_PS_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_PS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_PS_RATE_1H_AGG) is not null)
               OR (MAX(h.CELL_COUNT_1H_AGG_2) is not null)
               OR (MAX(i.SP_DROP_DN_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_DL_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_UL_1H_AGG) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG_3) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG) is not null)
               OR (MAX(f.HSUPA_USER_THR_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_BTS
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.DPH_UE_1H_AGG),2) AS DpH_UE,
               round(MAX(a.CSSR_LTE_1H_AGG),2) AS CSSR_LTE,
               round(MAX(e.LTE_RAN_AVAIL_1H_AGG),2) AS LTE_RAN_Avail,
               round(MAX(c.TRAFF_DATA_ELL_1H_AGG_2),2) AS Traff_Data_4G,
               round(MAX(d.TRAFF_DL_D_ELL_1H_AGG),2) AS Traff_Data_DL_4G,
               round(MAX(d.TRAFF_UL_D_ELL_1H_AGG),2) AS Traff_Data_UL_4G,
               round(MAX(c.UE_THROUGH_DL_1H_AGG),2) AS UE_Throughput_DL,
               round(MAX(c.UE_THROUGH_UL_1H_AGG),2) AS UE_Throughput_UL,
               round(MAX(g.LTE_USER_MAX_1H_MAX),2) AS LTE_User_Max,
               round(MAX(f.CELL_COUNT_1H_MAX),2) AS CELL_Count_4G,
               round(MAX(j.TRAFF_VOLTE_1H_AGG),2) AS Traff_VoLTE,
               round(MAX(i.DPH_VOLTE_UE_1H_AGG),2) AS DpH_VoLTE_UE,
               round(MAX(h.CSSR_VOLTE_1H_AGG),2) AS CSSR_VoLTE
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_4G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G5_L2_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G1_L2_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G2_L2_H i ON i.mo_id = bs.id AND i.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G6_L1_H j ON j.mo_id = bs.id AND j.stime = t.stime
               WHERE bs.external_key IN ($btsList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (j.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.DPH_UE_1H_AGG) is not null)
               OR (MAX(a.CSSR_LTE_1H_AGG) is not null)
               OR (MAX(e.LTE_RAN_AVAIL_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DATA_ELL_1H_AGG_2) is not null)
               OR (MAX(d.TRAFF_DL_D_ELL_1H_AGG) is not null)
               OR (MAX(d.TRAFF_UL_D_ELL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_DL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_UL_1H_AGG) is not null)
               OR (MAX(g.LTE_USER_MAX_1H_MAX) is not null)
               OR (MAX(f.CELL_COUNT_1H_MAX) is not null)
               OR (MAX(j.TRAFF_VOLTE_1H_AGG) is not null)
               OR (MAX(i.DPH_VOLTE_UE_1H_AGG) is not null)
               OR (MAX(h.CSSR_VOLTE_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_Sharing_BTS
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.E_RAB_RETA_ING_1H_AGG),2) AS E_RAB_Retainability_Sharing,
               round(MAX(a.INITIALEPS_ING_1H_AGG),2) AS InitialEPSBEstabSR_Sharing,
               round(MAX(b.CELLAVAILA_ING_1H_AGG),2) AS CellAvailability_Sharing,
               round(MAX(b.TRAFF_SHARING_1H_AGG),2) AS Traff_Sharing,
               round(MAX(c.TRAFF_DL_S_ING_1H_AGG),2) AS Traff_DL_Sharing,
               round(MAX(c.TRAFF_UL_S_ING_1H_AGG),2) AS Traff_UL_Sharing,
               round(MAX(b.DOWNLINK_T_ING_1H_AGG),2) AS Downlink_Thp_Sharing,
               round(MAX(b.UPLINK_THP_ING_1H_AGG),2) AS Uplink_Thp_Sharing
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L3_CC_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L2_CC_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L1_H c ON c.mo_id = bs.id AND c.stime = t.stime
               WHERE bs.external_key IN ($btsList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.E_RAB_RETA_ING_1H_AGG) is not null)
               OR (MAX(a.INITIALEPS_ING_1H_AGG) is not null)
               OR (MAX(b.CELLAVAILA_ING_1H_AGG) is not null)
               OR (MAX(b.TRAFF_SHARING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DL_S_ING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_UL_S_ING_1H_AGG) is not null)
               OR (MAX(b.DOWNLINK_T_ING_1H_AGG) is not null)
               OR (MAX(b.UPLINK_THP_ING_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_2G_CELL
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(a.TCH_TRAFFIC_1H_AGG),2) AS TCH_Traffic,
               round(MAX(a.SDCCH_TRAFFIC_1H_AGG),2) AS SDCCH_Traffic,
               round(MAX(b.CSSR_1H_AGG),2) AS CSSR,
               round(MAX(d.BSS_AVAILA_ATE_1H_AGG_2),2) AS BSS_Availability_Rate,
               round(MAX(c.DROP_CALL_ATE_1H_AGG),2) AS Drop_Call_Rate,
               round(MAX(b.SDCCH_BLOC_ATE_1H_AGG),2) AS SDCCH_Blocking_Rate,
               round(MAX(b.TCH_SERV_B_ATE_1H_AGG),2) AS TCH_Serv_Blocking_Rate,
               round(MAX(e.CELL_COUNT_1H_AGG),2) AS CELL_Count_2G,
               round(MAX(c.CALLS_1H_AGG),2) AS Calls_Count_2G
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_2G_G3_L1_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G1_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G2_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_2G_G5_L2_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.CELL_COUNT_2G_L1_H e ON e.mo_id = bs.id AND e.stime = t.stime
               WHERE bs.external_key IN ($cellList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(a.TCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(a.SDCCH_TRAFFIC_1H_AGG) is not null)
               OR (MAX(b.CSSR_1H_AGG) is not null)
               OR (MAX(d.BSS_AVAILA_ATE_1H_AGG_2) is not null)
               OR (MAX(c.DROP_CALL_ATE_1H_AGG) is not null)
               OR (MAX(b.SDCCH_BLOC_ATE_1H_AGG) is not null)
               OR (MAX(b.TCH_SERV_B_ATE_1H_AGG) is not null)
               OR (MAX(e.CELL_COUNT_1H_AGG) is not null)
               OR (MAX(c.CALLS_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_3G_CELL
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(d.TRAFF_SP_AVG_1H_AGG),2) AS Traff_Sp,
               round(MAX(b.DROP_SP_RATE_1H_AGG),2) AS Drop_Sp,
               round(MAX(a.CSSR_CS_1H_AGG),2) AS CSSR_Sp,
               round(MAX(c.BLOCK_SP_RATE_1H_AGG),2) AS Block_Sp,
               round(MAX(g.RAN_AVAILA_ITY_1H_AGG),2) AS RAN_Availability,
               round(MAX(b.DROP_PS_RATE_1H_AGG),2) AS Drop_Data,
               round(MAX(a.CSSR_PS_1H_AGG),2) AS CSSR_Data,
               round(MAX(c.BLOCK_PS_RATE_1H_AGG),2) AS Block_Data,
               round(MAX(h.CELL_COUNT_1H_AGG_2),2) AS CELL_Count_3G,
               round(MAX(i.SP_DROP_DN_1H_AGG),2) AS Calls_Count_3G,
               round(MAX(e.TRAFF_PS_1H_AGG),2) AS Traff_Data_3G,
               round(MAX(e.TRAFF_PS_DL_1H_AGG),2) AS Traff_Data_DL_3G,
               round(MAX(e.TRAFF_PS_UL_1H_AGG),2) AS Traff_Data_UL_3G,
               CASE WHEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2) IS NOT NULL
               THEN round(MAX(f.HSDPA_USER_THR_1H_AGG_3),2)
               ELSE round(MAX(f.HSDPA_USER_THR_1H_AGG),2) END AS HSDPA_USER_DC_THR,
               round(MAX(f.HSUPA_USER_THR_1H_AGG),2) AS HSUPA_USER_THR
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_3G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L25_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_AVG_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L22_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L24_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G5_L2_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G6_L1_TRAFF_INT_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_3G_G2_L1_H i ON i.mo_id = bs.id AND i.stime = t.stime
               WHERE bs.external_key IN ($cellList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(d.TRAFF_SP_AVG_1H_AGG) is not null)
               OR (MAX(b.DROP_SP_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_CS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_SP_RATE_1H_AGG) is not null)
               OR (MAX(g.RAN_AVAILA_ITY_1H_AGG) is not null)
               OR (MAX(b.DROP_PS_RATE_1H_AGG) is not null)
               OR (MAX(a.CSSR_PS_1H_AGG) is not null)
               OR (MAX(c.BLOCK_PS_RATE_1H_AGG) is not null)
               OR (MAX(h.CELL_COUNT_1H_AGG_2) is not null)
               OR (MAX(i.SP_DROP_DN_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_DL_1H_AGG) is not null)
               OR (MAX(e.TRAFF_PS_UL_1H_AGG) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG_3) is not null)
               OR (MAX(f.HSDPA_USER_THR_1H_AGG) is not null)
               OR (MAX(f.HSUPA_USER_THR_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_CELL
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.DPH_UE_1H_AGG),2) AS DpH_UE,
               round(MAX(a.CSSR_LTE_1H_AGG),2) AS CSSR_LTE,
               round(MAX(e.LTE_RAN_AVAIL_1H_AGG),2) AS LTE_RAN_Avail,
               round(MAX(c.TRAFF_DATA_ELL_1H_AGG_2),2) AS Traff_Data_4G,
               round(MAX(d.TRAFF_DL_D_ELL_1H_AGG),2) AS Traff_Data_DL_4G,
               round(MAX(d.TRAFF_UL_D_ELL_1H_AGG),2) AS Traff_Data_UL_4G,
               round(MAX(c.UE_THROUGH_DL_1H_AGG),2) AS UE_Throughput_DL,
               round(MAX(c.UE_THROUGH_UL_1H_AGG),2) AS UE_Throughput_UL,
               round(MAX(g.LTE_USER_MAX_1H_MAX),2) AS LTE_User_Max,
               round(MAX(f.CELL_COUNT_1H_MAX),2) AS CELL_Count_4G,
               round(MAX(j.TRAFF_VOLTE_1H_AGG),2) AS Traff_VoLTE,
               round(MAX(i.DPH_VOLTE_UE_1H_AGG),2) AS DpH_VoLTE_UE,
               round(MAX(h.CSSR_VOLTE_1H_AGG),2) AS CSSR_VoLTE
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_4G_G1_L2_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G2_L2_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L2_H c ON c.mo_id = bs.id AND c.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_H d ON d.mo_id = bs.id AND d.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G5_L2_H e ON e.mo_id = bs.id AND e.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H f ON f.mo_id = bs.id AND f.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_4G_G6_L1_MAX_H g ON g.mo_id = bs.id AND g.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G1_L2_H h ON h.mo_id = bs.id AND h.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G2_L2_H i ON i.mo_id = bs.id AND i.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_VOLTE_G6_L1_H j ON j.mo_id = bs.id AND j.stime = t.stime
               WHERE bs.external_key IN ($cellList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (d.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (e.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (f.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (g.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (h.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (i.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (j.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.DPH_UE_1H_AGG) is not null)
               OR (MAX(a.CSSR_LTE_1H_AGG) is not null)
               OR (MAX(e.LTE_RAN_AVAIL_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DATA_ELL_1H_AGG_2) is not null)
               OR (MAX(d.TRAFF_DL_D_ELL_1H_AGG) is not null)
               OR (MAX(d.TRAFF_UL_D_ELL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_DL_1H_AGG) is not null)
               OR (MAX(c.UE_THROUGH_UL_1H_AGG) is not null)
               OR (MAX(g.LTE_USER_MAX_1H_MAX) is not null)
               OR (MAX(f.CELL_COUNT_1H_MAX) is not null)
               OR (MAX(j.TRAFF_VOLTE_1H_AGG) is not null)
               OR (MAX(i.DPH_VOLTE_UE_1H_AGG) is not null)
               OR (MAX(h.CSSR_VOLTE_1H_AGG) is not null) ORDER BY 1, 2 ')
               
               INSERT INTO [Stat_Result].[dbo].T_massEvents_Result_4G_Sharing_CELL
               SELECT * FROM openquery([EXT_PM], 'SELECT /*+ parallel(8) */ bs.external_key AS Managed_Object, t.stime as STime,
               round(MAX(b.E_RAB_RETA_ING_1H_AGG),2) AS E_RAB_Retainability_Sharing,
               round(MAX(a.INITIALEPS_ING_1H_AGG),2) AS InitialEPSBEstabSR_Sharing,
               round(MAX(b.CELLAVAILA_ING_1H_AGG),2) AS CellAvailability_Sharing,
               round(MAX(b.TRAFF_SHARING_1H_AGG),2) AS Traff_Sharing,
               round(MAX(c.TRAFF_DL_S_ING_1H_AGG),2) AS Traff_DL_Sharing,
               round(MAX(c.TRAFF_UL_S_ING_1H_AGG),2) AS Traff_UL_Sharing,
               round(MAX(b.DOWNLINK_T_ING_1H_AGG),2) AS Downlink_Thp_Sharing,
               round(MAX(b.UPLINK_THP_ING_1H_AGG),2) AS Uplink_Thp_Sharing
               FROM mts_if.dc_managed_object bs
               CROSS JOIN (SELECT /*+ MATERIALIZE */ to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) as stime From dual
               connect by to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') + interval ''1'' hour * (level - 1) <= to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS'')) t
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L3_CC_H a ON a.mo_id = bs.id AND a.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L2_CC_H b ON b.mo_id = bs.id AND b.stime = t.stime
               LEFT JOIN mts_datacollector.BSS_LTE_SHARING_L1_H c ON c.mo_id = bs.id AND c.stime = t.stime
               WHERE bs.external_key IN ($cellList)
               AND (a.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (b.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               AND (c.stime between to_date(''$startDate'',''YYYY-MM-DD HH24:MI:SS'') AND to_date(''$endDate'',''YYYY-MM-DD HH24:MI:SS''))
               GROUP BY bs.external_key, t.stime
               HAVING (MAX(b.E_RAB_RETA_ING_1H_AGG) is not null)
               OR (MAX(a.INITIALEPS_ING_1H_AGG) is not null)
               OR (MAX(b.CELLAVAILA_ING_1H_AGG) is not null)
               OR (MAX(b.TRAFF_SHARING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_DL_S_ING_1H_AGG) is not null)
               OR (MAX(c.TRAFF_UL_S_ING_1H_AGG) is not null)
               OR (MAX(b.DOWNLINK_T_ING_1H_AGG) is not null)
               OR (MAX(b.UPLINK_THP_ING_1H_AGG) is not null) ORDER BY 1, 2 ')";
     odbc_exec($conn, $sql);
}
