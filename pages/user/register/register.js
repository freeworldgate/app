// pages/register/register.js
var http = require('./../../../utils/http.js')
var request = require('./../../../utils/request.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var invite = require('./../../../utils/invite.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userId: '',
    imgUrl:"",
    userName:"",
    userTel:"",
    userAge:0,
    userJob:{},
    userCity:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        userId:options.userId,
        imgUrl: options.imgUrl,
        userName: options.userName,
      });
  },

  validate: function () {


  },
  //确定
  confirm:function(){

      var that = this;
      wx.showLoading({
          title: '请求中...',
      })
      var httpClient = http.createSubmit(request.url.userRegister, "POST");
      httpClient.setParam("userId", that.data.userId);
      httpClient.setParam("imgUrl", that.data.imgUrl);
      httpClient.setParam("userName", that.data.userName);
      httpClient.setParam("userTel", that.data.userTel);
      httpClient.setParam("userAge", that.data.userAge);
      httpClient.setParam("userJobCode", that.data.userJob.code);
      httpClient.setParam("userJobName", that.data.userJob.name);  
      httpClient.setParam("userCityCode", that.data.userCity.code);
      httpClient.setParam("userCityName", that.data.userCity.name);   
      httpClient.setParam("appName", request.appinfo.appName);   
      var isFromShare = wx.getStorageSync("isFromShare");
      if (isFromShare === 1){
        httpClient.setParam("isFromShare", 1)
      }
      else{
        httpClient.setParam("isFromShare", 0)
      }


      httpClient.setSuccess(function (data) {
            wx.setStorageSync("user", data);
            invite.inviteHistory(data.userId, wx.getStorageSync("from-inviteId"), wx.getStorageSync("from-fromUser"));
            wx.navigateBack({})
            
      });
      httpClient.setError(function () {
        tip.showContentTip("修改失败...");
      });
      httpClient.setComplet(function () {
        wx.hideLoading();
      });
      httpClient.submit();


  },
  
  




})