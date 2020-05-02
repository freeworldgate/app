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
    contains:[]

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
    if(that.data.user.userId != that.data.creator.userId){return;}
    if(!( (5 * 60 < that.data.leftTime) &&  (that.data.leftTime < 20 * 60 )) ){return;}

    var pkId = that.data.pkId;
    var index = res.currentTarget.dataset.user

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (approver) {
      that.data.approvers.splice(index,1);
      that.setData({
        approvers:that.data.approvers
      })
    })
    httpClient.send(request.url.setApproveUser, "GET",{pkId: pkId,approverId: that.data.approvers[index].user.userId,tag:0});


  },


  select:function(res){
    var that = this;
    if(that.data.user.userId != that.data.creator.userId){return;}
    if(!( (5 * 60 < that.data.leftTime) &&  (that.data.leftTime < 20 * 60 )) ){return;}

    var pkId = that.data.pkId;
    var index = res.currentTarget.dataset.user

    for(var i = 0;i<that.data.approvers.length;i++){
      if(that.data.userIntegrals[index].user.userId === that.data.approvers[i].user.userId){
        return;
      }
    }





    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (approver) {

        that.data.approvers.unshift(approver);
        that.setData({
          approvers:that.data.approvers
        })


      // that.data.approvers.splice(index,1);
      
      // that.setData({

      //   approvers:that.data.approvers
      // })
    
    })
    httpClient.send(request.url.setApproveUser, "GET",{pkId: pkId,approverId: that.data.userIntegrals[index].user.userId,tag:1});



    // if(that.data.userIntegrals[index].select === 1)
    // {





    // }
    // else
    // {


    //   var httpClient = template.createHttpClient(that);
    //   httpClient.setMode("label", true);
    //   httpClient.addHandler("success", function (approver) {
    //     that.data.approvers.unshift(approver);
    //     that.setData({
    //       [key] : approver,
    //       approvers:that.data.approvers
    //     })
      
    //   })
    //   httpClient.send(request.url.setApproveUser, "GET",{pkId: pkId,approverId: that.data.userIntegrals[index].user.userId,tag:1});

    // }




  },

  selectPrepare:function(){
    var that = this;
    that.updateTime(function(){

        if(!(that.data.hour === 0 && 5<that.data.minute < 20)){
          tip.showContentTip("当前时间段不可设置");
          return;
        }
        if(that.data.mode === 0){
          that.setData({
              mode:1
            })
        }
        else
        {
          that.setData({
            mode:0
          })
        }
    })










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
  }

})