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
    var pk = res.currentTarget.dataset.pk;
    template.createOperateDialog(that).show("审核通过", "确定审核通过?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.approvePost, "GET", {pkId:pk.pkId,postId:post.postId});
    }, function () { });






  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })

  },
    groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/message/message?pkId=' + pkId + "&type=1",
    })

  },
  hiddenPost:function (res) {
    var that = this;
    var post = res.currentTarget.dataset.post;
    var pk = res.currentTarget.dataset.pk;

    template.createOperateDialog(that).show("驳回", "确定驳回榜帖吗?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.hiddenPost, "GET", {pkId:pk.pkId,postId:post.postId,text:'请按照审核样例要求编辑榜帖'});
    }, function () { });



  },
  rejectPost:function (res) {
    var that = this;
    var post = res.currentTarget.dataset.post;
    var pk = res.currentTarget.dataset.pk;

    template.createEditTextDialog(that).show("驳回修改", "编辑修改建议","", 50, function (text) {
      
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.hiddenPost, "GET", {pkId:pk.pkId,postId:post.postId,text:text});
  
    });






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

  viewPk:function(res)
  {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=' + pkId,
    })

  },




})