// pages/pk/userSinglePk/userSinglePk.js
const window = wx.getSystemInfoSync().windowWidth;

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
    img1: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2812%29.jpeg",
    img2: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%285%29.jpeg",
    img3: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%286%29.jpeg",
    img4: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%287%29.jpeg",
    img5: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%288%29.jpeg",
    img6:  "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%289%29.jpeg",
    img7:  "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2810%29.jpeg",
    img8: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2811%29.jpeg",



    pkImgWidth:(window-20)/3,




  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#77bdff',
    })
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

  relaunch:function(){
    wx.reLaunch({
      url: '/pages/pk/zone/zone',
    })

  }
})