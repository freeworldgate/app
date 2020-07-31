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

        //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })


    wx.hideShareMenu({
      complete: (res) => {},
    })

    if(that.data.user){that.init("label");}
    else{}
    
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
  onShow:function(){
    var that = this;
    var user = wx.getStorageSync('user');
    if(user && (that.data.pks.length === 0)){that.init("label");}
    else{}
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




  init:function (tab) {
    var that = this;
    that.queryPks(tab);
 
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryPks("label");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login:function(){
    login.getUser(function(user){})    
  },
  createPk:function()
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("create", function (tip) {
      template.createOperateDialog(that).show("建榜",tip,function(){


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

      },function(){});


  
    })
    httpClient.send(request.url.checkPk, "GET",{});   


  },
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("approve", function (link) {

      template.createOperateDialog(that).show("激活相册","今日值班榜主激活相册",function(){
        wx.navigateTo({
          url: link,
        })

    },function(){});
    })
    httpClient.addHandler("group", function (link) {

      template.createOperateDialog(that).show("更新今日审核群","更新今日审核群",function(){
        wx.navigateTo({
          url: link,
        })

    },function(){});
    })
    httpClient.addHandler("message", function (link) {

      template.createOperateDialog(that).show("发布审核公告","发布审核公告",function(){
        wx.navigateTo({
          url: link ,
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