<?php

$URLStyle = "http://flash.weather.com.cn/wmaps/xml/%s.xml";
$chinaURL = sprintf($URLStyle, "china");
$chinaStr = file_get_contents($chinaURL);
$chinaObj = simplexml_load_string($chinaStr);
$chinaObjLen = count($chinaObj->city);
echo "chinaObjLen = ".$chinaObjLen."\n";

for ($i=0;$i<$chinaObjLen;$i++){
//遍历省一级节点，共37个
        $level1 = $chinaObj->city[$i]["pyName"];
        $shengjiURL = sprintf($URLStyle, $level1);
        $shengjiStr = file_get_contents($shengjiURL);
        //echo $shengjiStr;
        $shengjiObj = simplexml_load_string($shengjiStr); 
        $shengjiObjLen = count($shengjiObj->city);

//      echo $chinaObj->city[$i]["quName"];
//      echo " ".$shengjiObjLen."\n";
        for ($j=0;$j<$shengjiObjLen;$j++){
        //遍历市一级节点
                $level2 = $shengjiObj->city[$j]["pyName"];
                $shijiURL = sprintf($URLStyle, $level2);
                $shijiStr = file_get_contents($shijiURL);
                //echo $shijiStr;
                $shijiObj = simplexml_load_string($shijiStr); 

             //直辖市和海南、台湾、钓鱼岛等没有县级节点
                if(!$shijiObj){
                        echo "WARNNING: not exsit next level node. - ".$level1."-".$shijiURL."\n";
                        echo '  "'.$shengjiObj->city[$j]["cityname"].'" => ';
                        echo $shengjiObj->city[$j]["url"].",\n";
                        continue;
                }
                $shijiObjLen = count($shijiObj->city);
                //echo $shengjiObj->city[$j]["cityname"]."  ";
                //echo $shijiObjLen."\n";
                for ($k=0;$k<$shijiObjLen;$k++){
                //遍历县一级节点
                        $xianji_code = $shijiObj->city[$k]["url"];
                        echo '  "'.$shijiObj->city[$k]["cityname"].'" => ';
                        echo $shijiObj->city[$k]["url"].",\n";
                        //echo $xianji_code."\n"; 
                }
        }
}       
//print_r($chinaObj);

?>
