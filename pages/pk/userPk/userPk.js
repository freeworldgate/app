// pages/pk/invite/invite.js
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

    pks: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.init("label");
  },
  queryPks:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (pks) {
      that.setData({
          pks:pks,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.userPks, "GET", {});
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
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextUserPks, "GET",{ userId:user.userId ,page:that.data.page});
    
  },




  onShow:function () {
    var that = this;
    that.init("");
  },

  init:function (tab) {
    var that = this;
    var user = wx.getStorageSync('user');
    if(user){
      that.setData({user:user})
    }
    if(user && (that.data.pks.length === 0))
    {
      that.queryPks(tab);
    }
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryPks("");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  



  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
  },
  // viewPk:function (res) {
  //   var pkid = res.currentTarget.dataset.pkid;
  //   wx.navigateTo({
  //     url: '/pages/pk/pk/pk?pkId=' + pkid,
  //   })
  // },
  createPk:function()
  {
    var that = this;
    login.getUser(function(user){
      template.createEditPkDialog(that).show(function (topic,watchWord,invite) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          template.createEditPkDialog(that).hide();
          that.data.pks.push(pk);
          that.setData({pks: that.data.pks})
        })


        httpClient.send(request.url.createPk, "GET",{topic:topic,watchWord:watchWord,invite:invite});
      });

    })
  },
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("approve", function (pk) {

      template.createOperateDialog(that).show("激活相册","今日值班榜主激活相册",function(){
        wx.navigateTo({
          url: '/pages/pk/selectPker/selectPker?pkId=' + pkid,
        })

    },function(){});
    })
    httpClient.addHandler("group", function (pk) {

      template.createOperateDialog(that).show("更新今日审核群","更新今日审核群",function(){
        wx.navigateTo({
          url: '/pages/pk/message/message?pkId=' + pkid,
        })

    },function(){});
    })
    httpClient.addHandler("message", function (pk) {

      template.createOperateDialog(that).show("发布审核公告","发布审核公告",function(){
        wx.navigateTo({
          url: '/pages/pk/messageInfo/messageInfo?pkId=' + pkid ,
        })

    },function(){});
    })
    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

  },
  approverMessageDetail:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    login.getUser(function (user) {

      wx.navigateTo({
        url: '/pages/pk/messageInfo/messageInfo?pkId=' + pkId ,
      })   
    })


  },



})