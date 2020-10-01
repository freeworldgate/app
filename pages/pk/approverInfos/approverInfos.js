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
    that.data.approverUserId = options.approverUserId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApprovedPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId});





  },

  changeTag0:function(){
    this.setData({currentIndex:0,tag:0})
  },
  changeTag1:function(){
    var that = this;
    if(that.data.approvingPosts){
      that.setData({currentIndex:0,tag:1})
      return;
    }

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.queryApprovingPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId});
  

  },
  changeApprovedPost:function(res){
    
    console.log(res);
    var that = this;
    if(!that.data.approvedPosts){return;}
    if(that.data.approvedPosts.length===0){return;}
    var index = res.detail.current;
    that.setData({
      currentApprovedPost:that.data.approvedPosts[index],
      currentIndex:index,
    })
    
    if(that.data.approvedPosts.length - index >3){return;}
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
  changeApprovingPost:function(res){
    console.log(res);
    var that = this;
    if(!that.data.approvingPosts){return;}
    if(that.data.approvingPosts.length===0){return;}
    var index = res.detail.current;
    that.setData({
      currentApprovingPost:that.data.approvingPosts[index],
      currentIndex:index,
    })
    if(that.data.approvingPosts.length - index > 3 || that.data.approvingPosts.length < 10){return;}
    if(that.data.approvingEnd){return;}

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (posts) {
      that.setData({
          currentApprovingPage:that.data.currentApprovingPage + 1,
          approvingPosts:that.data.approvingPosts.concat(posts)
      })
    })
    httpClient.send(request.url.queryMoreApprovingPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId,currentApprovingPage: that.data.currentApprovingPage});
  


  },
  onReachBottom:function () {
    var that = this;
    if(that.data.tag === 0)
    {
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
    
    }
    else
    {
      if(that.data.approvingEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (posts) {
        that.setData({
            currentApprovingPage:that.data.currentApprovingPage + 1,
            approvingPosts:that.data.approvingPosts.concat(posts)
        })
      })
      httpClient.send(request.url.queryMoreApprovingPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId,currentApprovingPage: that.data.currentApprovingPage});
    
  



    }





  },


  approverComment:function (res) {
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
  },




  complain:function (params) {
      var that = this;  
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.complain, "GET",{pkId: that.data.pkId, approverUserId: that.data.approver.user.userId});

  },



  playVoice:function (res) {
    var that = this;
    if(that.data.viewStatu === 1){return;}
    var voiceUrl = res.currentTarget.dataset.voiceurl;
    var speck_time = res.currentTarget.dataset.specktime;
   
    template.createPlayVoiceDialog(that).play(voiceUrl,speck_time);
  },
  startVoice:function() {
    var that = this;
    that.data.viewStatu = 1;
    template.createVoiceDialog(that).start();
  
  },
  endVoice:function (params) {
    var that = this;
    if(that.data.viewStatu != 1){return;}
    template.createVoiceDialog(that).stop(function(speck_time,file) {
      
      template.uploadVoice("MP4", speck_time,file,that, function (fileUrl) {
  
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (approveMessage) {
          that.setData({
            'approver.approveMessage':approveMessage,
          })
  
      })
        httpClient.send(request.url.setApproverVoice, "GET",{pkId: that.data.pkId,approvorId:that.data.approver.user.userId,fileUrl:fileUrl,speckTime:speck_time})
  
      }, function(params) {
      });




    })
    setTimeout(function name(params) {
      that.data.viewStatu = 0;
    },1000)

  
  
  
  },
  cancelVoice:function(params) {
    var that = this;
    template.createVoiceDialog(that).cancel(function () {
      tip.showContentTip("取消发送");
    });
  },
  
  

  
})