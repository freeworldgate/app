// pages/test/template/template.js
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
var page = require('./../../../template/pageUtil.js')



Page({


  data: {},

  onLoad: function (options) {
 
  },

  dialog0: function () {
    wx.navigateTo({
      url: '/pages/test/template/template',
    })
  },

  dialog1: function () 
  {
    wx.navigateTo({
      url: '/pages/location/locationRankList/locationRankList',
    })
  },
  dialog2: function () 
  {
    wx.navigateTo({
      url: '/pages/location/selectLocation/selectLocation',
    })
    // page.openSharers("分享主体ID");
  },
  dialog3: function () 
  {
    wx.navigateTo({
      url: '/pages/location/locationInviteList/locationInviteList',
    })
  },

  dialog4: function () {
    wx.navigateTo({
      url: '/pages/location/detail/detail',
    })
  },
  dialog5: function () {
      page.openViewers("主体ID");
  },
  dialog6: function () {
      page.openSharers("主体ID");
  },
  dialog7: function () {
      page.openComplimentors("主体ID");
  },
  dialog8: function () {
    wx.navigateTo({
      url: '/pages/invite/list/list',
    })
  },
  dialog9: function () {
    
    wx.navigateTo({
      url: '/pages/invite/detail3/detail3',
    })
  },

  dialog10: function () {
    
    wx.navigateTo({
      url: '/pages/invite/list/list',
    })

  },
  dialog11: function () {
    wx.navigateTo({
      url: '/pages/invite/create/create',
    })
  },



  dialog13: function () {
    wx.navigateTo({
      url: '/pages/invite/schoolInvite/schoolInvite',
    })

  },

  dialog15: function () {
 
  },
  dialog16: function () {

  },
  dialog17: function () {

  },
  dialog18: function () {
  },

  dialog19: function () {
  },
  dialog20: function () {
  },
  dialog21: function () {
  },



  //---------------------------------------------------------------------------------------------
  dialog22: function () {

  },

  dialog23: function () {

  },
  dialog24: function () {

  },
  dialog25: function () {
  },
  dialog26: function () {


  },






























})