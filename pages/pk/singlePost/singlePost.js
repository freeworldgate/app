// pages/pk/singlePost/singlePost.js
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
    img6: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%289%29.jpeg",
    img7: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2810%29.jpeg",
    img8: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2811%29.jpeg",



    pks: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#09cc71',
    })
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    var user = wx.getStorageSync("user");
    httpClient.send(request.url.queryPost, "GET", { postId: options.postId, userId: user.userId });



  },
 
})