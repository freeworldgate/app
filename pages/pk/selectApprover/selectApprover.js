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
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.pkId = options.pkId;
    that.data.postId = options.postId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApproveInfo1, "GET", { pkId: that.data.pkId ,postId:that.data.postId  });


  },

  changeApprover:function(res){
    console.log(res);
    var that = this;
    var index = res.detail.current;
    that.setData({
      currentApprover:that.data.approveUserList[index],
    })



  },
  selectApprove:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.setApproveInfo, "GET", { pkId: that.data.pkId,approvorId:that.data.currentApprover.user.userId  });

  },
  setComment:function(){
    var that = this;
    template.createEditImageDialog(that).setDialog("留言", "编辑留言", 1, function () {

    }, function (text, urls) {
      //上传成功

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (post) {


      })
      httpClient.send(request.url.setComment, "GET",
        {
          pkId: that.data.pkId,
          approvorId:that.data.currentApprover.user.userId,
          text: text,
          imgUrl: urls[0],
        }
      );

    }, function () {
      //上传失败

    }).show();



  },
  
  setUser:function(res){
    var userId = res.currentTarget.dataset.user;

    var user = wx.getStorageSync('user');
    user.userId = userId;
    wx.setStorageSync('user', user);
    wx.reLaunch({
      url: '/pages/pk/selectApprover/selectApprover',
    })

  },

  onShareAppMessage:function(){
    var that = this;
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.setApprover, "GET",{pkId: that.data.pkId,postId: that.data.postId,approveUserId:that.data.currentApprover.user.userId})

    return {
      title: '审核相册' +  "@" + that.data.currentApprover.user.userId + '',
      desc: "@" + that.data.currentApprover.user.userName + '',
      imageUrl:that.data.currentApprover.user.imgUrl,
      path: '/pages/pk/approver/approver?pkId=' + that.data.pkId + "&postId=" + that.data.postId + "&approveUserId=" + that.data.currentApprover.user.userId,
    }


  },


  agree:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approve, "GET",{pkId: that.data.pkId,postId: that.data.postId,tag:1}
    );


  },
  disagree:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approve, "GET",{pkId: that.data.pkId,postId: that.data.postId,tag:2}
    );
  }

})