// pages/pk/userSinglePost/userSinglePost.js
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



    publish:'off',
    pks: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#09cc71',
    // })
    wx.hideShareMenu({})
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    var user = wx.getStorageSync("user");
    httpClient.send(request.url.queryPost, "GET", { postId: options.postId, userId: user.userId });
  },
  
  uploadFront: function () {
    var that = this;
    login.getUser(function (user) {
      that.setData({ user: user })
      template.createEditImageDialog(that).setDialog("编辑榜帖", "编辑你想说的话", 9, function () {
        console.log("-------------confirm------------");
        that.setData({
          publish: "on"
        })
      }, function (text, urls) {
        //上传成功
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);

        httpClient.send(request.url.uploadFront, "GET",
          {
            postId: that.data.detail.postId,
            title: text,
            imgUrls: urls,
          }
        );
        that.setData({
          publish: "off"
        })
      }, function () {
        //上传失败
        that.setData({
          publish: "off"
        })
      }).show();


    })

  },

  removeImg:function(res){
    var index = parseInt(res.currentTarget.dataset.index);
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.send(request.url.deleteImg, "GET", { postId: that.data.detail.postId,index:index });

  },
  showImg:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var current = res.currentTarget.dataset.current;
    var imgUrls = [];
    for (var i = 0; i < imgs.length; i++) {
      var singleImgUrl = imgs[i].imgUrl;
      imgUrls.push(singleImgUrl);
    }


    wx.previewImage({
      current: current,
      urls: imgUrls,

    })



  }



})