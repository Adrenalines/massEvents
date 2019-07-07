<?php
require_once 'checkaccess.php';
checkaccess();

ini_set("memory_limit", "300M");
$titletxt = $_REQUEST['titletxt'];
$filename = $titletxt . '.txt';
$handle = fopen($filename, "r");
$csv = fread($handle, filesize($filename));
fclose($handle);
unlink($filename);


// на бою нужно будет убрать одну .//
require_once '../../../resources/PHPExcel_1.7.9/Classes/PHPExcel.php';
require_once '../../../resources/PHPExcel_1.7.9/Classes/PHPExcel/Writer/Excel5.php';

//$title = $_REQUEST['title'];
//$cN = $_REQUEST['cN'];
//$csv =  $_REQUEST['csv'];
$title =  $_REQUEST['title'];
$cN =  $_REQUEST['cN'];
$fn = $title . '(' . $cN . ')' . date(' Y-m-d His') . '.xls';
$validLocale = PHPExcel_Settings::setLocale('ru');
$excel = new PHPExcel();
$excelWriter = new PHPExcel_Writer_Excel5($excel);
$sheet = $excel->getActiveSheet();
//$sheet->setTitle($cN);
//данные
//date_default_timezone_set('UTC');

$csv = strtr($csv, array("<br>" => " "));

for ($k = 0; $k <= 3; $k++) {
    $excel->createSheet();
}
$tecs = explode("{sheet!}", $csv);

for ($k = 0; $k <= 3; $k++) {
    $excel->setActiveSheetIndex($k);
    $sheet = $excel->getActiveSheet();
    switch ($k) {
        case 0:
            $sheet->setTitle('2G');
            break;
        case 1:
            $sheet->setTitle('3G');
            break;
        case 2:
            $sheet->setTitle('4G');
            break;
        case 3:
            $sheet->setTitle('4G Sharing');
            break;
    }
    $j = 1;

    foreach (explode("{123!}", $tecs[$k]) as $row) {
        $tecs[$k] = trim($tecs[$k]);
        if ($tecs[$k] != '') {
            $i = 0;
            foreach (explode(";", $row) as $value) {
                if ($j == 1) {
                    $sheet->getColumnDimension(PHPExcel_Cell::stringFromColumnIndex($i))->setAutoSize(true);
                } //}//оформление // $i
                $sheet->setCellValueByColumnAndRow($i++, $j, $value);
            }
            $j++;
        }
    }
    //оформление
    $hC = $sheet->getHighestColumn();
    $hR = $sheet->getHighestRow();
    $sheet->getDefaultColumnDimension()->setWidth(100);
    $sheet->getStyle('A1:' . $hC . $hR)->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
    $sheet->getStyle('A1:' . $hC . $hR)->getFont()->setName('Calibri');
    $sheet->getStyle('A1:' . $hC . $hR)->getFont()->setSize(10);
    $sheet->getStyle('C2:' . $hC . $hR)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('C2:' . $hC . $hR)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00);
    $sheet->getStyle('A1:' . $hC . '1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
    $sheet->getStyle('A1:' . $hC . '1')->getFill()->getStartColor()->setRGB('666699');
    $sheet->getStyle('A1:' . $hC . '1')->getFont()->setBold(true);
    $sheet->getStyle('A1:' . $hC . '1')->getFont()->setSize(9);
    $sheet->getStyle('A1:' . $hC . '1')->getFont()->getColor()->setRGB('FFFFFF');
    $sheet->getStyle('A1:' . $hC . '1')->getAlignment()->setWrapText(true);
    $sheet->getStyle('A1:' . $hC . '1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getRowDimension(1)->setRowHeight(20);
}
$excel->setActiveSheetIndex(4);
$sheet = $excel->getActiveSheet();
$sheet->setSheetState(PHPExcel_Worksheet::SHEETSTATE_VERYHIDDEN);

for ($k = 3; $k >= 0; $k--) {
    $excel->setActiveSheetIndex($k);
    $sheet = $excel->getActiveSheet();
    if (empty($tecs[$k])) {
        $excel->removeSheetByIndex($k);
    }
}

header('Content-Type: application/vnd.ms-excel; charset=utf-8');
header('Content-Disposition: attachment; filename=' . $fn);
header("Cache-Control: max-age=0");
$excelWriter->save('php://output');
