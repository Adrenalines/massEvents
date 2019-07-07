<?php

/*
        $handle = fopen('1.csv', "r"); //Открываем csv для чтения
 
        $array_line_full = array(); //Массив будет хранить данные из csv
        //Проходим весь csv-файл, и читаем построчно. 3-ий параметр разделитель поля
        while (($line = fgetcsv($handle, 0, ",")) !== FALSE) { 
            $array_line_full[] = $line; //Записываем строчки в массив
        }
        fclose($handle); //Закрываем файл
        echo $array_line_full[0][0].' '.$array_line_full[1][0].' '.$array_line_full[0][1]; //Возвращаем прочтенные данные
  

*/
require_once 'checkaccess.php';
checkaccess();

$csv = $_POST['csv'];
if ($csv) {
  $title = 'o' . rand(1, 10000) . date('His');
  $fp = fopen($title . ".txt", "wb");
  fwrite($fp, $csv);
  fclose($fp);
  echo $title;
}
