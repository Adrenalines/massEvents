<?php

function checkaccess() {
     $url = $_SERVER['REQUEST_URI'];
     $projectname = explode("/", $url);
     $projectname = strtolower($projectname[1]);
     $projectname = 'availReg';
     $conn = odbc_connect("DSN=stat_serv;", "", "");
     $userlogin = $_SERVER['REMOTE_USER'];
     $sql = "SELECT project_name_in_userstable FROM dbo. AC_projects_url WHERE url='$projectname'";
//     echo $sql;
     $result = odbc_exec($conn, $sql);
     if ($result) {
          $projectnamecolumn = odbc_result($result, 1);
     }
     $access = 0;
     if (!empty($projectnamecolumn)) {
          $sql = "SELECT ISNULL($projectnamecolumn,0) FROM dbo. AC_users WHERE userlogin='$userlogin'";
          $result = odbc_exec($conn, $sql);
          if ($result) {
               $access = odbc_result($result, 1);
          }
     }
     if (empty($access) || (int) $access === 0) {
          ?>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <?php
          echo "<div style=\"font: 14px/18px tahoma,arial,verdana,sans-serif;\"><h1>Доступ закрыт</h1>
				<p>Для получения доступа, пожалуйста, обратитесь в <strong>Группу контроля качества и отчетности</strong>, направив письмо на email: dpos@mts.ru.<br />В теме письма укажите \"Доступ на сайт ДПиОС...\", ФИО, логин в домене ADMSK, например:</p>
<p>Доступ на сайт ДПиОС (Иванов Иван Иванович)_ivanov9</p><p>
C вопросами обращаться к Максиму Попченко<br />
IP 30322<br />
E-mail: mgpopche@mts.ru<br />
</p></div>
";
          die();
     }
}

checkaccess();
?>