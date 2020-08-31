// pages/pk/selectApprover/selectApprover.js
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



    that.data.pkId = options.pkId;
    that.data.postId = options.postId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApproveInfo2, "GET", { pkId: that.data.pkId ,postId:that.data.postId  });


  },

  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},

  approverCommentDetail:function(){
    wx.setStorageSync('comment', this.data.pkComment)
    wx.navigateTo({
      url: '/pages/pk/commentInfo/commentInfo',
    })
  },
 


  approverComment:function(){
    var that = this;
    template.createEditImageDialog(that).setDialog(that.data.t3,that.data.t4, 1, function () {

    }, function (text, urls) {
      //上传成功

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("message", function (approveComment) {
     
          that.setData({pkComment:approveComment})


      })
      httpClient.send(request.url.setComment, "GET",
        {
          pkId: that.data.pkId,
          text: text,
          imgUrl: urls[0],
        }
      );

    }, function () {
      //上传失败

    }).show();



  },
  onShow:function () {
    var pkComment = wx.getStorageSync('pkComment');
    if(pkComment){
      wx.removeStorageSync('pkComment');
      this.setData({pkComment:pkComment})
    
    }

  },

  playVoice:function (res) {
    var that = this;
    var voiceUrl = res.currentTarget.dataset.voiceurl;
    var speck_time = res.currentTarget.dataset.specktime;
    template.createPlayVoiceDialog(that).play(voiceUrl,speck_time);
  },

  onShareAppMessage:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.setApprover, "GET",{pkId: that.data.pkId,postId: that.data.postId})

    return {
      title: that.data.t5 +  "@" + that.data.creator.userName ,
      desc: "from" + that.data.userPost.creator.userName + '',
      imageUrl:that.data.userPost.creator.imgUrl,
      path: '/pages/pk/approver/approver?pkId=' + that.data.pkId + "&postId=" + that.data.userPost.postId + "&fromUser=" + that.data.user.userId ,
      
    }
    


  },
  approvePost:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.setApprover, "GET",{pkId: that.data.pkId,postId: that.data.postId})


  

  },
  
})