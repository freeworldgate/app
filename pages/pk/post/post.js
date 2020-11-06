// pages/pk/post/post.js
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    wx.hideShareMenu({
      complete: (res) => {},
    })
    var that = this;
    inviteReq.getHeight(function (res) {
      that.setData({
        top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })


    // var postId = decodeURIComponent(query.scene);
    var postId = query.postId;
    this.queryPost(postId);

  },
  queryPost:function(postId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    httpClient.addHandler("success", function (post) {
      that.setData({
        post:post,
        imgBack:post.imgBack,
      })
      // wx.setStorageSync('pkId', post.pkId)

    });

    httpClient.send(request.url.queryPostByPostId, "GET", { postId:postId});


  },
  onReady:function (params) {
    // var that = this;
    // setTimeout(() => {
    //   if(!that.data.verfiy)
    //   {
    //     this.isPostApproved();
    //   }


    // }, 1000);








  },

  freshPost:function(res){
    var that = this;


    that.data.post.postImages.sort(function(){
                   return Math.random()-0.5;
            });

    that.data.post.style = Math.floor(Math.random() * (6) + 1);

    that.setData({
      post: that.data.post
    })

  },
  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    
    
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style,
    })

  },

  
  goPk:function(res)
  {
    var that = this;
    var pkid = res.currentTarget.dataset.pkid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    // httpClient.addHandler("group", function (link) {

    //   template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
    //     wx.navigateTo({
    //       url: link.castV1,
    //     })

    // },function(){});
    // })
    
    httpClient.addHandler("unlock", function (link) {

      template.createOperateDialog(that).show(link.castV2,link.castV3,function(){
        wx.navigateTo({
          url: link.castV1,
        })

    },function(){});
    })
    httpClient.send(request.url.viewPk, "GET",{pkId:pkid});   

  },

  // goPk:function (res) {
  //   var that = this;
  //   var pkid = res.currentTarget.dataset.pkid;
  //   var fromUser = res.currentTarget.dataset.fromuser;
    
  //   login.getUser(function(user)
  //   {

  //     wx.navigateTo({
  //       url: '/pages/pk/pk/pk?pkId='+pkid + '&fromUser=' + fromUser,
  //     })

  //   })



  // },
  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })
  },
  editSelfComment:function(){
    var that = this;
    template.createEditTextDialog(that).show(that.data.t5, that.data.t6,that.data.post.selfComment, 60, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
      
    
                that.setData({
                  "post.topic":text
                })
    
              })
              httpClient.send(request.url.editSelfComment, "GET",
                {
                  pkId: that.data.pkId,
                  postId: that.data.postId,
                  text:text
                }
              );    



    });



  },




  back:function(){wx.navigateBack({
    complete: (res) => {},
  })},




  editText:function () {
    var that = this;
    template.createEditTextDialog(that).show(that.data.t5, that.data.t6,that.data.post.topic, 120, function (text) {
      
              // , urls
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (post) {
      
    
                that.setData({
                  "post.topic":text
                })
    
              })
              httpClient.send(request.url.replaceText, "GET",
                {
                  pkId: that.data.pkId,
                  postId: that.data.postId,
                  text:text
                }
              );    



    });






  },


})