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
    hasInivte:false,
    tt1:'驳回修改'
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
    that.data.fromUser = options.fromUser;
    wx.setStorageSync('fromUser', options.fromUser)
    var httpClient = template.createHttpClient(that);
    var user = wx.getStorageSync('user');
    httpClient.setMode("page", false);
    // httpClient.send(request.url.queryApproveInfo, "GET", { pkId: this.data.pkId  });
    httpClient.send(request.url.queryApproveInfo3, "GET", { pkId: that.data.pkId ,postId:that.data.postId,userId:user.userId,fromUser:that.data.fromUser  });


  },

  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},
  
  approverComment:function(){

      wx.setStorageSync('comment', this.data.userPost.approveComment)
      wx.navigateTo({
        url: '/pages/pk/commentInfo/commentInfo',
      })
  },

  approverCommentDetail:function(){
    var that = this;
    login.getUser(function (user) {
      wx.setStorageSync('comment', that.data.pkComment)
      wx.navigateTo({
        url: '/pages/pk/commentInfo/commentInfo',
      })  
    })

  },
  addInvite:function(pkId){
    var that = this;
    var user = wx.getStorageSync('user');
    if(user && (!that.data.hasInivte) )
    {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);
      httpClient.send(request.url.addUserInvite, "GET", { pkId: pkId, userId: user.userId});
    }
  
},

  agree:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approve, "GET",{pkId: that.data.pkId,postId: that.data.postId}
    );


  },
  setComment:function(){
    var that = this;
    template.createEditImageDialog(that).setDialog("留言", "编辑留言", 1, function () {

    }, function (text, urls) {
      //上传成功

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);

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
    var that = this;
    that.addInvite(that.data.pkId ,that.data.fromUser );
  },

  playVoice:function (res) {
    var that = this;
    var voiceUrl = res.currentTarget.dataset.voiceurl;
    var speck_time = res.currentTarget.dataset.specktime;
    template.createPlayVoiceDialog(that).play(voiceUrl,speck_time);
  },
  relaunch:function (params) {
    wx.reLaunch({
      url: '/pages/pk/home/home',
    })
  },
  reject:function(res)
  {

    var post = res.currentTarget.dataset.post;
    var that = this;

    template.createEditTextDialog(that).show("驳回修改", "编辑修改建议","", 200, function (text) {
      
      // , urls
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.rejectApprovingPost, "GET",{pkId: post.pkId,postId: post.postId,text:text});
  
    });





  }
  
})