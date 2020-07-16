// pages/manage/cashiers/cashiers.js
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
    cashiers:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.init("label");
  },
  queryCashierss:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (cashiers) {
      that.setData({
        cashiers:cashiers,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.allCashiers, "GET", {});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}
      var user = wx.getStorageSync('user');
      var fromUser = wx.getStorageSync('fromUser')
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            cashiers:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextPageCashiers, "GET",{ userId:user.userId ,page:that.data.page});
    
  },


  init:function (tab) {
    var that = this;
    var user = wx.getStorageSync('user');
    if(user){
      that.setData({user:user})
      that.queryCashierss(tab);

    }
    // if(user && (that.data.pks.length === 0))
    // {
    //   that.queryPks(tab);
    // }
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryCashierss("");
  },




  // viewPk:function (res) {
  //   var pkid = res.currentTarget.dataset.pkid;
  //   wx.navigateTo({
  //     url: '/pages/pk/pk/pk?pkId=' + pkid,
  //   })
  // },
  createCashier:function()
  {
    var that = this;
    login.getUser(function(user){

      template.createEditTextDialog(that).show("添加用户", "用户名称","", 50, function (name) {
        
                // , urls
                var httpClient = template.createHttpClient(that);
                httpClient.setMode("label", true);
                httpClient.addHandler("success", function (post) {
                  that.init("label");
                })
                httpClient.send(request.url.createCashier, "GET",{name:name});
            
  
  
  
      });





    })
  },

  changeStatu:function (res) {
    var that = this;
    var cashierId = res.currentTarget.dataset.cashierid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      that.init("label");
    })
    httpClient.send(request.url.changeCahierStatu, "GET",{cashierId:cashierId});






  }
})