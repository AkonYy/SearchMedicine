
<?php
header("Content-Type:text/html;charset=utf-8");
	require_once('DBinfo.php');
/*    $host="localhost"; //数据库服务器名称
    $username="root"; // 连接数据库用户名
    $password="123456"; // 连接数据库密码
    $db="yp_test"; // 数据库的名字*/
	
	     //获取html页面所传值
	$key = $_REQUEST["key"];
	$province = $_REQUEST["province"];
	$city = $_REQUEST["city"];
	$sequence = $_REQUEST["sequence"];
	$weiDu = $_REQUEST["weiDu"];
	$jingDu = $_REQUEST["jingDu"];
	//$pageSize=10;
	
    // 连接到数据库
   $conn=mysqli_connect(DB_HOST,DB_USER,DB_PWD,DB_DBNAME);
     if(!$conn){
	  echo "数据库连接失败";
	  //打印错误信息
	  printf("Connect failed: %s\n",mysqli_connect_error());
	  exit;
	 }
/*	 	//选择所要操作的数据库
	mysql_select_db($db);*/
    //设置数据库编码格式
	mysqli_query($conn,"set names utf8");
	

	function str_prefix($str, $char1=" ", $char2=" "){
		$str = $char1.$char2.$str.$char2.$char1;
		return $str;
		}
	$Search=str_prefix($key, '"', '%');
	/**
   *求两个已知经纬度之间的距离,单位为米
   *@param lng1,lng2 经度
   *@param lat1,lat2 纬度
   *@return float 距离，单位米
   **/
function getdistance($lng1,$lat1,$lng2,$lat2){
	//将角度转为狐度
	$radLat1=deg2rad($lat1);//deg2rad()函数将角度转换为弧度
	$radLat2=deg2rad($lat2);
	$radLng1=deg2rad($lng1);
	$radLng2=deg2rad($lng2);
	$a=$radLat1-$radLat2;
	$b=$radLng1-$radLng2;
	$s=2*asin(sqrt(pow(sin($a/2),2)+cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)))*6378.137*1000;
	return $s;
}
	$sql_1="SELECT distinct b.YYXX02,b.YYXI08,b.YYXI04,a.CFMX03,a.CFMX04,a.CFMX05,a.CFMX06,a.CFMX07,a.CFMX08_MIN,a.CFMX08_MAX,c.CSMC,JD,WD FROM new_yaopin2 a,ydxx b,csxx c ,sfxx d where (a.CFMX03 like $Search) and (a.YYXX01=b.YYXX01) and (c.CSBH=b.CSBH)  and (c.CSBH=d.CSBH) and (c.CSMC like '$city') and (d.SF like '$province')order by (CFMX08_MIN+0) asc";
	$sql_2="SELECT distinct b.YYXX02,b.YYXI08,b.YYXI04,a.CFMX03,a.CFMX04,a.CFMX05,a.CFMX06,a.CFMX07,a.CFMX08_MIN,a.CFMX08_MAX,c.CSMC,JD,WD FROM new_yaopin2 a,ydxx b,csxx c ,sfxx d where (a.CFMX03 like $Search) and (a.YYXX01=b.YYXX01) and (c.CSBH=b.CSBH)  and (c.CSBH=d.CSBH) and (c.CSMC like '$city') and (d.SF like '$province')";
	// 从表中提取信息的sql语句
	if($sequence==1){	
		// 执行sql查询
    $result=mysqli_query($conn,$sql_1);
	if($result==false){
		printf("Query failed: %s\n",mysql_error($conn));
		}
	// 获取查询结果
	$note;$notes;$i=0;
    while($row=mysqli_fetch_array($result)){
		//结果赋值
		$note["ydm"]=urlencode($row['YYXX02']); //药店名
		$note["yddz"]=urlencode($row['YYXI04']);//地址
		$note["yddh"]=urlencode($row['YYXI08']);//电话
		$note["ypm"]=urlencode($row['CFMX03']);//药名
		$note["ypcs"]=urlencode($row['CFMX04']);//产商
		$note["ypgg"]=urlencode($row['CFMX05']);//规格
		$note["ypjx"]=urlencode($row['CFMX06']);//剂型
		$note["ypbz"]=urlencode($row['CFMX07']);//包装
		$note["ypdj_u"]=$row['CFMX08_MAX'];//单价 up
		$note["ypdj_d"]=$row['CFMX08_MIN'];//单价 down
		$note["ydjd"]=$row['JD'];//药店经度
		$note["ydwd"]=$row['WD'];//药店纬度
		$note["juli"]=round(getdistance($row['JD'],$row['WD'],$jingDu,$weiDu)); //四舍五入
		$notes[$i++]=$note;
		if($i>=100)
		break;   //截取前100个结果
	}	
		}

	else if($sequence==2){
		// 执行sql查询
    $result=mysqli_query($conn,$sql_2);
	if($result==false){
		printf("Query failed: %s\n",mysql_error($conn));
		}
	// 获取查询结果
	$note;$notes;$i=0;
    while($row=mysqli_fetch_array($result)){
		//表格输出
		$note["ydm"]=urlencode($row['YYXX02']); //药店名
		$note["yddz"]=urlencode($row['YYXI04']);//地址
		$note["yddh"]=urlencode($row['YYXI08']);//电话
		$note["ypm"]=urlencode($row['CFMX03']);//药名
		$note["ypcs"]=urlencode($row['CFMX04']);//产商
		$note["ypgg"]=urlencode($row['CFMX05']);//规格
		$note["ypjx"]=urlencode($row['CFMX06']);//剂型
		$note["ypbz"]=urlencode($row['CFMX07']);//包装
		$note["ypdj_u"]=$row['CFMX08_MAX'];//单价 up
		$note["ypdj_d"]=$row['CFMX08_MIN'];//单价 down
		$note["ydjd"]=$row['JD'];//药店经度
		$note["ydwd"]=$row['WD'];//药店纬度
		$note["juli"]=round(getdistance($row['JD'],$row['WD'],$jingDu,$weiDu));
		$notes[$i++]=$note;
	}
	if(!empty($notes[0]["ydm"]))
	{
		//按距离(首)和药品单价(次)排序
	foreach ($notes as $key => $value) {
		$juli[$key] = $value["juli"];
		$ypdj[$key] = $value["ypdj_d"];
		}
	array_multisort($juli, $ypdj, $notes);
	$notes=array_slice($notes,0,100); //截取前100个结果
	}
	}
	//输出结果到前台
	if(empty($notes[0]["ydm"]))
		echo "null";
	else
		echo $notes=urldecode(json_encode($notes));
	
	
	//释放结果
    mysqli_free_result($result);
   
    // 关闭连接
    mysqli_close($conn);  
	


