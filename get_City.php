
<?php

header("Content-Type:text/html;charset=utf-8");
	//$page=$_GET['p'];
    $host="localhost"; //数据库服务器名称
    $username="root"; // 连接数据库用户名
    $password="123456"; // 连接数据库密码
    $db="yp_test"; // 数据库的名字
    // 连接到数据库
    $conn=mysql_connect($host, $username,
                        $password);
     if(!$conn){
	  echo "数据库连接失败";
	  exit;
	 }
	// 从表中提取信息的sql语句
$sql="select distinct SF,CSMC from csxx,sfxx where csxx.CSBH = sfxx.CSBH";
	//选择所要操作的数据库
	mysql_select_db($db);
    //设置数据库编码格式
	mysql_query("set names utf8");
	// 执行sql查询
    $result=mysql_query($sql);
    // 获取查询结果
	$note;$i=0;
    while($row=mysql_fetch_array($result)){
		//表格输出
		$note["sf"]=urlencode($row["SF"]); //省份
		$note["csmc"]=urlencode($row["CSMC"]);//城市名	名
		$notes[$i++]=$note;
		/*if($i==1)
		{
			echo "<div data-role='collapsible'>";
			echo "<h4>{$notes[0]['sf']}</h4>";
            echo "<ul data-role='listview'>";
			echo "<li><a href='#'>{$notes[0]['csmc']}</a></li>";
			}
		else
		{
			if(strcmp($notes[$i-1]["sf"],$notes[$i-2]["sf"]))
				{
				echo "</ul></div>";
      			echo "<div data-role='collapsible'>";
				$j=$i-1;
    			echo "<h4>{$notes[$j]['sf']}</h4>";
        		echo "<ul data-role='listview'>";
				echo "<li><a href='#'>{$notes[$j]['csmc']}</a></li>";
				}
			else
				{
				$j=$i-1;
				echo "<li><a href='#'>{$notes[$j]['csmc']}</a></li>";
				
				}
			}	*/	
	}
	echo $notes=urldecode(json_encode($notes));	
	//释放结果
    mysql_free_result($result);
    // 关闭连接
    mysql_close($conn); 

