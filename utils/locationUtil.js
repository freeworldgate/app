var request = require('./request.js');
var tip = require('./tipUtil.js');
var redirect = require('./request.js');




var getLocation = (success) => {

  wx.getSetting({
    success: (res) => {
      console.log(JSON.stringify(res))
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //再次授权，调用wx.getLocation的API
                    getWxLocation(success);
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == undefined) {
        //调用wx.getLocation的API
        getWxLocation(success);
      }
      else {
        //调用wx.getLocation的API
        getWxLocation(success);
      }
    }
  })


}

var getWxLocation = (success) => {


    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        success(latitude,longitude);
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })




}



module.exports = { getLocation}