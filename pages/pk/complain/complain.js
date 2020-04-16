// pages/pk/complain/complain.js

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
    type:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.nextComplain();




  },


  nextComplain:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.nextComplain, "GET", {type:that.data.type});

  },

  changeType0:function(){
    this.setData({type:0})
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.nextComplain, "GET", {type:0});

  },
  changeType1:function(){
    this.setData({type:1})
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.nextComplain, "GET", {type:1});
  },

  approved:function(res){
    var id = res.currentTarget.dataset.id;
    this.setData({type:1})
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approvedComplain, "GET", {id:id,tag:0});

  },
  noapproved:function(res){
    var id = res.currentTarget.dataset.id;

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approvedComplain, "GET", {id:id,tag:1});
    
  }

})