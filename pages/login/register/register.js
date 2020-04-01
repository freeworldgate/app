// pages/register/register.js
var request = require('./../../../utils/request.js')
var redirect = require('./../../../utils/redirect.js')
var tip = require('./../../../utils/tipUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    encryptedData: '',
    iv: '' ,
    userTel:'',
    vCode:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        code: options.code,
        encryptedData: options.encryptedData,
        iv: options.iv 
      });
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


  register:function(res){
      if (this.data.vCode.length != 4) { tip.showContentTip("输入4位验证码"); return; }

      tip.showLoading("注册中...");
      console.log("userTel = " + this.data.userTel);
      console.log("vCode = " + this.data.vCode);
      wx.request({
          method: 'GET',
          url: request.url.userRegister,
          data:{
             userId:wx.getStorageSync("userId"),
             userTel:this.data.userTel,
             vCode:this.data.vCode,
          },
        success: function (response){
            wx.hideLoading();
            if (response.data.code == request.value.success) {
              wx.setStorageSync("userTel",response.data.data.userTel);
              redirect.goBackPage(2);
              tip.showTip("注册成功");
              return;
            }
            if (response.data.code == request.value.wrongVCode) {
               tip.showContentTip("验证码错误");
               return;
            } 
            tip.showContentTip("服务异常");
          },
          fail:function(){
            wx.hideLoading();
            tip.showContentTip("网络异常");
          }      
      })
  },

  inputUserTel:function(e)
  {
      this.setData({
        userTel: e.detail.value
      })
  },

  inputVCode: function (e) {
      this.setData({
        vCode: e.detail.value
      })
  },



  getVCode:function(){
    if (this.data.userTel.length < 10) { tip.showContentTip("输入手机号码");return;}


      tip.showLoading('发送验证码');
      wx.request({
          method: 'GET',
          url: request.url.getVCode,
          data: {
            userTel: this.data.userTel,
          },
        success: function (response) {
          wx.hideLoading();
          if (response.data.code == request.value.success) {
              tip.showContentTip("验证码已发送")
              return;
          }
          tip.showContentTip("验证码发送失败");
        },
        fail: function () {
          wx.hideLoading();
          tip.showContentTip("网络异常");
        }   
      })



  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})