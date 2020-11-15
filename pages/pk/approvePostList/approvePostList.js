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
    httpClient.send(request.url.queryApprovedPost, "GET",{pkId: that.data.pkId, type:0});

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
      httpClient.send(request.url.queryMoreApprovedPost, "GET",{pkId: that.data.pkId,page:that.data.page, type:0});
    
  },
  approverComment:function (res) {
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
  },


  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},


  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })


  },  

  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style ,
    })

  },
})