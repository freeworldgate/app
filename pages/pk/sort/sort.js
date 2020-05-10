// pages/pk/sort/sort.js
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
    mode:0,
    end:false,
    index:0,
    userIntegrals:[],
    sort:0,
    contains:[],
    leftTime:0,
    hour:0,
    minute:0,
    second:0

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


    var pkId = options.pkId;
    this.data.pkId = pkId; 
    this.querySort(pkId,this.data.index);
  },

  querySort:function(pkId,index){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.querySort, "GET",{pkId: pkId,index: index});
  },
  queryMoreSort:function(pkId,cIndex){
    var that = this;
    
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (userIntegrals) {

      that.setData({
          index:cIndex + 1,
          userIntegrals:that.data.userIntegrals.concat(userIntegrals)
      })
    
    })
    httpClient.send(request.url.queryMoreSort, "GET",{pkId: pkId,index: cIndex});
  },

  onReachBottom:function(){


    if(!this.data.end){
      this.queryMoreSort(this.data.pkId,this.data.index);
    }

  },
  remove:function(res){
    var that = this;




    template.createOperateDialog(that).show("放弃审核权", "确定放弃吗?...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
        for(var index=0;index < that.data.approvers.length;i++)
        {
          if(that.data.approvers[index].user.userId === that.data.user.userId)
          {
            that.data.approvers.splice(index,1);
            that.setData({
              approvers:that.data.approvers
            })
          }
  
        }
  
      })
      httpClient.send(request.url.removeApproveUser, "GET",{pkId: that.data.pkId});

    }, function () {});




  },


  select:function(){
    var that = this;
    var pkId = that.data.pkId;

    for(var i=0;i<that.data.approvers.length;i++)
    {
        if(that.data.approvers[i].user.userId === that.data.user.userId)
        {
          template.createOperateDialog(that).show("您已经是审核员", "不可重复设置...", function () {}, function () {});
          return;
        }
    }


    if(that.data.user.userId != that.data.creator.userId){
      if(((that.data.userIntegralInfo.index + 1) > (that.data.sortNum/10)) || (that.data.userIntegralInfo.index < 0))
      {
          template.createOperateDialog(that).show("无权限", "排名前10%用户参与抢夺...", function () {}, function () {});
          return;
      }
    }
    else
    {
      template.createOperateDialog(that).show("您已经是审核员", "榜主默认审核权限...", function () {}, function () {});
      return;
    }


    if(that.data.approvers.length >= that.data.approverNum )
    {
        template.createOperateDialog(that).show("名额已满", "审核用户已满...", function () {}, function () {});
        return;
    }











    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("erroTime", function () {template.createOperateDialog(that).show("无法设置", "当前时间段不可设置预审核用户...", function () {}, function () {});})
    httpClient.addHandler("success", function (approvers) {
      that.setData({approvers:approvers})
      template.createOperateDialog(that).show("恭喜", "成功抢到审核权，24:00后可设置发布公告...", function () {}, function () {});
    })
    httpClient.addHandler("fail", function (approvers) {
      that.setData({approvers:approvers})
      template.createOperateDialog(that).show("好遗憾", "你慢了一步，已经被抢空了...", function () {}, function () {});
    })
    httpClient.addHandler("noPrivilige", function () {template.createOperateDialog(that).show("无权限", "排名前10%用户参与抢夺...", function () {}, function () {});})
    httpClient.addHandler("noMore", function () {template.createOperateDialog(that).show("名额已满", "审核用户已满...", function () {}, function () {});})
    httpClient.send(request.url.setApproveUser, "GET",{pkId: pkId});

  },



  sort:function(){
      var that = this;
      var compare = function (integral1, integral2) {
        var val1 = that.data.sort!=1? integral1.select:integral1.index;
        var val2 = that.data.sort!=1? integral2.select:integral2.index;
        if (val1 < val2) {
            return that.data.sort!=1?1:-1;
        } else if (val1 > val2) {
            return that.data.sort!=1?-1:1;
        } else {
            return 0;
        }            
      } 
      that.data.userIntegrals.sort(compare);
      that.setData({
        userIntegrals:that.data.userIntegrals,
        sort:that.data.sort!=1?1:0

      })
  },

  onShow:function(){
    var that = this;
    that.data.interval = setInterval(function () {
      that.data.leftTime = that.data.leftTime-1


      that.setData({
        leftTime :that.data.leftTime,
        hour:parseInt(that.data.leftTime/(60*60)),
        minute:parseInt(that.data.leftTime%(60*60)/60),
        second:parseInt(that.data.leftTime%(60*60)%60),
      })
      if(that.data.leftTime === 0){
        clearInterval(that.data.interval);
      }


    }, 1000)

  

  },
  onHide:function(){
    clearInterval(this.data.interval);
  },


  updateTime:function(success){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (leftTime) {
        that.setData({
          leftTime:leftTime
        })
        success();
    })
    httpClient.send(request.url.updateTime, "GET",{pkId: that.data.pkId});
  },
  onPullDownRefresh: function() {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.querySort, "GET",{pkId: that.data.pkId,index: 0});

  },

  

})