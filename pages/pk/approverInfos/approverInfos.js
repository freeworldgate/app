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
    tag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    that.data.pkId = options.pkId;
    that.data.approverUserId = options.approverUserId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApprovedPost, "GET",{pkId: that.data.pkId, approverUserId: that.data.approverUserId});
  },

  changeTag0:function(){
    this.setData({tag:0})
  },
  changeTag1:function(){
    this.setData({tag:1})
  },
  changePost:function(res){
    console.log(res);
    var that = this;
    var index = res.detail.current;
    that.setData({
      currentPost:that.data.approvedPosts[index],
    })
  }

})