// pages/pk/invite/invite.js
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

    pks: [],

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


    wx.hideShareMenu({
      complete: (res) => {},
    })

    if(that.data.user){that.init("label");}
    else{}
    
  },
  queryPks:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.addHandler("success", function (pks) {
      that.setData({
          pks:pks,
          page:1,
      })
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
    httpClient.send(request.url.queryPrePks, "GET", {type:2});
  },
  onShow:function(){
    var that = this;
    var user = wx.getStorageSync('user');
    if(user && (that.data.pks.length === 0)){that.init("label");}
    else{}
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}
      var user = wx.getStorageSync('user');
      var fromUser = wx.getStorageSync('fromUser')
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.morePrePks, "GET",{ userId:user.userId ,page:that.data.page,type:2});
    
  },

  removePk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除相册","确定删除相册?",function(){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (k) {
        that.data.pks.splice(index, 1); 
        that.setData({
          pks: that.data.pks
        })
      })
      httpClient.send(request.url.removePk , "GET",{pkId:pkid});

    },function(){});
  
  
  },
  addToNonGeneticHome:function(res)
  {


      var that = this;
      var pkid = res.currentTarget.dataset.pkid;
      var index = res.currentTarget.dataset.index;
      template.createEditNumberDialog(that).show("设置非遗传主页优先级", 20,"", function (value) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          that.data.pks.splice(index, 1,pk); 
          that.setData({
            pks: that.data.pks
          })

        })
        httpClient.send(request.url.addToNonGeneticHome, "GET",{pkId:pkid,value:value});

    },function(){});

  },

  addToGeneticHome:function(res)
  {


      var that = this;
      var pkid = res.currentTarget.dataset.pkid;
      var index = res.currentTarget.dataset.index;
      template.createEditNumberDialog(that).show("设置遗传主页优先级", 20,"", function (value) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          that.data.pks.splice(index, 1,pk); 
          that.setData({
            pks: that.data.pks
          })

        })
        httpClient.send(request.url.addToGeneticHome, "GET",{pkId:pkid,value:value});

    },function(){});

  },

  init:function (tab) {
    var that = this;
    that.queryPks(tab);
 
  },
  onPullDownRefresh:function (params) {
      var that = this;
      that.queryPks("label");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login:function(){
    login.getUser(function(user){})    
  },
  createPk:function()
  {
    var that = this;

    template.createEditPkDialog(that).show(function (topic,watchWord,isCharge) {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pk) {
        template.createEditPkDialog(that).hide();
        that.data.pks.push(pk);
        that.setData({pks: that.data.pks})
      })


      httpClient.send(request.url.preCreatePk, "GET",{topic:topic,watchWord:watchWord,isCharge:isCharge,type:2});
    });

  },
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=' + pkid,
    })

  },
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

  },
  approverMessageDetail:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    login.getUser(function (user) {

      wx.navigateTo({
        url: '/pages/pk/messageInfo/messageInfo?pkId=' + pkId ,
      })   
    })


  },
  editMessage:function(res){
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;
    var userId = res.currentTarget.dataset.userid;
    template.createEditImageDialog(that).setDialog("消息", "编辑消息", 1,function(){}, function (text, urls) {
      //上传成功
      wx.hideLoading({
        complete: (res) => {},
      })
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("message", function (message) {
          that.data.pks[index].approveMessage = message;
          that.data.pks.splice(index, 1,that.data.pks[index]); 
          that.setData({
            pks: that.data.pks
          })



      })
      httpClient.send(request.url.publishApproveMessage, "GET",
        {
          userId:userId,
          pkId: pkid,
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

  },

  editApprove:function(res){
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;
    var type = res.currentTarget.dataset.type;
    if(parseInt(type) === 3)
    {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pk) {
        that.data.pks.splice(index, 1,pk); 
        that.setData({
          pks: that.data.pks
        })
      })
      httpClient.send(request.url.setAlbumType, "GET",{pkId:pkid,type:type,value:0});
    }
    else
    {
      template.createEditNumberDialog(that).show("设置次数", 20,"", function (value) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (pk) {
          that.data.pks.splice(index, 1,pk); 
          that.setData({
            pks: that.data.pks
          })
        })
        httpClient.send(request.url.setAlbumType, "GET",{pkId:pkid,type:type,value:value});
  
      },function(){});
  
    }
  }
})