// pages/pk/selectApprover/selectApprover.js
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
    that.data.pkId = options.pkId;
    that.data.postId = options.postId;
    that.data.approveUserId = options.approveUserId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    // httpClient.send(request.url.queryApproveInfo, "GET", { pkId: this.data.pkId  });
    httpClient.send(request.url.queryApproveInfo2, "GET", { pkId: that.data.pkId ,postId:that.data.postId  });


  },


  


 

  agree:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.approve, "GET",{pkId: that.data.pkId,postId: that.data.postId}
    );


  },
  setComment:function(){
    var that = this;
    template.createEditImageDialog(that).setDialog("留言", "编辑留言", 1, function () {

    }, function (text, urls) {
      //上传成功

      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (post) {


      })
      httpClient.send(request.url.setComment, "GET",
        {
          pkId: that.data.pkId,
          text: text,
          imgUrl: urls[0],
        }
      );

    }, function () {
      //上传失败

    }).show();



  },
  

})