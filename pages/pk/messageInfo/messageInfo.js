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


  approverMessage:function(){
    var that = this;
    
    if(that.data.user.userId != that.data.creator.userId){
      return ;
    }

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
      
      template.createEditImageDialog(that).setDialog("消息", "编辑消息", 1,function(){}, function (text, urls) {
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
  playVoice:function (res) {
    var that = this;
    var voiceUrl = res.currentTarget.dataset.voiceurl;
    var speck_time = res.currentTarget.dataset.specktime;
    template.createPlayVoiceDialog(that).play(voiceUrl,speck_time);
  }
  







})