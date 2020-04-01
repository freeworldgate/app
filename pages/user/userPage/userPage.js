// pages/user/userPage/userPage.js
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      login.getUser(function(user){
        that.setData({
          user:user,
        })
        wx.setNavigationBarTitle({
          title: user.userName,
        })

      })
  },
  userOrders:function(){
    var that = this;
    login.getUser(function(user){
      template.createChooseDialog(that).show(request.url.userOrders, { userId: user.userId}, function (order) {
        wx.navigateTo({
          url: "/pages/dynamic/queryOrder/queryOrder?orderId=" + order.orderId
        })
      });






    })
  },
  followInvites:function(){
    var that = this;
    login.getUser(function (user) {
      template.createChooseDialog(that).show(request.url.followInvites, { userId: user.userId }, function (invite) {
        wx.navigateTo({
          url: "/pages/invite/detail/detail?inviteId=" + invite.inviteId
        })
      });
    })
  },
  feeInviteHistory:function(){
    var that = this;
    login.getUser(function (user) {
      template.createChooseDialog(that).show(request.url.feeInviteHistory, { userId: user.userId }, function (invite) {
        wx.navigateTo({
          url: "/pages/invite/detail/detail?inviteId=" + invite.inviteId
        })
      });
    })
  }

})