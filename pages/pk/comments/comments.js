// pages/pk/comments/comments.js
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
    left:100,
    comments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })
    var id = options.id;
    var type = options.type;
    that.setData({
      id:id,
      type:type
    })

    that.queryComments("page",id,type);

  },

  _input:function(res){
    var value = res.detail.value;
    if (value.length > 100) {
      showTip("内容超出长度");
      // return;
    }
    this.setData({
      'text': value,
      'left':100 - value.length
    })
  },
  queryComments:function(tab,id,type)
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.send(request.url.queryComments, "GET", {id:id,type:type});
  },

  onReachBottom:function()
  {
      var that = this;
      if(that.data.pkEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (nextPages) {
        that.setData({
            page:that.data.page + 1,
            comments:that.data.comments.concat(nextPages)
        })
      })
      httpClient.send(request.url.nextCommentPage, "GET",{ id:that.data.id,type:that.data.type ,page:that.data.page});
  
  },

  publish:function()
  {
    var that = this;
 
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (comment) {
      var ncoms = that.data.comments;
      for (var i = ncoms.length-1;i >= 0 ;i--) {
          if (ncoms[i].commentId === comment.commentId) 
          {
            ncoms.splice(i,1);        //执行后aa.length会减一
          }
      }


      ncoms.unshift(comment);
      that.setData({
        comments: ncoms,
        text:""
      })
    })
    httpClient.send(request.url.addComment, "GET",{ id:that.data.id,type:that.data.type ,text: that.data.text,});








  }
  



})