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



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval:0,
    eyeStatu:true,
    pkId:"PK01",
    isApprove:true,
    factualInfos:[],
    vwPx:vwPx,
    r_width:r_width,
    l_width:l_width,
    img_width:img_width,
    small_size:small_size,
    large_size:large_size



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    that.addInvite(options.pkId);
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

  addInvite:function(pkId){
      var that = this;
      var user = wx.getStorageSync('user');
      if(user)
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
  createPay:function(payInfo)
  {

    wx.requestPayment({
      timeStamp: payInfo.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      signType: 'MD5',
      paySign: payInfo.paySign,
      success: function (event) {

       
      },
      fail: function (error) {
       
      },
       

       
    });

  },



  checkUserPost:function(){
    var that = this;
  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("createPost", function () {that.createPost();})
    httpClient.addHandler("pay", function (pay) {
      //支付购买激活
      template.createPayDialog(that).show(pay,function(single){
          that.createPay(single);
      },function(all){
        that.createPay(all);
      });




      // template.createOperateDialog(that).show(tip1.castV2,tip1.castV3,function(){
      //   // that.uploadImgs();
      // },function(){});




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
    httpClient.addHandler("uploadImgs", function (tip) {
      template.createOperateDialog(that).show(tip.castV2,tip.castV3,function(){
        that.uploadImgs();

      },function(){});
        

    })
    
    httpClient.send(request.url.checkUserPost, "GET",{pkId: that.data.pkId,});
  },



  publish:function(){
    var that = this;
  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    
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
      template.createEditImageDialog(that).setDialog("编辑图册", "编辑你想说的话", 9, function () {
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
        title: '邀请@'+ that.data.pk.topic ,
        desc: "from",
        imageUrl:that.data.pk.backUrl,
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

  

  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
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
        httpClient.addHandler("editApproverMessage", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

            that.approverMessage();

          }, function () {});
          
        })
        httpClient.addHandler("groupCode", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

              that.groupCode();


          }, function () {});
          
        })

        httpClient.addHandler("select", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

              wx.navigateTo({
                url: "/pages/pk/post/post?pkId=" + that.data.pkId + "&postId=" + result.castV1 ,
              })

          }, function () {});
          
        })

        httpClient.addHandler("publish", function (tip) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {
                that.publish();
  
          }, function () {});
          
        })
      
        httpClient.addHandler("no", function (tip) {
          
        })
        httpClient.send(request.url.oneTimeTask, "GET", { pkId: that.data.pkId });
        
      },1)
    }
  },
  onReady:function (params) {
    
  },
  onShow:function(){
    // var that = this;
    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", false);
    // var user = wx.getStorageSync("user");
    // var fromUserId = wx.getStorageSync('fromUser');
    // httpClient.addHandler("error", function (tip) {
    //   template.createOperateDialog(that).show("提示",tip,function(){
    //     wx.reLaunch({
    //       url: '/pages/pk/home/home',
    //     })
    // },function(){});
    // })
    // httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId, fromUser: fromUserId});  

  },
  onHide:function(){
    clearInterval(this.data.interval);
  },

  complain:function (res) {
    var that = this;  

    template.createOperateDialog(that).show("提示", "只有一次投诉机会,确定要投诉吗?投诉后图册将无法修改...", function () {
      template.createEditTextDialog(that).show("投诉", "编辑投诉信息","", 60, function (text) {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.complain, "GET",{pkId: that.data.pkId,text:text});
    
      });
    }, function () {});
  },
  openCpostText:function()
  {
    var that = this;
    var ctag = that.data.cpost.tag;
    that.setData({
      'cpost.tag':!ctag
    })
  },
  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'posts['+index+'].tag';
    var ctag = that.data.posts[index].tag;
    that.setData({
      [tag]:!ctag
    })
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
  

  editCpostSelfComment:function(res){
    var that = this;
    var post = res.currentTarget.dataset.post;


    template.createEditTextDialog(that).show("评论", "编辑评论","", 60, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (cpost) {
      
                that.setData({
                  cpost:cpost
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

  editSelfComment:function(res){
    var that = this;
    var index = res.currentTarget.dataset.index;
    var post = res.currentTarget.dataset.post;


    template.createEditTextDialog(that).show("评论", "编辑评论","", 60, function (text) {
      
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

  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style ,
    })

  },

  freshPost:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    var post =  res.currentTarget.dataset.post;
    post.postImages.sort(function(){
                   return Math.random()-0.5;
            });

    post.style = Math.floor(Math.random() * (6) + 1);
    var upost = "posts[" + index + "]";
    that.setData({
      [upost]:post
    })

  },
  freshCpost:function(res){
    var that = this;
    var post =  res.currentTarget.dataset.post;
    post.postImages.sort(function(){
                   return Math.random()-0.5;
            });
    post.style = Math.floor(Math.random() * (6) + 1);

    that.setData({
      cpost:post
    })

  },
  openTopic:function(res){
      var that = this;
      var index =  res.currentTarget.dataset.index;
      var flag = "posts[" + index + "].flag";
      that.setData({
        [flag]:!that.data.posts[index].flag
      })




  },
  changeEyeStatu:function(){
    var that = this;
    that.setData({
      eyeStatu:!that.data.eyeStatu
    })


  }


})