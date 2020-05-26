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
  onLoad: function (options) {

    var that = this;
    inviteReq.getHeight(function (res) {
      that.setData({
        top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })


    this.setData({
        pkId:options.pkId,
        postId:options.postId,
    })

    this.queryPost(this.data.pkId,this.data.postId);

  },
  queryPost:function(pkId,postId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryPostById, "GET", { pkId: pkId, postId:postId});


  },
  onReady:function (params) {
    var that = this;
    setTimeout(() => {
      if(!that.data.verfiy)
      {
        this.isPostApproved();
      }


    }, 1000);








  },


  isPostApproved:function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.addHandler("noApprove", function () {
      template.createOperateDialog(that).show("审核", "选择审核员...", function () {

          wx.navigateTo({
            url: "/pages/pk/editApproveComment/editApproveComment?pkId="+that.data.pkId + "&postId=" + that.data.postId,
          })
          that.setData({verfiy:true})
    }, function () {});
    })
    httpClient.send(request.url.isPostApproved, "GET", { pkId: that.data.pkId, postId: that.data.postId});




  },

  editSelfComment:function(){
    var that = this;
    template.createEditTextDialog(that).show("修改主题", "修改主题内容",that.data.post.selfComment, 60, function (text) {
      
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


  replace:function (res) {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("online", function () {
      template.createOperateDialog(that).show("提示", "修改图片需要重新审核榜帖内容...", function () {
        that.replaceImage(index);
      }, function () {});
    })
    httpClient.addHandler("offline", function () {
      that.replaceImage(index);

    })
    httpClient.send(request.url.postStatu, "GET",
      {
        pkId: that.data.pkId,
        postId: that.data.postId,
      }
    );

  },

  replaceImage:function (index) {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        template.uploadImages3("userUpload", res.tempFilePaths, that,
        function (urls) {
            //传输成功
            wx.hideLoading({
              complete: (res) => {},
            })
            console.log("---start---" ,urls);

    
            // , urls
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.addHandler("success", function (post) {
              tip.showTip("上传成功......");
  
              that.setData({
                post:post
              })
              that.isPostApproved();
            })
            httpClient.send(request.url.replaceImg, "GET",
              {
                pkId: that.data.pkId,
                postId: that.data.postId,
                imgUrl: urls[0],
                index:index
              }
            );
  
  
            // page.editImageDialog.success();
            // createLabelLoading(page).hide();
            // createLabelLoadingSuccess(page).show();
        },
        function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("替换失败......");
              },
            })
            
  
        });
        
      },
    })
  },






  editText:function () {
    var that = this;
    template.createEditTextDialog(that).show("修改主题", "修改主题内容",that.data.post.topic, 150, function (text) {
      
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






  }

})