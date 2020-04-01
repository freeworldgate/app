// pages/login/login.js
var request = require('./../../../utils/request.js')
var redirect = require('./../../../utils/redirect.js')
var tip = require('./../../../utils/tipUtil.js')
var invite = require('./../../../utils/invite.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  back: function () {
    wx.navigateBack({})
  },

  login: function (res) {
    tip.showLoading('登陆中...');
    var fromUser = wx.getStorageSync("fromUser");
    wx.request({
      //  注册用户地址
      method: "GET",
      url: request.url.loginUrl,
      data: { 
          code: this.data.code,
          encryptedData: res.detail.encryptedData, 
          iv: res.detail.iv,
          appName:request.appinfo.appName,
          fromUser:fromUser
      }, 
      success: (response) => {
          wx.hideLoading();
        if (response.data.code == request.value.success) {
            wx.setStorageSync("user", response.data.data);
            redirect.goBack();
            invite.inviteHistory(response.data.data.userId, wx.getStorageSync("from-inviteId"), wx.getStorageSync("from-fromUser"));
            tip.showTip("登陆成功...");
            return;
          }
          // 不存在该用户
        if (response.data.code == request.value.nouser){
        
            redirect.goTo('/pages/user/register/register?userId=' + response.data.data.userId)
            return;
          }
          redirect.goBack();
          tip.showContentTip("登录失败","服务器异常");
      },
      fail: function () {
        wx.hideLoading();
        redirect.goBack();
        tip.showContentTip("登录失败", "网络异常");
      }
    })
  },





  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }








})