// pages/pk/approverInfos/approverInfos.js
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
    tag:0,
    approvingEnd:false,
    approvedEnd:false
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



   
    that.data.pkId = options.pkId;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApprovedPost, "GET",{pkId: that.data.pkId});

  },



  onReachBottom:function () {
    var that = this;

      if(that.data.approvedEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (posts) {
        that.setData({
            currentApprovedPage:that.data.currentApprovedPage + 1,
            approvedPosts:that.data.approvedPosts.concat(posts)
        })
      })
      httpClient.send(request.url.queryMoreApprovedPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId,currentApprovedPage: that.data.currentApprovedPage});
    
  },
  approverComment:function (res) {
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
  },





  

  
})