// pages/pk/home/home.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var locationUtil = require('./../../../utils/locationUtil.js')
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
    current:0,
    scale:16,
    latitude: 31.9902783203125,
    //经度
    longitude: 118.73781711154514,
    circle:[],
    markers:[],
    includePoints:[],
    //标记点
    // markers: [{
    //   //标记点 id
    //   id: 1,
    //   //标记点纬度
    //   latitude: 32.319739999999985,
    //   //标记点经度
    //   longitude: 120.14209999999999,
    //   name: '行之当前的位置'
    // }],

    


    pks: [],
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.locate();
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
  })

  locationUtil.getLocation(function (latitude,longitude) {
    that.setData({
      latitude:latitude,
      longitude:longitude
    })
    that.queryInvites("page",latitude,longitude);
  });





  },

  chooseLocation:function(){
      wx.chooseLocation({
        success:(res)=>{

              wx.navigateTo({
                url: '/pages/pk/build/build?name='+res.name + "&address="+res.address+"&latitude="+res.latitude+"&longitude="+res.longitude,
              })

        }
      })
  },
  searchLocation:function(){
    var that = this;
    wx.chooseLocation({
      success:(res)=>{
        wx.navigateTo({
          url: '/pages/pk/singleLocation/singleLocation?latitude='+res.latitude+"&longitude="+res.longitude+"&name="+res.name+"&address="+res.address,
        })




      }
    })
},

  






  myInvite:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/invite/invite',
      })

    })


  },
  locate:function(){
    let that = this;
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
                      that.getLocation();
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
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })


  },
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        that.setData({
          latitude : res.latitude -0.003,
          longitude : res.longitude
        })
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  queryInvites:function (tab,latitude,longitude) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    var user = wx.getStorageSync('user');
    httpClient.send(request.url.queryHomePage, "GET", { userId:user.userId,latitude:latitude,longitude:longitude });


  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },







  addPost: function () {

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.addHandler("publishPost", function () {
      template.createOperateDialog(that).show("发布图册", "将要消耗您一个图册", function () {
        that.publishPost();
      }, function () { });
    });
    httpClient.addHandler("free", function () {
      that.publishPost();
    });
    httpClient.send(request.url.addPost, "GET", { pkId: that.data.pkId });
  },

  publishPost: function () {
    var that = this;

    template.createEditImageDialog(that).setDialog("编辑图册", "编辑你想说的话", 9, function () {
      // 发布图册



    }).show();
  },

  showPk:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    template.createShowPkDialog(that).show("","")

  },







  click: function (e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("user");

    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function () {
      login.getUser(function (user) {
        console.log("登录成功:", user);
      });
    });
    httpClient.send(request.url.click, "GET", { userId: user.userId, tab: tab, id: id });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onHide:function(){
    // var that = this;
    // clearInterval(that.data.clock);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var user = wx.getStorageSync('user');
    that.setData({user:user})
    // var that = this;
    // var i = setInterval(function() {
    //   for(var i=0;i<that.data.pks.length;i++)
    //   {
    //     that.data.pks[i].imgs.sort(function(){
    //       return Math.random()-0.5;
    //     });

        
    //     var imgs = "pks[" + i + "].imgs";
    //     that.setData({
    //       [imgs]:that.data.pks[i].imgs
    //     })








    //   }  
      




    // }, 1000)
    // that.data.clock = i;


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function (params) {
    var that = this;
    template.createPageLoadingError(that).hide();
    if(that.data.pageTag)
    {
     
      locationUtil.getLocation(function (latitude,longitude) {
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
        that.queryInvites("label",latitude,longitude);
      });
    }
    else
    {
      locationUtil.getLocation(function (latitude,longitude) {
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
        that.queryInvites("page",latitude,longitude);
      });

    }



},

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var that = this;

  //     if(that.data.pkEnd){return;}
  //     var user = wx.getStorageSync('user');
  //     var fromUser = wx.getStorageSync('fromUser')
  //     var httpClient = template.createHttpClient(that);
  //     httpClient.setMode("label", false);
  //     httpClient.addHandler("success", function (pagePks) {
  //       that.setData({
  //           page:that.data.page + 1,
  //           pks:that.data.pks.concat(pagePks)
  //       })
  //     })
  //     httpClient.send(request.url.nextHomePage, "GET",{ userId:user.userId,fromUser:fromUser ,page:that.data.page});
    
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
  },


  
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.addHandler("group", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
        wx.navigateTo({
          url: link.castV1,
        })

    },function(){});
    })
    
    httpClient.addHandler("unlock", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
        wx.navigateTo({
          url: link.castV1,
        })

    },function(){});
    })
    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },

  showImg:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:imgs[index],
      urls: imgs,
    })


  },
  userCenter:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userPublishPost/userPublishPost?userId='+user.userId,
      })

    })
  },
  changePk:function(res){
    var that = this;

    var current =  res.detail.current;
    var pk = that.data.pks[current];
    console.log("当前PK位置:",location);
    that.setData({
      latitude : pk.latitude - 0.003,
      longitude : pk.longitude,
      circles:[pk.circle],
      scale:16,
      current:current
    })

  },
  // changeCpost:function(res){
  //   var that = this;
  //   var index = res.currentTarget.dataset.index;
  //   var current =  res.detail.current;
  //   var key = "pks["+index+"].current";
  //   that.setData({
  //     [key]:current
  //   })
 
  // },
  // chooseLocation:function(){

  //   wx.chooseLocation({
  //     success:(res)=>{
  //       console.log("选择位置：",res.name,res.address)
  //     },
  //     complete: (res) => {
  //       console.log("选择经纬度：",res.latitude,res.longitude)
        

  //     },
  //   })  
  // },
  seeLocation:function(res){
    var location = res.currentTarget.dataset.location;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
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

})