// pages/manage/groups/groups.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var inviteReq = require('./../../../utils/invite.js')
var userInvite = require('./../../../utils/userInvite.js')
var upload = require('./../../../utils/uploadFile.js')
var template = require('./../../../template/template.js')




Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.cashierId = options.cashierId;
    that.setData({cashierId: options.cashierId})
    that.init("label");
  },
  queryGroups:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (groups) {
      that.setData({
        groups:groups,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.allCashierGroups, "GET", {cashierId:that.data.cashierId});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}


      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            groups:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextPageCashierGroups, "GET",{ cashierId:that.data.cashierId ,page:that.data.page});
    
  },


  init:function (tab) {
    var that = this;
    that.queryGroups(tab);
  },

  onPullDownRefresh:function (params) {
      var that = this;
      that.queryGroups("label");
  },


  changeStatu:function (res) {
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    var groupId = res.currentTarget.dataset.groupid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      that.init("label");
    })
    httpClient.addHandler("openCashier", function () {
      that.init("");
      template.createOperateDialog(that).show("提示","请先启用用户",function(){
        
      },function(){});



    })


    
    httpClient.send(request.url.changeGroupStatu, "GET",{cashierId:cashierId,groupId:groupId});

  },


  replaceImg:function (res) {
    var that = this;
 
    var groupId = res.currentTarget.dataset.groupid;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("cashierGroup", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            wx.hideLoading({
              complete: (res) => {},
            })
            console.log("---start---" ,urls);

    
            // , urls
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (post) {
              tip.showTip("上传成功......");
              that.queryGroups("label");

            })
            httpClient.send(request.url.replaceCashierGroup, "GET",{imgUrl: urls[0],cashierId:that.data.cashierId,groupId:groupId}
            );
  
  
            // page.editImageDialog.success();
            // createLabelLoading(page).hide();
            // createLabelLoadingSuccess(page).show();
        },
        function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("上传失败......");
              },
            })
            
  
        });
        
      },
    })










  },
  
  replace:function(res){
    var that = this;


    template.createOperateDialog(that).show("更新群组","确认更新群组",function(){
      that.replaceImg(res);
    },function(){});

  },
  upload:function()
  {
    var that = this;
 
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("cashierGroup", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            wx.hideLoading({
              complete: (res) => {},
            })
            console.log("---start---" ,urls);

    
            // , urls
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (post) {
              tip.showTip("上传成功......");
              that.queryGroups("label");

            })
            httpClient.send(request.url.uploadCashierGroup, "GET",{imgUrl: urls[0],cashierId:that.data.cashierId}
            );
  
  
            // page.editImageDialog.success();
            // createLabelLoading(page).hide();
            // createLabelLoadingSuccess(page).show();
        },
        function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("上传失败......");
              },
            })
            
  
        });
        
      },
    })





  },

  showImg:function (res) {
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
      complete: (res) => {},
      current: 'current',
      fail: (res) => {},
      success: (res) => {},
    })
  },

  remove:function(res){
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    var groupId = res.currentTarget.dataset.groupid;

    template.createOperateDialog(that).show("删除群组","确认删除群组",function(){
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function () {
          that.init("label");
        })
        httpClient.send(request.url.deleteGroup, "GET",{cashierId:cashierId,groupId:groupId});

    },function(){});





  }
})