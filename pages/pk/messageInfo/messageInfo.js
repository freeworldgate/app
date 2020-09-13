// pages/pk/messageInfo/messageInfo.js
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
    inviteReq.getHeight(function (res) {
      that.setData({
        top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })




    this.setData({
      pkId:options.pkId,
    })
    this.queryApproverMessage();
  },

  queryApproverMessage:function() {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApproveMessage, "GET",{pkId: that.data.pkId});






  },
  saveImg:function (res) {

    var imgSrc = res.currentTarget.dataset.url;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })





  },
  back:function(){
      wx.navigateBack({
        complete: (res) => {},
      })
  },
  approverMessage:function(){
    var that = this;
    
    if(that.data.user.userId != that.data.creator.userId){
      return ;
    }

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      
      template.createEditImageDialog(that).setDialog("编辑图贴样例", "编辑样例内容", 1,function(){}, function (text, urls) {
        //上传成功
        wx.hideLoading({
          complete: (res) => {},
        })
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("message", function (message) {
            that.setData({
              'message':message,
            })
            wx.setStorageSync('myMessage', message)
  
        })
        httpClient.send(request.url.publishApproveMessage, "GET",
          {
            pkId: that.data.pkId,
            text: text,
            imgUrl: urls[0],
          }
        );
  
      }, function () {
        //上传失败
        wx.hideLoading({
          complete: (res) => {},
        })
      }).show();

    })
    httpClient.send(request.url.canEditApproveMessage, "GET",
      {
        pkId: that.data.pkId,
      }
    );








  },

  







})