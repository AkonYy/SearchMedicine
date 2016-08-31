<?php
header("Content-Type:text/html;charset=utf-8");
require_once('DBinfo.php');
$conn=mysqli_connect(DB_HOST,DB_USER,DB_PWD,DB_DBNAME);
/*$username1=$_POST["username"];
$password1=$_POST["password"];*/
$name=$_REQUEST["name"];
$phone=$_REQUEST["phone"];
$pass=$_REQUEST["pass"];

mysqli_query($conn,"set names utf8");
	function str_prefix($str, $char1=" "){
		$str = $char1.$str.$char1;
		return $str;
		}
$Search_p=str_prefix($phone, '"');
$Search_n=str_prefix($name, '"');
$Search_pass=str_prefix($pass, '"');
$sql="insert into admin(phone,password,name)values($Search_p,$Search_pass,$Search_n)";

$result=mysqli_query($conn,$sql);
$note;
if($result)
$note["a"]=urlencode("a");
else
$note["a"]=urlencode("b");
echo urldecode(json_encode($note));
    mysqli_close($conn);  

