// pages/pk/pk/pk.js
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
var amapFile = require('./../../../utils/amap-wx.js')



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


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

    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })


    var userId = options.userId;   

    this.setData({
      userId:userId
    })
    login.getUser(function(user){
        that.setData({
          user:user
        })

    })

    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("page", false);
    // var user = wx.getStorageSync("user");
    // httpClient.send(request.url.queryUserCard, "GET", { });
    
  },



  onReachBottom:function(){
    if(!this.data.nomore)
    {
      this.nextPage();
    }
  },
  nextPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    var fromUserId = wx.getStorageSync('fromUser');
    httpClient.addHandler("error", function (tip) {
      template.createOperateDialog(that).show("提示",tip,function(){
        wx.reLaunch({
          url: '/pages/pk/home/home',
        })
    },function(){});
    })
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUserId});  

  },


})