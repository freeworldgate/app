// pages/pk/message/message.js
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




    that.setData({
      pkId:options.pkId
    })

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryGroupCode, "GET",{pkId: that.data.pkId});


  },



  onUnload:function (params) {
    // if(this.data.creator.userId === this.data.user.userId){
    //   wx.setStorageSync('isApprove', 1)
    // }
  },

  uploadGroupCode:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        // var files = new Array();
        // files.concat(res.tempFilePaths);
        var files = res.tempFilePaths;
        template.uploadImages3("GROUPCODE", files,that, function(urls){

            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.send(request.url.uploadGroupCode, "GET",{pkId: that.data.pkId,url:urls[0]});

        }, function(){});


      },
    })



  }

})