// pages/manage/feeCodes/feeCodes.js
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
    feeCodes:[]
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
  queryFeeCodes:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (feeCodes) {
      that.setData({
        feeCodes:feeCodes,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.allFeeCodes, "GET", {cashierId:that.data.cashierId});
  },

  /**
   * 页面上拉触底事件的处理函数
   */


  init:function (tab) {
    var that = this;
    that.queryFeeCodes(tab);

  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryFeeCodes("label");
  },





  changeStatu:function (res) {
    var that = this;
 
    var feeCodeId = res.currentTarget.dataset.feecodeid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      that.init("label");
    })
    httpClient.send(request.url.changeFeeCodeStatu, "GET",{cashierId:that.data.cashierId,feeCodeId:feeCodeId});

  },



  
  upload:function(res)
  {
    var that = this;
    var feeNumber = res.currentTarget.dataset.feenumber;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("cashierFeeCode", res.tempFilePaths, that,
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
              that.queryFeeCodes("label");

            })
            httpClient.send(request.url.uploadFeeCode, "GET",{imgUrl: urls[0],cashierId:that.data.cashierId,feeNumber:feeNumber}
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



  replace:function(res){
    var that = this;


    template.createOperateDialog(that).show("更新打赏码","确认更新打赏码",function(){
      that.replaceImg(res);
    },function(){});

  },

  replaceImg:function (res) {
    var that = this;
 
    var feeCodeId = res.currentTarget.dataset.feecodeid;

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
              that.queryFeeCodes("label");

            })
            httpClient.send(request.url.replaceFeeCode, "GET",{imgUrl: urls[0],cashierId:that.data.cashierId,feeCodeId:feeCodeId}
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












  remove:function(res){
    var that = this;
 
    var feeCodeId = res.currentTarget.dataset.feecodeid;

    template.createOperateDialog(that).show("删除群组","确认删除群组",function(){
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function () {
          that.init("label");
        })
        httpClient.send(request.url.deleteFeeCode, "GET",{cashierId:that.data.cashierId,feeCodeId:feeCodeId});

    },function(){});





  }
})