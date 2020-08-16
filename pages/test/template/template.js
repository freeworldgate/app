// pages/test/template/template.js

var template = require('./../../../template/template.js')
var request = require('./../../../utils/request.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2812%29.jpeg",

    // name:""
  },

  onLoad:function(options){
    // var myFunc = "myFunc"
    //   eval(myFunc + '()')

    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // var url = currentPage.route
    // // 当前页面的路径
    // console.log("url = ",url);




     var key1 = 'name.key';
     var key2 = 'name.person.age';
    //  if(this.data[key1])
    //  {
    //     this.data[key1] = {};
    //     this.data[key2] = {};
    //  }
     this.setData({
        [key1]:'klahdkla',
        [key2]:84,
     })
  },





  dialog1:function(){
    template.createDialog(this).show("信息窗口","信息内容");
  },
  dialog2: function () {
    var that = this;
    template.createOperateDialog(that).show("操作窗口","操作窗口内容",function(){
      template.createOperateDialog(that).hide();
      // template.createDialog(that).show("信息窗口", "信息内容");
      console.log("confirm");
    },function(){
      
      template.createOperateDialog(that).hide();
    });
  },
  dialog3: function () {
    var that = this;
    template.createEditImageDialog(this).setDialog("评论","说出你想说的话...", 10, function(text,urls){
      template.createEditImageDialog(that).hide();
      console.log("文字:" , text);
      console.log("图片链接:",urls);
      
    }).show();
  },

  dialog4: function () {
    template.createEditTextDialog(this).show("编辑内容","说出你想说的话...",20,function(text){
      console.log("-内容-:" + text);
    });
  },
  dialog5: function () {
      template.createShortTextDialog(this).show("修改用户昵称",100,function(text){
        console.log(text);
      });
  },
  dialog6: function () {
    var that = this;
    template.createLabelLoading(this).show();
    setTimeout(function () {
      template.createLabelLoading(that).hide();
    }, 3000);
  },
  dialog7: function () {
    template.createLabelLoadingSuccess(this).show();
  },
  dialog8: function () {
    template.createLabelLoadingError(this).show();
  },
  dialog9: function () {
      template.createEditNumberDialog(this).show("修改用户名",10,function(text){
        console.log(text);
      });
  },

  dialog10: function () {
    var that = this;
    template.createPageLoading(that).show("页面加载中");



    setTimeout(function(){
        template.createPageLoading(that).hide();
    },3000);


  },
  dialog11: function () {
    var that = this;
    template.createPageLoadingError(that).show("页面加载中");
    setTimeout(function () {
      template.createPageLoadingError(that).hide();
    }, 3000);
  },


  dialog12: function () {
    var that = this;
    template.createSelectionDialog(this).setLayout('bottom', 'y')
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); template.createSelectionDialog(that).hide()  })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); template.createSelectionDialog(that).hide() })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC");template.createSelectionDialog(that).hide() }).show();
  },

  dialog13: function () {
    template.createSelectionDialog(this).setLayout("top", "x")
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC");}).show();

  },

  dialog14: function () {
    template.createSelectionDialog(this).setLayout("top", "y")
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC"); }).show();
  },
  dialog15: function () {
    template.createSelectionDialog(this).setLayout("left", "x")
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC"); }).show();
  },
  dialog16: function () {
    template.createSelectionDialog(this).setLayout("right", "x")
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC"); }).show();
  },
  dialog17: function () {
    template.createSelectionDialog(this).setLayout("bottom", "x")
      .addItem('/images/load.gif', "选项A", function () { console.log("AAAA"); })
      .addItem('/images/load.gif', "选项B", function () { console.log("BBBB"); })
      .addItem('/images/load.gif', "选项C", function () { console.log("CCCC"); }).show();
  },
  dialog18: function () {
    template.createDownloadImageDialog(this).show("支付宝", "收款码",'https://oss.211shopper.com/mmqrcode1568277243642.png');
  },

  dialog19: function () {
    template.createTipDialog(this).show("info","Info级别信息");
  },
  dialog20: function () {
    template.createTipDialog(this).show("warn", "warn级别信息");
  },
  dialog21: function () {
    template.createTipDialog(this).show("error", "error级别信息");
  },

//---------------------------------------------------------------------------------------------
  dialog22: function () {
    template.createHttpClient(this).send(request.url.test1,"GET",{});
  },

  dialog23: function () {
    template.createHttpClient(this).send(request.url.test2, "GET", {});
  },
  dialog24: function () {
    template.createHttpClient(this).send(request.url.test3, "GET", {});
  },
  dialog25: function () {
    template.createHttpClient(this).send(request.url.test4, "GET", {});
  },
  dialog26: function () {
    var that = this
    var httpClient = template.createHttpClient(this).setMode("page",true).addHandler("0x03000000", function () {
      template.createDialog(that).show("你大爷","你二大爷");
    }).send(request.url.test5, "GET", {});

  },

  dialog27: function () {
    var that = this
    template.createUploadImageDialog(that).show("联谊群组", "上传联谊群组二维码", '',function(url){
      console.log("图片地址: = " , url);
    });
  },

  dialog28:function(){
    var that = this
    template.createChooseDialog(that).show( request.url.cityCompanys, {cityCode:'nj'}, function (data) {
      console.log("请求结果:",data);
    });
  },
  dialog29: function () {
    var that = this
    template.createChooseDialog(that).show( request.url.citySchools, { cityCode: 'nj' }, function (data) {
      console.log("请求结果:", data);
    });
  },
  dialog30: function () {
    var that = this
    template.createChooseDialog(that).show(request.url.cityLocations, { cityCode: 'nj' }, function (data) {
      console.log("请求结果:", data);
    });
  },
  dialog31: function () {
    var that = this
    template.createChooseDialog(that).show( request.url.cityManagers, { cityCode: 'nj' }, function (data) {
      console.log("请求结果:", data);
    });
  },

  dialog32: function () {
    var that = this
    template.createChooseDialog(that).show(request.url.locationTypes, {  }, function (data) {
      console.log("请求结果:", data);
    });
  },
  dialog33: function () {
    var that = this
    template.createChooseDialog(that).show(request.url.dateList, {  }, function (data) {
      console.log("请求结果:", data);
    });
  },
  dialog34: function () {
    var that = this
    template.createChooseDialog(that).show(request.url.timeList, {}, function (data) {
      console.log("请求结果:", data);
    });
  },
  dialog35: function () {
    var that = this
    template.createChooseDialog(that).show(request.url.orgLevels, {}, function (data) {
      console.log("请求结果:", data);
    });
  },


















})