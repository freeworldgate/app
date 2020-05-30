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
  queryInvites:function (tab) {
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
    httpClient.send(request.url.queryInvites, "GET", {});
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
      httpClient.send(request.url.nextInvitePage, "GET",{ userId:user.userId ,page:that.data.page});
    
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
      that.queryInvites(tab);
    }
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryInvites("");
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
  viewPk:function (res) {
    var pkid = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=' + pkid,
    })




  }
})