// pages/pk/commentInfo/commentInfo.js
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



    login.getUser(function (user) {
        var comment = wx.getStorageSync('comment');
        wx.removeStorageSync('comment')
        that.setData({
            message:comment,
            user:user
        })
    })

    


  },

  viewImg:function(res)
  {

    var url = res.currentTarget.dataset.url;
    var user = res.currentTarget.dataset.user;
    var commentor = res.currentTarget.dataset.commentor;
    var creator = res.currentTarget.dataset.creator;
    if(user.userId === creator.userId || user.userId === commentor.userId)
    {
      wx.previewImage({
        urls: [url],
      })
    }


  },
  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},
  approverComment:function () {
    


      var that = this;

  
    
      template.createEditImageDialog(that).setDialog("留言", "编辑留言", 1,function(){}, function (text, urls) {
        //上传成功
        wx.hideLoading({
          complete: (res) => {},
        })
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("message", function (approveComment) {
   
            that.setData({
              message:approveComment,
            })
            wx.setStorageSync('pkComment', approveComment)
  
  
  
        })
        httpClient.send(request.url.setComment, "GET",
          {
            pkId: that.data.message.pkId,
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
  
  
  




  }




})