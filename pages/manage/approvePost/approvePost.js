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











Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.manageApprovingPosts, "GET", {});

  },

  approvePost:function (res) {

    var that = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
 
          that.data.posts.splice(index, 1); 
          that.setData({
            posts: that.data.posts
          })


    })
    httpClient.send(request.url.approvePost, "GET", {pkId:post.pk.pkId,postId:post.post.postId});


  },
  hiddenPost:function (res) {
    var that = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function () {
   
        that.data.posts.splice(index, 1); 
        that.setData({
          posts:that.data.posts
        })
      

  })
    httpClient.send(request.url.hiddenPost, "GET", {pkId:post.pk.pkId,postId:post.post.postId});




  },


  



  onPullDownRefresh:function(){
    this.refreshPage();
  },

  refreshPage: function () {
    var that = this;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.manageApprovingPosts, "GET", {});

  },






})