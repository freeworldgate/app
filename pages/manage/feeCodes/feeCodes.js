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
    httpClient.send(request.url.allFeeCodes, "GET", {});
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
})