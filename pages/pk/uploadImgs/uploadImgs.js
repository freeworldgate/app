// pages/pk/uploadImgs/uploadImgs.js
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

    left:200,
    imgs:new Array(),


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.pkId = options.pkId;
    var imgFiles = options.imgs.split(",");
    var allFiles = this.data.imgs.concat(imgFiles);
    this.setData({
      imgs:allFiles
    })
  },


  _input:function(res){
    var value = res.detail.value;
    if (value.length > 200) {
      showTip("内容超出长度");
      // return;
    }
    this.setData({
      'text': value,
      'left':200 - value.length
    })

  },
  _remove:function(res){
    var that = this;
    var index = parseInt(res.currentTarget.dataset.index);
    that.data.imgs.splice(index, 1);

    that.setData({
      imgs: that.data.imgs,
    })

  },

  _add:function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {


        var imgFiles = that.data.imgs.concat(res.tempFilePaths);
        that.setData({
          imgs: imgFiles,
        })
      },
    })
  },


  upload:function(){
      var that = this;



      template.uploadImages3("userUpload", that.data.imgs, that,
      function (urls) {
          //传输成功
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("---start---" ,urls);
          console.log("图片集合", urls);
  
          // , urls
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function (post) {
            tip.showTip("上传成功......");

            template.createLabelLoading(that).hide();
            wx.setStorageSync("action", "userPost")
            wx.setStorageSync("post", post)
            wx.navigateBack({
              complete: (res) => {},
            })

          })
          httpClient.send(request.url.createPost, "GET",
            {
              pkId: that.data.pkId,
              title: that.data.text,
              imgUrls: urls,
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
              tip.showContentTip("上传失败......");
            },
          })
          

      });



  }
})



    // createEditImageDialog(page).setDialog("续传榜帖", post.topic, 9, function () {
    //   console.log("-------------confirm------------");
    //   page.singlePostDialog.show(post, singlePostDialog.success);
    //   page.setData({
    //     "singlePostDialog.statu": 'loading'
    //   })

    // }, function (text, urls) {
    //   //上传成功
    //   var httpClient = createHttpClient(page);
    //   httpClient.setMode("label", true);
    //   httpClient.addHandler("success", function (post) {

    //     page.setData({
    //       "singlePostDialog.post": post,
    //       "singlePostDialog.statu": 'normal'
    //     })
    //     page.singlePostDialog.success(post);

    //   })
    //   httpClient.send(request.url.uploadPostImgs, "GET",
    //     {
    //       pkId:page.data.pkId,
    //       postId:post.postId,
    //       title: text,
    //       imgUrls: urls,
    //     }
    //   );

    // }, function () {
    //   //上传失败
    //   page.setData({
    //     "singlePostDialog.statu": 'normal'
    //   })
    //   tip.showContentTip("续传失败!");
      
    // }).show();