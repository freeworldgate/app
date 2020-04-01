// pages/user/identificate/identificate.js
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
    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", true);
    httpClient.send(request.url.currentInvite, "GET", {});
  },

})