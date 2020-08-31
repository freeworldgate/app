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
    approvedPosts:[]
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
    httpClient.send(request.url.queryApprovingPost, "GET",{pkId: that.data.pkId});

  },

  approverCommentDetail:function(res){
    wx.setStorageSync('comment',res.currentTarget.dataset.comment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
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
      httpClient.send(request.url.queryMoreApprovingPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId,currentApprovedPage: that.data.currentApprovedPage});
    
  },
  approverComment:function (res) {
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
  },

  approve:function(res)
  {

    var post = res.currentTarget.dataset.post;
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    // httpClient.addHandler("success", function () {
    //   var httpClient = template.createHttpClient(that);
    //   httpClient.setMode("label", true);
    //   httpClient.send(request.url.queryApprovingPost, "GET",{pkId: that.data.pkId});
    // })
    httpClient.send(request.url.doApprove, "GET",{pkId: post.pkId,postId: post.postId}
    );



  },
  reject:function(res)
  {

    var post = res.currentTarget.dataset.post;
    var that = this;

    template.createEditTextDialog(that).show("驳回修改", "编辑修改建议","", 50, function (text) {
      
      // , urls
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.rejectApprove, "GET",{pkId: post.pkId,postId: post.postId,text:text});
  
    });





  }






  

  
})