// pages/pk/home/home.js
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
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
  })
  that.queryInvites();






  },
  queryInvites:function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.send(request.url.queryPreHomePage, "GET", {  });


  },



  publishPost: function () {
    var that = this;

    template.createEditImageDialog(that).setDialog("编辑榜帖", "编辑你想说的话", 9, function () {
      // 发布榜帖



    }).show();
  },









  click: function (e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("user");

    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function () {
      login.getUser(function (user) {
        console.log("登录成功:", user);
      });
    });
    httpClient.send(request.url.click, "GET", { userId: user.userId, tab: tab, id: id });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function (params) {
    var that = this;
    that.queryInvites("");
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
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.morePreHomePage, "GET",{ page:that.data.page});
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  removePk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("移除首页","确定移除首页?",function(){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (k) {
        that.data.pks.splice(index, 1); 
        that.setData({
          pks: that.data.pks
        })
      })
      httpClient.send(request.url.removePkFromHomPage , "GET",{pkId:pkid});

    },function(){});
  
  
  },



  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
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

  editApprove:function(res){
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;
    var type = res.currentTarget.dataset.type;
    template.createEditNumberDialog(that).show("设置次数", 20,"", function (value) {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pk) {
        that.data.pks.splice(index, 1,pk); 
        that.setData({
          pks: that.data.pks
        })
      })
      httpClient.send(request.url.setAlbumType, "GET",{pkId:pkid,type:type,value:value});

  },function(){});

  },


})