    var _province=0;  //定位省
    var _city=0;        //定位城市
    var _weiDu=0;      
    var _jingDu=0;
    var yd_weiDu=0;
    var yd_jingDu=0;
    var _isbind = 0;
    var _iscity = 0;
    var _sequence = 1;  //排序类型   1为价格  2为距离
    var _vas="listButDown";
    var http="http://192.168.1.110:8880/ajaxdemo/"; 
    var SystemEvent = systemEvent();
    var MapEvent = mapEvent();
    function Alert(a){
        var i=40;
        console.log("Alert函数");
        $("#index").find('#alert_text').html(a);
        var InterValObj = window.setInterval(function(){
            if(i==0)
                window.clearInterval(InterValObj);//停止计时器
            var opacity = 0.02*i;
            $("#index").find('.alert').css('opacity',opacity);
            i--;
        },25);
    }
    /*function SetRemainTime(){
        console.log("SetRemainTime函数");
        if(i==0)
            window.clearInterval(InterValObj);//停止计时器
        var opacity = 0.02*i;
        $("#index").find('alert').css('opacity',opacity);
        i--;
    }*/
        //index页面加载函数
    /*-------------------------------------------*/
    $(document).on("pageinit","#index",function(){
        if (_isbind) return;
            _isbind = 1;
        $("#index").find('.alert').css('opacity',0);
        document.addEventListener("deviceready", onDeviceReady, false); 
        searchLocalStorage();                                           //查看localStorage中数据
        get_addressInfo();                                              //获取地址
        bindEvent();                                                    //绑定事件
        
    });

         //绑定事件
    /*-------------------------------------------*/
    var bindEvent = function(){
        $("#indexMoreBut").hide();                    //隐藏加载更多按钮
        $("#indexSearchListBut").on("click",function listButDown(){
            SystemEvent.ButDisable();
            SystemEvent.ShowLoading();
            _vas="listButDown";
            getList(showList);
        }); //普通列表显示
        $("#indexSearchMapBut").on("click",function mapButDown(){
            SystemEvent.ButDisable();
            SystemEvent.ShowLoading();
            _vas="mapButDown";
            getList(showMap);
        });  //地图列表显示
        $("#indexDataList").on("click","a",getDetail);//list为动态生成，所以需加入"a"，即a标
        $("#cityDataList").on("click","a",getCity);
        $("#loginLoginBut").on("click",login);
        $("#indexMoreBut").on("click",showList);
        $("#signinCommitBut").on("click",signin);
    };  

    /**************************************************************************************/
    // 监听按键  
    function onDeviceReady() {        // Register the event listener          
        document.addEventListener("backbutton", onBackKeyDown, false);    
    }      
    function onBackKeyDown() {
        if ($.mobile.activePage.is('#index')) {
            //Alert('再点击一次退出!');
            document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
            document.addEventListener("backbutton", exitApp, false);// 绑定退出事件
            // 3秒后重新注册
            var intervalID = window.setTimeout(function() {
                window.clearInterval(intervalID);
                document.removeEventListener("backbutton", exitApp, false); // 注销返回键
                document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
                }, 3000);
        }
        else if($.mobile.activePage.is("#city")){
            $.mobile.changePage("#index");
            //alert("跳转到index");
        }
        else if($.mobile.activePage.is("#detail")){
            $.mobile.changePage("#index");
            //alert("跳转到index");
        }
        else if($.mobile.activePage.is("#map")){
            $.mobile.changePage("#detail");
            //alert("跳转detail");
        }
        else if($.mobile.activePage.is("#mapList")){
            $.mobile.changePage("#index");
            //alert("跳转到index");
        }
        else if($.mobile.activePage.is("#signin")){
            $.mobile.changePage("#index");
            //alert("跳转到index");
        }
                    /* else {
                             navigator.app.backHistory();
                     }*/
    }
    function exitApp() {
        navigator.app.exitApp();
    } 
    /***************************************************************************************************/
       //获取城市
    /*-------------------------------------------*/
    function getCity(){
        _city=$(this).attr("c");
         $("#index").find("#indexCity").html(_city);
         localStorage.setItem("city",_city);
    }
        
          //定位事件
    /*-------------------------------------------*/
    function get_addressInfo(){
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(r.point);
                var myGeo = new BMap.Geocoder();
                myGeo.getLocation(new BMap.Point(r.point.lng,r.point.lat), function(rs){
                    // console.log(MyApp.app.mapCenter);
                    console.log(rs);
                    var addComp = rs.addressComponents;
                    //alert(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
              
                    //全局变量省份和城市
                    //_province=addComp.province;
                    _province="黑龙江省";
                    i_city=addComp.city;
              
                    //alert("经度："+r.point.lng+"纬度："+r.point.lat);
                    _weiDu=r.point.lat;
                    _jingDu=r.point.lng;
                    if(_city==0||_city==i_city){
                        $("#index").find("#indexCity").html(i_city);
                        localStorage.setItem("city",i_city);
                        _city=i_city;
                    }else if(i_city!=_city&&_city!=0){
                    alert("上次定位为"+_city+"，此时您在"+i_city+"。以更改到当前位置");
                    _city=i_city;
                    //最初修改index页面的地址显示
                    $("#index").find("#indexCity").html(_city);
                    localStorage.setItem("city",_city);
                    }  
                });       
            }else {
                alert('未知地址（'+this.getStatus() + '）');
            }
        });
    }
    /*初次登录软件，查看localStorage中是否有值*/
    /*-------------------------------------------*/
    function searchLocalStorage(){
        //遍历localStorage
        var storage = window.localStorage; 
        var save=0;
        for (var i=0, len = storage.length; i < len; i++)
        {
            var key = storage.key(i); 
            if(key=="pass"){
                $("#loginPassword").val(storage.getItem(key)); 
                save=save+1;
            }else if(key=="phone"){
                $("#loginPhoneNum").val(storage.getItem(key)); 
                save=save+1;
            }else if(key=="city"){
                _city=storage.getItem(key);
                //$("#index").find("#indexCity").html(_city);
            }
            if(save==2)
            {
                login();
                break;
            }
        }

    }
    /******************************************************************************/
        //点击查询按钮 执行获取最初表单
    /*-------------------------------------------*/
    function getList(callback){
        console.log("getList函数");
        $("#indexMoreBut").hide();//隐藏加载更多按钮
        $("#indexDataList").html("");//清空list中内容
        if($("#indexKeyword").val()){
            var data = {"key":$("#indexKeyword").val(),"province":_province,"city":_city,"sequence":_sequence,"weiDu":_weiDu,"jingDu":_jingDu};
            $.getJSON(http+"DBlist.php",data,function(vas){
                //如果调用php成功
                if(vas&&"listButDown"===_vas){
                    _vas=vas;
                    /*showList();*/
                    (callback && typeof(callback) === "function") && callback(data);
                    return 1;
                }
                else if(vas&&"mapButDown"===_vas){
                    _vas=vas;
                    /*showMap();*/
                    (callback && typeof(callback) === "function") && callback(data);
                    return 1;
                }
                else{
                    $("#indexDataList").html("");//清空list中内容
                    Alert('无查询结果');
                    SystemEvent.HideLoading();
                    SystemEvent.ButAble();
                    return; 
                }
            });
        }else{
            Alert("请输入查询药品名称！");
            SystemEvent.HideLoading();
            SystemEvent.ButAble();
            return;
        }   
    }
        //显示查询结果
    /*-------------------------------------------*/
    function showList(){    
        console.log("showList函数");
        var list = $("#indexDataList"); //获取list
        var arr = [];
        var num=9;
        var show_num = $("#indexDataList li").length;//获取indexDataList中li的个数
        if(show_num==_vas.length)
        {
            Alert("无更多数据！");
            return ;
        }
        if(9>=(_vas.length-show_num))
            num=_vas.length-show_num;
        for(o=show_num ;o<(show_num+num);o++){
            arr.push('<li><a href="#detail" data-transition="slideup" data-no="' + o + '"data-ydm="' + _vas[o].ydm+ '"data-yddz="' + _vas[o].yddz +'"data-yddh="' + _vas[o].yddh + '"data-ypm="' + _vas[o].ypm + '"data-ypcs="' + _vas[o].ypcs + '"data-ypgg="' + _vas[o].ypgg + '"data-ypjx="' + _vas[o].ypjx + '"data-ypbz="' + _vas[o].ypbz +'"data-ypdj_u="' + _vas[o].ypdj_u +'"data-ypdj_d="' + _vas[o].ypdj_d +'"data-juli="' + _vas[o].juli +  '"data-ydjd="' + _vas[o].ydjd + '"data-ydwd="' + _vas[o].ydwd + '">' + '<h2>药店名：' + _vas[o].ydm + '</h2><p>药品名：' + _vas[o].ypm + '</p><p>产商：' + _vas[o].ypcs + '</p><p>距离：'+ _vas[o].juli + '</p>' + '<p class="ui-li-aside">单价：' + _vas[o].ypdj_u + "~" + _vas[o].ypdj_d + '</p>' + '</a></li>');
        }

        list.append(arr.join(""));//join() 方法用于把数组中的所有元素放入一个字符串
        list.listview("refresh");//list动态加载后执行，否则不会以列表形式显
        
        SystemEvent.HideLoading();
        SystemEvent.ButAble();
        $("#indexMoreBut").show();//显示加载更多按钮     
    }

     //获取详细资料
    /*-------------------------------------------*/
    var isAjax = false;
    function getDetail(){
        console.log("getDetail函数");
        if(isAjax) return;
        isAjax = true; //防止list被多次点击
        
        $.mobile.loading("show");
        var number = $(this).attr("data-no");
        var ydm = $(this).attr("data-ydm");
        var yddz = $(this).attr("data-yddz");
        var yddh = $(this).attr("data-yddh");
        var ypm = $(this).attr("data-ypm");
        var ypcs = $(this).attr("data-ypcs");
        var ypgg = $(this).attr("data-ypgg");
        var ypjx = $(this).attr("data-ypjx");
        var ypbz = $(this).attr("data-ypbz");
        var ypdj_u = $(this).attr("data-ypdj_u");
        var ypdj_d = $(this).attr("data-ypdj_d");
        var juli = $(this).attr("data-juli");
        yd_jingDu = $(this).attr("data-ydjd");
        yd_weiDu = $(this).attr("data-ydwd");
        $("#detail").find(".ui-content h2").html(ydm);//页面id为detail中class为ui-contenh2标签输出ydm 若有多个h2可在.html前加入first()
        
        //跳转map
        _mapKey=ydm.concat(yddz);//合并
        _h3Map='<a href="#map" data-transition="slideup">' + "点击跳转地图页面" + '</a>';
        $("#detail").find(".ui-content h3").html(_h3Map);
        //显示table表头
         
        //var grid =$("#detail").find(".ui-content div");
        var grid =$("#detail").find(".ui-content div").first();
        grid.html("");
        var grid_data='<div class="ui-block-a"><span class="yangshi_cu">'+"药店地址"+'</span></div><div class="ui-block-b"><span>'+ yddz +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药店电话"+'</span></div><div class="ui-block-b"><span>'+ yddh +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药品名"+'</span></div><div class="ui-block-b"><span>'+ ypm +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药品厂商"+'</span></div><div class="ui-block-b"><span>'+ ypcs +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药品规格"+'</span></div><div class="ui-block-b"><span>'+ ypgg +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药品剂型"+'</span></div><div class="ui-block-b"><span>'+ ypjx +'</span></div><div class="ui-block-a"><span class="yangshi_cu">药品包装</span></div><div class="ui-block-b"><span>'+ ypbz +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药品单价"+'</span></div><div class="ui-block-b"><span>'+ ypdj_u+"~"+ypdj_d +'</span></div><div class="ui-block-a"><span class="yangshi_cu">'+"药店距离"+'</span></div><div class="ui-block-b"><span>'+ juli +'</span></div>';
        grid.append(grid_data); 
        $.mobile.loading("hide");
        isAjax=false;
        $.mobile.changePage("#detail");
    }

        //跳转到map时触发函数，每次跳转均触发
    /*-------------------------------------------*/
    $(document).on("pageshow","#map",function(){
        console.log("1");
        var mapSelectText=$("#mapSelect").find("option:selected").text(); 
        mapSelectChange(mapSelectText);
    });
    $(document).on("pageshow","#mapList",function(){
        /*showMap();*/
    });

    //异步调用百度js
    /*  -------------------------------------------*/
    window.onload = map_load;

    function map_load() {
        var load = document.createElement("script");
        load.src = "http://api.map.baidu.com/api?v=2.0&ak=IDvNBsejl9oqMbPF316iKsXR&callback=map_init";
        document.body.appendChild(load);
    }
        //地图显示查询结果
    /*  -------------------------------------------*/
    function showMap(){
        console.log("showMap函数");
        $.mobile.changePage("#mapList");
        var map = new BMap.Map("allmap"); // 创建Map实例  
        var point = new BMap.Point(_jingDu,_weiDu); //地图中心点
        map.centerAndZoom(point,13); // 初始化地图,设置中心点坐标和地图级别。  
        map.enableScrollWheelZoom(true); //启用滚轮放大缩小  
        //向地图中添加缩放控件  
        var ctrlNav = new window.BMap.NavigationControl({  
            anchor: BMAP_ANCHOR_TOP_LEFT,  
            type: BMAP_NAVIGATION_CONTROL_LARGE  
        });  
        map.addControl(ctrlNav);  
      
        //向地图中添加缩略图控件  
        var ctrlOve = new window.BMap.OverviewMapControl({  
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,  
            isOpen: 1  
        });  
        map.addControl(ctrlOve);  
      
        //向地图中添加比例尺控件  
        var ctrlSca = new window.BMap.ScaleControl({  
            anchor: BMAP_ANCHOR_BOTTOM_LEFT  
        });  
        map.addControl(ctrlSca);  
      
        var point = new Array(); //存放标注点经纬信息的数组  
        var marker = new Array(); //存放标注点对象的数组  
        var info = new Array(); //存放提示信息窗口对象的数组
        var searchInfoWindow=new Array();  
        //显示结果前十的坐标
        for (var i = 0; i < 10; i++) {  
            console.log(_vas[i].ydm);
            var p0 = _vas[i].ydjd; //  
            var p1 = _vas[i].ydwd; //按照原数组的point格式将地图点坐标的经纬度分别提出来  
            point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点  
            marker[i] = new window.BMap.Marker(point[i]); //按照地图点坐标生成标记  
            map.addOverlay(marker[i]);  
            marker[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画  
            var label = new window.BMap.Label(_vas[i].ydm, { offset: new window.BMap.Size(20, -10) });  
            marker[i].setLabel(label);  
            info[i] = "<div><p style=’font-size:12px;lineheight:1.8em;’>" + "</br>地址：" + _vas[i].yddz + "</br> 电话：" + _vas[i].yddh + "</br></p></div>"; // 创建信息窗口对象
            searchInfoWindow[i] = new BMapLib.SearchInfoWindow(map,info[i], {
                title  : _vas[i].ydm,      //标题
                width  : 290,             //宽度
                height : 55,              //高度
                panel  : "panel",         //检索结果面板
                enableAutoPan : true,     //自动平移
                searchTypes   :[
                    BMAPLIB_TAB_SEARCH,   //周边检索
                    BMAPLIB_TAB_TO_HERE,  //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            });
                                            //添加点击事件
            marker[i].addEventListener("click",(function(k){
                // js 闭包
                return function(){
                //将被点击marker置为中心
                map.centerAndZoom(point[k], 18);
                //在marker上打开检索信息窗口
                searchInfoWindow[k].open(marker[k]);
                }
            })(i)                            
            ); 
        }  
    SystemEvent.ButAble();
    }
        //map页面函数  选择路程
    /*-------------------------------------------*/
    function mapSelectChange(value){
        if(value=="walking"){
            MapEvent.Walking();
            /*walking();*/
        }else if(value=="driving"){
            MapEvent.Driving();
        }else{
            MapEvent.Bus();
        }
    }
    
    function mapEvent(){
                //步行路程
    /*-------------------------------------------*/
        var Walking = function(){ 
            var map = new BMap.Map("mapMap");
            map.centerAndZoom(new BMap.Point(_jingDu,_weiDu), 11);
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "mapResult", autoViewport: true}});
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var point1 = new BMap.Point(_jingDu,_weiDu);
            var point2 = new BMap.Point(yd_jingDu,yd_weiDu);
            walking.search(point1, point2)
        }

           //驾车路程
         /*-------------------------------------------*/
        var Driving = function(){
            var map = new BMap.Map("mapMap");
            map.centerAndZoom(new BMap.Point(_jingDu,_weiDu), 12);
            var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "mapResult", autoViewport: true}});
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var point1 = new BMap.Point(_jingDu,_weiDu);
            var point2 = new BMap.Point(yd_jingDu,yd_weiDu);
            driving.search(point1, point2);
            }
            
           //线车路程   
        /*-------------------------------------------*/
        var Bus = function(){ 
            var map = new BMap.Map("mapMap");
            map.centerAndZoom(new BMap.Point(_jingDu,_weiDu), 12);

            var transit = new BMap.TransitRoute(map, {
                renderOptions: {map: map, panel: "mapResult"}
            });
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var point1 = new BMap.Point(_jingDu,_weiDu);
            var point2 = new BMap.Point(yd_jingDu,yd_weiDu);
            transit.search(point1, point2);
        }
        return {
            Walking : Walking,
            Driving : Driving,
            Bus : Bus
        }
    }                                                      


    //city页面声明函数
    /*-------------------------------------------*/
    $(document).on("pageinit","#city",function(){
        if(_iscity) return ;
        _iscity=1;
        //alert ("city");
        $.getJSON(http+"get_City.php",function(city_list){
            var c_list = $("#cityDataList");
            var city_arr = [];
            for(var i in city_list)
            {
                if(i==0){
                    city_arr.push('<div data-role="collapsible">');
                    city_arr.push('<h4>'+city_list[0].sf+'</h4>');
                    city_arr.push('<ul data-role="listview">');
                    city_arr.push('<li><a href="#index" data-transition="slideup" c="'+ city_list[0].csmc +'">'+city_list[0].csmc+'</a></li>');
                }else{
                    if((city_list[i].sf)==(city_list[i-1].sf))
                {
                    city_arr.push('<li><a href="#index" data-transition="slideup" c="'+ city_list[i].csmc +'">'+city_list[i].csmc+'</a></li>');
                }else{
                    city_arr.push('</ul></div><div data-role="collapsible">');
                    city_arr.push('<h4>'+city_list[i].sf+'</h4><ul data-role="listview">');
                    city_arr.push('<li><a href="#index" data-transition="slideup" c="'+ city_list[i].csmc +'">'+city_list[i].csmc+'</a></li>');
                }
            }
        }
        city_arr.push("</ul></div>");
        c_list.html(city_arr.join(""));
        //显示JQM格式
        $("#cityDataList").collapsibleset("refresh");
        $("#city ul").listview(); 
        });
    });


            /*  登录函数*/
    /*-------------------------------------------*/
    function login(){
        $.mobile.changePage("#index");
        var pn=$("#loginPhoneNum").val();
        var pw=$("#loginPassword").val();
        var data = {"phonenumber":pn,"password":pw};
        $.getJSON(http+"login.php",data,function(data){
            // alert("Data: " + data + "\nStatus: " + status);
            if(data.state=="true")
            {    
                $("#index").find("#indexLogin").html("信息");
                $("#index").find("#indexLogin").attr("href","#leftpanel");        //更改链接地址
                $("#leftpanel").find("h3").first().html(data.name);
                if($("#loginRemember").is(":checked"))
                {
                    localStorage.setItem("phone",pn);                  //利用localStorage保存用户名密码
                    localStorage.setItem("pass",pw);
                }else{
                localStorage.removeItem("phone");
                localStorage.removeItem("pass");
                }
            }else if(data.state=="false")
                Alert("登录失败");
            else
                Alert("传值有问题");
       });
    }       
        //注册函数
    /*-------------------------------------------*/
    function signin()
    {
        var phone=$("#signinPhone").val();
        var name=$("#signinUsername").val();
        var pass=$("#signinPassword").val();
        $.getJSON(http+"signin.php",{"name":name,"pass":pass,"phone":phone},function(data){
            if(data.a=="a"){
                Alert("注册成功");
                $.mobile.changePage("#index");
                $("#loginPhoneNum").val(phone);
                $("#loginPassword").val(pass); 
                login();
            }else if(data.a=="b"){
                Alert("该手机号码已被注册");
            }else
                Alert("注册传值错误");
        });
    }       
                                                                
        //退出登录函数
    /*-------------------------------------------*/
    function quit()
    {
        $("#leftpanel" ).panel( "close" );                          //关闭侧边栏
        $("#index").find("#indexLogin").html("登录");
        $("#index").find("#indexLogin").attr("href","#login");        //更改链接地址
        localStorage.removeItem("phone");                           //清除localStorage
        localStorage.removeItem("pass");    
    }

        
        //发送验证码
    /*-------------------------------------------*/
    var InterValObj; //timer变量，控制时间
    var count = 10; //间隔函数，1秒执行
    var curCount;//当前剩余秒数
    var code = ""; //验证码
    var codeLength = 6;//验证码长度
    function sendMessage() {
        curCount = count;
        var phone=$("#signinPhone").val();//手机号码
        if(phone != ""){
            //产生验证码
            for (var i = 0; i < codeLength; i++) {
                code += parseInt(Math.random() * 9).toString();
            }
            //设置button效果，开始计时
            $("#signinSendCodeBut").attr("disabled","ture");//当前按钮不可
            $("#signinSendCodeBut").html("请在" + curCount + "秒内输入验证码");
            InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
            //向后台发送处理数据
            /* $.ajax({
                type: "POST", //用POST方式传输
                dataType: "text", //数据格式:JSON
                url: 'Login.ashx', //目标地址
                data: "phone=" + phone + "&code=" + code,
                error: function (XMLHttpRequest, textStatus, errorThrown) { },
                success: function (msg){ }
            });*/
        }else{
            Alert("请输入手机号");
        }
    }

    //timer处理函数
    function SetRemainTime() {
        if (curCount == 0){                
            window.clearInterval(InterValObj);//停止计时器
            $("#signinSendCodeBut").removeAttr("disabled");//启用按钮
            $("#signinSendCodeBut").html("重新发送验证码");
            code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效    
        }else{
            curCount--;
            $("#signinSendCodeBut").html("请在" + curCount + "秒内输入验证码");
        }
    }

    /*系统事件*/
    function systemEvent(){
        var ButDisable = function(){
            $("#indexSearchListBut").attr("disabled",true);//当前按钮不可用
            $("#indexSearchMapBut").attr("disabled",true);
        }
        var ButAble = function(){
            $("#indexSearchListBut").attr("disabled",false);//当前按钮可用
            $("#indexSearchMapBut").attr("disabled",false);
        }
        var ShowLoading = function(){
            setTimeout(function(){  
                $.mobile.loading('show');  
            },1);  //显示加载按钮
        }
        var HideLoading = function(){
            setTimeout(function(){  
                $.mobile.loading('hide');  
            },1);  //隐藏加载按钮
        }
        return {
            ButDisable : ButDisable,
            ButAble : ButAble,
            ShowLoading : ShowLoading,
            HideLoading : HideLoading
        }
    }
