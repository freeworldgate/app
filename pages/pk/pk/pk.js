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
    interval:0,
    publish:'off',
    pkId:"PK01",

    factualInfos:[],

    albums: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    img: "https://fenghao211.oss-cn-beijing.aliyuncs.com/img/%20%2812%29.jpeg",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.pkId = "PK01";


    
    var that = this;


    //Top高度
    inviteReq.getHeight(function (res) {
      that.setData({
        top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })

    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: '#ff3300',
    // })
    // 上一级分享人
    var fromUser = options.fromUser;
    var pkId = options.pkId;
    

    wx.setStorageSync("fromUser", fromUser);
    wx.setStorageSync("pkId", pkId);
  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    var user = wx.getStorageSync("user");
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUser});
    that.setData({
      user:user,
    })


  },
  publish:function(){
    var that = this;
  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("createPost", function () {that.createPost();})
    httpClient.addHandler("needPay", function () {
      template.createOperateDialog(that).show("发布帖子","购买帖子",function(){
          wx.navigateTo({
            url: '/pages/pk/cashiers/cashiers?pkId=' + that.data.pkId,
          })

      },function(){});

    })
    httpClient.addHandler("userPost", function (post) {
      template.createSinglePostDialog(that).show(post, function (newPost) {
        if(that.data.posts[0].postId === newPost.postId){
          that.data.posts.splice(0, 1, newPost);
        }
        else{
          that.data.posts.splice(0, 0, newPost);
        }
        that.setData({
          posts: that.data.posts
        })
      });

    })
    httpClient.addHandler("uploadImgs", function (post) {
      
        that.uploadImgs();

    })
    httpClient.send(request.url.queryUserPost, "GET",{pkId: that.data.pkId,});
  },

  uploadImgs:function(successCallBack){
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
          var files = res.tempFilePaths;
          wx.navigateTo({
            url: '/pages/pk/uploadImgs/uploadImgs?imgs='+files + "&pkId=" + that.data.pkId,
          })
      },
    })

  },



  createPost:function(){
    var that = this;
    login.getUser(function (user) {
      that.setData({ user: user })
      template.createEditImageDialog(that).setDialog("编辑榜帖", "编辑你想说的话", 9, function () {
        console.log("-------------confirm------------");
        that.setData({
          publish: "on"
        })
      }, function (text, urls) {
        //上传成功
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("success", function (post) {

          that.data.posts.splice(0,0,post);
          that.setData({
            posts: that.data.posts
          })
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: "/pages/pk/userSinglePost/userSinglePost?postId=" + post.postDetail.postId,
          })

        })
        httpClient.send(request.url.createPost, "GET",
          {
            pkId: that.data.pkId,
            title: text,
            imgUrls: urls,
          }
        );
        that.setData({
          publish: "off"
        })
      }, function () {
        //上传失败
        that.setData({
          publish: "off"
        })
      }).show();
    })

  },


  


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onReachBottom:function(){
    this.nextPage();

  },
  nextPage: function () {
    var that = this;
    if(that.data.posts.length < 50){return;}
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    this.refreshPage();
  },

  refreshPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      // var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: data,
        page:that.data.page+1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    wx.stopPullDownRefresh()
  },

  likeOrDisLike:function(res){
    var that = this;
    var index = parseInt(res.currentTarget.dataset.index);
    var postId = res.currentTarget.dataset.postid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.addHandler("success",function(){})
    httpClient.send(request.url.likeOrDisLike, "GET", { pkId: that.data.pkId, postId: postId, isQueryerCollect: that.data.posts[index].queryerCollect });

    var key = 'posts[' + index + ']' +".queryerCollect"
    if (this.data.posts[index].queryerCollect){
      this.setData({
        [key]: false
      })
    }
    else{
      this.setData({
        [key]: true
      })
    }




  },
  showImgs:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var imgUrls = [];
    for(var i=0;i<imgs.length;i++){
      var singleImgUrl = imgs[i].imgUrl;
      imgUrls.push(singleImgUrl);
    }
    wx.previewImage({
      urls: imgUrls,
    })





  },

  share:function(){
    var that = this;

    var user = wx.getStorageSync("user");
    var fromUser = wx.getStorageSync("fromUser");

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (shareData) {
      //数据回来了：
      template.createShareDialog(that).show(shareData);
    })
    httpClient.send(request.url.shareMenu, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUser });



  },
  _post_show:function(){
      // 点击图片


  },
  showPost:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (singlepost) {
        template.createSinglePostDialog(that).show(singlepost,function(newPost){
          if (that.data.posts[0].postId === newPost.postId) {
            that.data.posts.splice(0, 1, newPost);
          }
          else {
            that.data.posts.splice(0, 0, newPost);
          }
          that.setData({
            posts: that.data.posts
          })
        });
      })
      httpClient.send(request.url.queryPostById, "GET", { pkId: that.data.pkId, postId:post.postId });








  },

  userFeeCode:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("code", function (userCode) {

        template.createUploadFeeDialog(that).show(userCode);
    })
    httpClient.send(request.url.uploadFeeCode, "GET", {pkId:that.data.pkId});


  },

  applyOrder:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createApplyOrderDialog(that).show(order);

    })
    httpClient.send(request.url.applyOrder, "GET", { pkId: that.data.pkId });


  },
  userFeeOrder:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createSingleOrderDialog(that).show(order);
    })
    httpClient.send(request.url.verifyOrder, "GET", { pkId: that.data.pkId});
    // var that = this;
    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", true);
    // httpClient.addHandler("success", function (order) {
    //   template.createCashierOrderDialog(that).show(order);
    //   that.setData({
    //     'cashierOrderDialog.type': 1,
    //     'cashierOrderDialog.page': 1,
    //   })
    // })
    // httpClient.send(request.url.feeOrder, "GET", { pkId: that.data.pkId,type:1,page:1});
  },
  // 查看打赏订单
  rewardOrder:function(){

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createSingleOrderDialog(that).show(order);
   
    })
    httpClient.send(request.url.rewardOrder, "GET", { pkId: that.data.pkId});

  },

  userPayOrder: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      that.setData({
        'payerOrderDialog.type': 1,
        'payerOrderDialog.page': 1,
      })
      template.createPayerOrderDialog(that).show(order);

    })
    httpClient.send(request.url.payOrder, "GET", { pkId: that.data.pkId, type: 1, page: 1 });
  },

  createFeeDialog:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createApplyOrderDialog(that).show(order);
    })
    httpClient.send(request.url.queryCreateOrder, "GET", { pkId: that.data.pkId, cashierId:"U1" });

  },

  createApproveDialog: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createApproveOrderDialog(that).show(order);
      that.setData({
        'approveOrderDialog.type': 2,
        'approveOrderDialog.page': 1,
      })
    })
    httpClient.send(request.url.approveUserCode, "GET", { pkId: that.data.pkId, type: 2, page: 1 });

  },

  createPostApproveDialog:function(){
      var that = this;
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (post) {
        template.createPostApproveDialog(that).show(post);
        that.setData({
          'postApproveDialog.type': 1,
          'postApproveDialog.page': 1,
        })
      })
      httpClient.send(request.url.postApprove, "GET", { pkId: that.data.pkId, type: 1, page: 1 });
  },

  createTaskDialog:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (tasks) {
      template.createTaskDialog(that).show(tasks);
      that.setData({
        'taskDialog.type': 1,
        'taskDialog.page': 1,
      })
    })
    httpClient.send(request.url.queryTasks, "GET", { pkId: that.data.pkId, type: 1, page: 1});   

  },

  createIntegralDialog:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (integral) {
      template.createIntegralDialog(that).show(integral);
    })
    httpClient.send(request.url.userIntegral, "GET", { pkId: that.data.pkId });



  },

  updateDynamic:function(){
    var that = this;
    wx.request({
      url: request.url.queryPkStatu,
      method:"GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        pkId: that.data.pkId,
      },
      
      success:function(res){
          that.setData({ 
             infos:res.data._4_data,

          })

      }
      
    })



},


  onShow:function(){
    var that = this;
    this.data.interval = setInterval(function () {that.updateDynamic()}, 1000)

    // wx.setStorageSync("action", "userPost")
    var action = wx.getStorageSync('action');
    if(action==="userPost"){
          var post = wx.getStorageSync('post');

          wx.removeStorageSync('action')
          wx.removeStorageSync('post')
          // that.data.posts.splice(0,0,post);
          // that.setData({
          //   posts: that.data.posts
          // })
          template.createSinglePostDialog(that).show(post, function (newPost) {
            if(that.data.posts[0].postId === newPost.postId){
              that.data.posts.splice(0, 1, newPost);
            }
            else{
              that.data.posts.splice(0, 0, newPost);
            }
            that.setData({
              posts: that.data.posts
            })
          });




    }

  },
  onHide:function(){
    clearInterval(this.data.interval);
  },






  selectTask:function(res){
    var that = this;
    var task = res.currentTarget.dataset.task;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      template.createSingleOrderDialog(that).show(order);
    })
    httpClient.send(request.url.queryTaskOrder, "GET", { orderId: task.orderId });
  },

  setUser:function(res){
    var userId = res.currentTarget.dataset.user;

    var user = wx.getStorageSync('user');
    user.userId = userId;
    wx.setStorageSync('user', user);
    wx.reLaunch({
      url: '/pages/pk/pk/pk',
    })

  }





})