// pages/pk/home/home.js
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


    pkId: "PK01",

    img1: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2812%29.jpeg",
    img2: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%285%29.jpeg",
    img3: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%286%29.jpeg",
    img4: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%287%29.jpeg",
    img5: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%288%29.jpeg",
    img6: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%289%29.jpeg",
    img7: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2810%29.jpeg",
    img8: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2811%29.jpeg",

    pks: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    albums: ["https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%289%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2810%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%285%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%286%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%287%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%288%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%289%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2810%29.jpeg", "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2811%29.jpeg"]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#65b3fc',
    })
    var sessionId = uuid.uuid();
    var that = this;
    var user = wx.getStorageSync("user");
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    httpClient.send(request.url.zoneRefresh, "GET", { userId: user.userId, pkId: that.data.pkId, page: 1, sessionId: sessionId });

  },

  addPost: function () {

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("pay", function () {
      template.createOperateDialog(that).show("购买榜帖", "购买榜帖", function () {
        wx.navigateTo({
          url: '/pages/pk/cashiers/cashiers?pkId=' + that.data.pkId,
        })
      }, function () { });
    });
    httpClient.addHandler("publishPost", function () {
      template.createOperateDialog(that).show("发布榜帖", "将要消耗您一个榜帖", function () {
        that.publishPost();
      }, function () { });
    });
    httpClient.addHandler("free", function () {
      that.publishPost();
    });


    httpClient.send(request.url.addPost, "GET", { pkId: that.data.pkId });
  },

  publishPost: function () {
    var that = this;

    template.createEditImageDialog(that).setDialog("编辑榜帖", "编辑你想说的话", 9, function () {
      // 发布榜帖



    }).show();
  },









  click: function (e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("user");

    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function () {
      login.getUser(function (user) {
        console.log("登录成功:", user);
      });
    });
    httpClient.send(request.url.click, "GET", { userId: user.userId, tab: tab, id: id });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }






})