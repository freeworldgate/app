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
var amapFile = require('./../../../utils/amap-wx.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftPks:0,
    unlock:0,
    pkTimes:0,
    inviteTimes:0,
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

    if(that.data.user){that.init("page");}
    else{}
    
  },
  queryPks:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    // httpClient.addHandler("success", function (pks) {
    //   that.setData({
    //       pks:pks,
    //       page:1,
    //   })
    //   wx.stopPullDownRefresh({
    //     complete: (res) => {},
    //   })
    // })
    httpClient.send(request.url.userPks, "GET", {});
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
      httpClient.send(request.url.nextUserPks, "GET",{ userId:user.userId ,page:that.data.page});
    
  },





  onShow:function () {
    var that = this;

    var user = wx.getStorageSync('user');
    if(user && !that.data.pageTag){
      that.setData({user:user});
      that.queryPks("page");
    }

  },

  init:function (tab) {
    var that = this;
    var user = wx.getStorageSync('user');
    if(user){
      that.setData({user:user})
    }
    if(user &&  !that.data.pageTag)
    {
      that.queryPks(tab);
    }
  },
  onPullDownRefresh:function (params) {
      var that = this;
      
      var that = this;
      if(that.data.pageTag){that.queryPks("label");}else{that.queryPks("page");}
      
  },











  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },
  login:function(){
    login.getUser(function(user){})    
  },
  createPk:function()
  {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("create", function (tip) {
      template.createOperateDialog(that).show(tip.castV2,tip.castV3,function(){


          template.createEditPkDialog(that).show(function (topic,watchWord,invite) {
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (pk) {
              // template.createEditPkDialog(that).hide();
              that.data.pks.unshift(pk);
              that.setData({pks: that.data.pks})
            })
    
    
            httpClient.send(request.url.createPk, "GET",{topic:topic,watchWord:watchWord,invite:invite});
          });

      },function(){});


  
    })
    httpClient.send(request.url.checkPk, "GET",{});   


  },

  updatePkPage:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index =  res.currentTarget.dataset.index;

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        // var files = new Array();
        // files.concat(res.tempFilePaths);
        var files = res.tempFilePaths;
        template.uploadImages3("PK-Back", files,that, function(urls){

          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function (pk) {
            // template.createUpdatePkDialog(that).hide();
            that.data.pks.splice(index, 1,pk); 
            that.setData({
              pks: that.data.pks
            })
            
          })
    
    
          httpClient.send(request.url.updatePkPage, "GET",{imgUrl:urls[0],pkId:pkid});
        }, function(){});


      },
    })




  },


  updatePk:function(res){
    
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index =  res.currentTarget.dataset.index;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createUpdatePkDialog(that).show(topic,watchword, function (topic,watchWord) {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pk) {
        // template.createUpdatePkDialog(that).hide();
        that.data.pks.splice(index, 1,pk); 
        that.setData({
          pks: that.data.pks
        })
        
      })


      httpClient.send(request.url.updatePk, "GET",{topic:topic,watchWord:watchWord,pkId:pkid});
    });



  },


  showPk:function(res){
    var that = this;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createShowPkDialog(that).show(topic,watchword)

  },
  
  viewPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var index =  res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("approve", function (link) {

        template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
          wx.navigateTo({
            url: link.castV1,
          })

      },function(){});
    })
    
    httpClient.addHandler("doApprove", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
          //发布主题:
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.send(request.url.publishPk, "GET",{pkId:pkid});  
          wx.setStorageSync('update', true);

    },function(){});
  })


    httpClient.addHandler("group", function (link) {

        template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
          wx.navigateTo({
            url: link.castV1,
          })
      },function(){});
    })
    httpClient.addHandler("message", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
        that.approverMessage(pkid,index);

    },function(){});
    })
    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },
  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/message/message?pkId='+pkId,
    })
    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", true);
    // httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

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



  deletePk:function(res)
  {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid; 
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("删主题","确定删除?",function(){

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
        that.data.pks.splice(index, 1); 
        that.setData({
          pks: that.data.pks
        })
      })


      httpClient.send(request.url.deletePk, "GET",{pkId:pkId});  
  },function(){});









  },
  setPkCode:function()
  {
    var that = this;
    template.createEditNumberDialog(that).show("输入Code", 20,"", function (value) {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.setPkCode, "GET",{value:value});
    })




  }

  ,
  approverMessage:function(pkId,index){
    var that = this;

      
      template.createEditImageDialog(that).setDialog("消息", "编辑消息", 1,function(){}, function (text, urls) {
        //上传成功
        wx.hideLoading({
          complete: (res) => {},
        })
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("message", function (message) {
          var msg = "pks[" + index + "].approveMessage"
          that.setData({
            [msg]: message
          })
          that.init("");





  
        })
        httpClient.send(request.url.publishApproveMessage, "GET",
          {
            pkId: pkId,
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
  buildSample:function(){
    var that = this;
    template.createOperateDialog(that).show("制作样例","请根据您的主题选择9张图片制作图册封面",function(){
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'],
        success(files) {
          if(files.tempFilePaths.length != 9){
            template.createDialog(that).show("选择错误", "请选择9张图片制作样例...");
            return;
          }


          var imgs = new Array();
          for(var i=0;i<9;i++)
          {
            that.imageInfo(imgs,files.tempFilePaths[i]);

          }


          
  
        },
      })
    
  },function(){});




  },

  imageInfo:function(imgs,url){

    wx.getImageInfo({
      src:url,
      success:function(res){
        
        var imgW = res.width;
        var imgH = res.height;
        var x = imgW>imgH?(imgW-imgH)/2:0;
        var y = imgW>imgH?0:(imgH-imgW)/2;
        var size = imgW>imgH?imgH:imgW;
        var img = {x:x,y:y,size:size,url:url};
        imgs.push(img);
        if(imgs.length === 9){
          wx.setStorageSync('drawImgs', imgs);
          wx.navigateTo({
            url: '/pages/pk/drawImg/drawImg',
          })
        }

      }
    })

  },


  setLocation:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid; 
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("添加/更新主题位置", "添加当前位置到主题，以便附近用户可看到主题...", function () {
      tip.showContentTip("定位中...")
      that.setNetLocation(pkId,index);
    }, function () {});
  },

  setNetLocation: function (pkId,index) {
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
                      that.getLocation(pkId,index);
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
          that.getLocation(pkId,index);
        }
        else {
          //调用wx.getLocation的API
          that.getLocation(pkId,index);
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function (pkId,index) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let speed = res.speed
        let accuracy = res.accuracy;
        tip.showContentTip("定位中...")
        that.getLocal(latitude, longitude,pkId,index)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude,pkId,index) {
    let that = this;
    var myAmapFun = new amapFile.AMapWX({key:'528540a597af4bb3937965f09078dba4'});
    myAmapFun.getRegeo({
      success: function(data){
        var cityCode = data[0].regeocodeData.addressComponent.citycode;
        var cityName = data[0].regeocodeData.addressComponent.city;
        var desc = data[0].desc;
        var name = data[0].name;
        var latitude = data[0].latitude;
        var longitude = data[0].longitude;

        var msg = name+"&&TAG&&"+desc+"&&TAG&&"+cityName+"&&TAG&&"+cityCode+"&&TAG&&"+latitude+"&&TAG&&"+longitude;

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("success", function (location) {
          tip.showContentTip("更新主题位置...") 
          var msg = "pks[" + index + "].location"
          that.setData({
            [msg]: location
          })
         

  
        })
        httpClient.send(request.url.setLocation, "GET",
          {
            pkId:pkId,
            name:name,
            desc:desc,
            city:cityName,
            cityCode:cityCode,
            latitude:latitude,
            longitude:longitude
          }
        );    


        //成功回调
        that.setData({
          address:data[0].desc
        })
        console.log("地址:",latitude,longitude,data);
      },
      fail: function(info){
        //失败回调
        tip.showContentTip("获取位置失败...");
      }
    })



  },


})