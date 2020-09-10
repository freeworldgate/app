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

    pkId:"PK01",
    isApprove:true,
    factualInfos:[],

    hasInivte:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    that.addInvite(options.pkId,options.fromUser);
        //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })

    var fromUser = options.fromUser;
    if(fromUser){
     
      wx.setStorageSync("fromUser", fromUser);
      that.setData({
        fromUser:fromUser,
      })
    }

    var pkId = options.pkId;    
    this.setData({
      pkId:pkId
    })
    wx.setStorageSync("pkId", pkId);

    

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    var user = wx.getStorageSync("user");
    var fromUserId = wx.getStorageSync('fromUser');
    httpClient.addHandler("error", function (tip) {
      template.createOperateDialog(that).show("提示",tip,function(){
        wx.reLaunch({
          url: '/pages/pk/home/home',
        })
    },function(){});
    })
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUserId});
    that.setData({
      user:user,
    })
  },

  addInvite:function(pkId,fromUser){
      var that = this;
      var user = wx.getStorageSync('user');
      if(user && fromUser && (!that.data.hasInivte) )
      {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.send(request.url.addUserInvite, "GET", { pkId: pkId, userId: user.userId});
      }
    
  },
  approvingList:function (params) {
    var that = this;
    login.getUser(function (user) {
      wx.navigateTo({
        url: '/pages/pk/approvingPostList/approvingPostList?pkId=' + that.data.pkId,
      })
    })
  },
  approveList:function (params) {
    var that = this;
    login.getUser(function (user) {
      wx.navigateTo({
        url: '/pages/pk/approvePostList/approvePostList?pkId=' + that.data.pkId,
      })


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
      template.createOperateDialog(that).show("编辑榜帖","请按照主题和榜主样例要求编辑榜帖...",function(){
        that.uploadImgs();

      },function(){});
        

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
    var that = this;
    

    return {
        title: '邀请打榜@'+ that.data.pk.topic ,
        desc: "from",
        imageUrl:that.data.pk.user.imgUrl,
        path: '/pages/pk/pk/pk?pkId=' + that.data.pkId + "&fromUser=" + that.data.user.userId ,
    }

 









  },
  onReachBottom:function(){
    if(!this.data.nomore)
    {
      this.nextPage();
    }


  },
  nextPage: function () {
    var that = this;
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

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    var fromUserId = wx.getStorageSync('fromUser');
    httpClient.addHandler("error", function (tip) {
      template.createOperateDialog(that).show("提示",tip,function(){
        wx.reLaunch({
          url: '/pages/pk/home/home',
        })
    },function(){});
    })
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUserId});  
  },

  refreshPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      // var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: data,
        page:that.data.page+1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    // wx.stopPullDownRefresh()
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

  showPost:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      wx.navigateTo({
        url: '/pages/pk/post/post?pkId=' + that.data.pkId + "&postId=" + post.postId,
      })



  },






  updateDynamic:function(){
    var that = this;
    // wx.request({
    //   url: request.url.queryPkStatu,
    //   method:"GET",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   data:{
    //     pkId: that.data.pkId,
    //     userId:that.data.user.userId,

    //   },
      
    //   success:function(res){
    //       that.setData({ 
    //          infos:res.data._4_data,

    //       })

    //   }
      
    // })


    that.onTimeTask();
  },


  onTimeTask:function () {
    var that = this;
    if(that.data.isApprove && that.data.posts && that.data.user)
    {
      that.data.isApprove = false;  
      setTimeout(function() {
        
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("editApproverMessage", function (tip) {
          template.createOperateDialog(that).show("提示", "编辑审核公告...", function () {
            // wx.navigateTo({
            //   // url: "/pages/pk/approverInfos/approverInfos?approverUserId=" + that.data.user.userId + "&pkId=" + that.data.pkId,
            //   url:'/pages/pk/messageInfo/messageInfo?pkId=' + that.data.pkId + "&approverUserId=" + that.data.user.userId,
            // })
            that.approverMessage();

          }, function () {});
          
        })
        httpClient.addHandler("groupCode", function (postid) {
          template.createOperateDialog(that).show("更新主题群", "请更新主题群，以方便用户交流...", function () {

              that.groupCode();


          }, function () {});
          
        })

        httpClient.addHandler("select", function (postid) {
          template.createOperateDialog(that).show("图贴未发布", "您的图贴暂未审核,审核通过后才可以发布...", function () {

              wx.navigateTo({
                url: "/pages/pk/post/post?pkId=" + that.data.pkId + "&postId=" + postid ,
              })


          }, function () {});
          
        })
        httpClient.addHandler("publish", function (tip) {
          template.createOperateDialog(that).show("没有找到您的图贴", "您可以在主题下分享您的图贴...", function () {
                that.publish();
  
          }, function () {});
          
        })
        


        httpClient.addHandler("no", function (tip) {
          
        })
        httpClient.send(request.url.oneTimeTask, "GET", { pkId: that.data.pkId });
        
      },10)
    }
  },
  onReady:function (params) {
    
  },
  onShow:function(){
    var that = this;


    this.data.interval = setInterval(function () {that.updateDynamic()}, 1000)

    var myMessage = wx.getStorageSync('myMessage')
    if(myMessage)
    {
      wx.removeStorageSync('myMessage')

      that.setData({
        pkMessage:myMessage
      })


    }

    var user = wx.getStorageSync('user');
    if(user){
      this.setData({user:user})
      that.addInvite(that.data.pkId,that.data.fromUser);

    }


    // wx.setStorageSync("action", "userPost")
    // var action = wx.getStorageSync('action');
    // if(action==="userPost"){
    //       var post = wx.getStorageSync('post');

    //       wx.removeStorageSync('action')
    //       wx.removeStorageSync('post')
    //       // that.data.posts.splice(0,0,post);
    //       // that.setData({
    //       //   posts: that.data.posts
    //       // })
    //       template.createSinglePostDialog(that).show(post, function (newPost) {
    //         if(that.data.posts[0].postId === newPost.postId){
    //           that.data.posts.splice(0, 1, newPost);
    //         }
    //         else{
    //           that.data.posts.splice(0, 0, newPost);
    //         }
    //         that.setData({
    //           posts: that.data.posts
    //         })
    //       });




    // }

  },
  onHide:function(){
    clearInterval(this.data.interval);
  },

  complain:function (res) {
    var that = this;  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("complain", function (tipStr) {

      template.createOperateDialog(that).show("提示", tipStr, function () {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);  
        httpClient.send(request.url.confirmComplain, "GET",{pkId: that.data.pkId});

      }, function () {});


    })
    

    httpClient.send(request.url.complain, "GET",{pkId: that.data.pkId});

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
      url: '/pages/pk/home/home',
    })

  },

  approverMessage:function(){
    var that = this;
    
    if(that.data.user.userId != that.data.creator.userId){
      return ;
    }

    template.createEditImageDialog(that).setDialog("消息", "编辑消息", 1,function(){}, function (text, urls) {
      //上传成功
      wx.hideLoading({
        complete: (res) => {},
      })
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("message", function (message) {
        that.setData({
          'pkMessage':message,
        })
    })
      httpClient.send(request.url.publishApproveMessage, "GET",
        {
          pkId: that.data.pkId,
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

  approverView:function (res) {
    var that = this;
    var approver = res.currentTarget.dataset.approver;




    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("editMessage", function (order) {
      template.createOperateDialog(that).show("提示", "编辑审核公告...", function () {
        // wx.navigateTo({
          // url:'/pages/pk/messageInfo/messageInfo?pkId=' + that.data.pkId + "&approverUserId=" + approver,
        // })
        that.approverMessage();
      }, function () {});

    })
    httpClient.send(request.url.approverDetail, "GET", { pkId: that.data.pkId,approverId:approver });




  },

  groupCode:function(params) {

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:that.data.pkId});   

    // var that = this;
    // login.getUser(function (user) {

    //     wx.navigateTo({
    //       url: "/pages/pk/message/message?pkId=" +  ,
    //     })




    // })



  },
  approverMessageDetail:function(res){
    var that = this;
    login.getUser(function (user) {
      that.setData({
        autoplay:false
      })
      wx.navigateTo({
        url: '/pages/pk/messageInfo/messageInfo?pkId=' + that.data.pkId ,
      })   
    })


  },

  editSelfComment:function(res){
    var that = this;
    var index = res.currentTarget.dataset.index;
    var post = res.currentTarget.dataset.post;


    template.createEditTextDialog(that).show("胡评", "编辑胡评","", 60, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
      
                var key = "posts[" + index + "]"
                that.setData({
                  [key]:post
                })
    
              })
              httpClient.send(request.url.editSelfComment, "GET",
                {
                  pkId: that.data.pkId,
                  postId: post.postId,
                  text:text
                }
              );    



    });



  },
  back:function (params) {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  relaunch:function (params) {
    wx.reLaunch({
      url: '/pages/pk/home/home',
    })
  },
  showPk:function(res){
    var that = this;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createShowPkDialog(that).show(topic,watchword)

  },
  setPkUser:function()
  {
    var that = this;
    if(that.data.pk.pkTypeValue === 3 && that.data.pk.invite.key === 0)
    {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", "true");
      httpClient.send(request.url.setPkUser, "GET",{pkId:that.data.pk.pkId});   
   
    }



  }


})