<?php
header("Content-Type:text/html;charset=utf-8");
require_once('DBinfo.php');
$conn=mysqli_connect(DB_HOST,DB_USER,DB_PWD,DB_DBNAME);
/*$username1=$_POST["username"];
$password1=$_POST["password"];*/
$phonenumber1=$_REQUEST["phonenumber"];
$password1=$_REQUEST["password"];

mysqli_query($conn,"set names utf8");
	function str_prefix($str, $char1=" "){
		$str = $char1.$str.$char1;
		return $str;
		}
$Search_u=str_prefix($phonenumber1, '"');
$Search_p=str_prefix($password1, '"');
$sql="select name from admin where phone=$Search_u and password=$Search_p ";

$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_array($result);
$note;
if($row==NULL){
	$note["state"]=urlencode("false");
	}
else{
	$note["state"]=urlencode("true");
	$note["name"]=urlencode($row['name']);
	}
   	echo urldecode(json_encode($note));
    mysqli_close($conn);  

