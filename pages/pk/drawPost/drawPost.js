// pages/pk/drawImg/drawImg.js
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
wx.createSelectorQuery()
var ctx = wx.createCanvasContext('myCanvas');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu:0,
    imgs:[]
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


    var post = wx.getStorageSync('importPost');
    that.setData({
      imgBack:options.imgBack,
        pkId:options.pkId,
        postId:options.postId,
        style:parseInt(options.style),
        post:post,
    })

    
    that.queryPost("page",that.data.pkId,that.data.postId);
    wx.removeStorageSync('importPost')
  },
  queryPost:function(tag,pkId,postId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tag, false);
    httpClient.addHandler("success", function (topic) {

        that.setData({"post.pkTopic":topic})
        that.drawWxCode();
        that.drawUserImg();
        that.drawImg();
    })
    httpClient.send(request.url.importPost, "GET", { pkId: pkId, postId:postId});
  },



  drawWxCode:function(){
    var that = this;

    wx.getImageInfo({
        src:that.data.post.wxCode,
        success:function(res){
          var imgW = res.width;
          var imgH = res.height;
          var x = imgW>imgH?(imgW-imgH)/2:0;
          var y = imgW>imgH?0:(imgH-imgW)/2;
          var size = imgW>imgH?imgH:imgW;
          var imgData = {x:x,y:y,size:size,url:res.path,lx:75,ly:130,lwidth:20,lheight:20};
          that.data.wxcode = imgData;
          if(that.data.imgs[0]&&that.data.imgs[1]&&that.data.imgs[2]&&that.data.imgs[3]&&that.data.imgs[4]&&that.data.imgs[5]&&that.data.imgs[6]&&that.data.imgs[7]&&that.data.imgs[8]&& that.data.wxcode && that.data.userImg){
            that.refresh(); 
          }

        }
    })


  },
  drawUserImg:function(){
    var that = this;

    wx.getImageInfo({
        src:that.data.post.creator.imgUrl,
        success:function(res){
          var imgW = res.width;
          var imgH = res.height;
          var x = imgW>imgH?(imgW-imgH)/2:0;
          var y = imgW>imgH?0:(imgH-imgW)/2;
          var size = imgW>imgH?imgH:imgW;
          var imgData = {x:x,y:y,size:size,url:res.path,lx:81,ly:136,lwidth:8,lheight:8};
          that.data.userImg = imgData;
          if(that.data.imgs[0]&&that.data.imgs[1]&&that.data.imgs[2]&&that.data.imgs[3]&&that.data.imgs[4]&&that.data.imgs[5]&&that.data.imgs[6]&&that.data.imgs[7]&&that.data.imgs[8]&& that.data.wxcode && that.data.userImg){

            that.refresh(); 
          }

        }
    })

  },

  drawTopic:function(){
    var that = this;
    const context = ctx;
    var text = that.data.post.topic;//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(3.8 * vwPx)
    context.setFillStyle("#9c9c9c")
    for (var a = 0; a < chr.length; a++) {
     if (context.measureText(temp).width < 60*vwPx) {
      temp += chr[a];
     }
     else {
      a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
      row.push(temp);
      temp = "";
     }
    }
    row.push(temp); 
   
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
     var rowCut = row.slice(0, 2);
     var rowPart = rowCut[1];
     var test = "";
     var empty = [];
     for (var a = 0; a < rowPart.length; a++) {
      if (context.measureText(test).width < 220) {
       test += rowPart[a];
      }
      else {
       break;
      }
     }
     empty.push(test);
     var group = empty[0] + "..."//这里只显示两行，超出的用...表示
     rowCut.splice(1, 1, group);
     row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
     context.fillText(row[b], 2*vwPx, (146 + 5*b) * vwPx, 60*vwPx);
    }
  
  




  },
  drawPkTopic:function(){
    var that = this;
    const context = ctx;
    var text = that.data.post.pkTopic;//这是要绘制的文本
    var chr =text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(4.3 * vwPx);
    context.font = 'normal bold '+ 4.3 * vwPx +'px sans-serif';
    context.setFillStyle("#3f3f3f")
    for (var a = 0; a < chr.length; a++) {
     if (context.measureText(temp).width < 60*vwPx) {
      temp += chr[a];
     }
    }
    if(context.measureText(temp).width > 60*vwPx)
    {
      temp += "...";
    }
    

    context.fillText(temp, 2*vwPx, 136 * vwPx, 60*vwPx);
  
  




  },



  drawImg:function(){

    var that = this;


    for(var index=0;index<9;index++)
    {
    
      var drawData = that.getDrawPsion(index,that.data.style);
      var img = that.data.post.postImages[index];
      that.imagePro(index,img,drawData);

    }
  
    // ctx.draw()
    // ctx.save();

  





  },
  imagePro:function(index,img,drawData){
    var that = this;



      wx.getImageInfo({
          // src: res.tempFilePath,
          src:img.imgUrl,
          success:function(res){
            var imgW = res.width;
            var imgH = res.height;
            var x = imgW>imgH?(imgW-imgH)/2:0;
            var y = imgW>imgH?0:(imgH-imgW)/2;
            var size = imgW>imgH?imgH:imgW;
            var imgData = {x:x,y:y,size:size,url:res.path,lx:drawData.x,ly:drawData.y,lwidth:drawData.width,lheight:drawData.height};
            that.data.imgs[index] = imgData;
            if(that.data.imgs[0]&&that.data.imgs[1]&&that.data.imgs[2]&&that.data.imgs[3]&&that.data.imgs[4]&&that.data.imgs[5]&&that.data.imgs[6]&&that.data.imgs[7]&&that.data.imgs[8]&& that.data.wxcode && that.data.userImg){

              that.refresh(); 
            }
             
    
            // ctx.draw()
            // ctx.save();
          }
      })






  },


  save:function(){
    wx.showLoading({
      title: '生成图片',
    })


    wx.canvasToTempFilePath({ //裁剪对参数
      canvasId: "myCanvas",
      x: 0, //画布x轴起点
      y: 0, //画布y轴起点
      width: vwPx * 97, //画布宽度
      height:vwPx * 155, //画布高度
      // destWidth: image_width, //输出图片宽度
      // destHeight: image_height, //输出图片高度
      success: function (res) {
        console.log('图片处理成功了',res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        wx.showToast({
          title: '出错啦...',
          icon: 'loading'
        })
      }
    })





  }
  ,



  getDrawPsion:function(index,style){
      // if(style===2){style=3}
      // else if(style===3){style=5}
      // else if(style===4){style=2}
      // else if(style===5){style=4}
      // else{}





      if(style === 1 || style ===2)
      {
          if(index === 0){return style===1?{x:0,y:0,width:62,height:62}:{x:0,y:0,width:31,height:31};}
          if(index === 1){return style===1?{x:62,y:0,width:31,height:31}:{x:31,y:0,width:62,height:62};}
          if(index === 2){return style===1?{x:62,y:31,width:31,height:31}:{x:0,y:31,width:31,height:31};}
          if(index === 3){return {x:0,y:62,width:31,height:31};}
          if(index === 4){return {x:31,y:62,width:31,height:31};}
          if(index === 5){return {x:62,y:62,width:31,height:31};}
          if(index === 6){return {x:0,y:93,width:31,height:31};}
          if(index === 7){return {x:31,y:93,width:31,height:31};}
          if(index === 8){return {x:62,y:93,width:31,height:31};}

      }
      else if(style===3||style===4)
      {
        if(index === 0){return {x:0,y:0,width:31,height:31};}
        if(index === 1){return {x:31,y:0,width:31,height:31};}
        if(index === 2){return {x:62,y:0,width:31,height:31};}


          if(index === 3){return style===3?{x:0,y:31,width:62,height:62}:{x:0,y:31,width:31,height:31};}
          if(index === 4){return style===3?{x:62,y:31,width:31,height:31}:{x:31,y:31,width:62,height:62};}
          if(index === 5){return style===3?{x:62,y:62,width:31,height:31}:{x:0,y:62,width:31,height:31};}
          


          if(index === 6){return {x:0,y:93,width:31,height:31};}
          if(index === 7){return {x:31,y:93,width:31,height:31};}
          if(index === 8){return {x:62,y:93,width:31,height:31};}


      }
      else if(style===5||style===6)
      {
          if(index === 0){return {x:0,y:0,width:31,height:31};}
          if(index === 1){return {x:31,y:0,width:31,height:31};}
          if(index === 2){return {x:62,y:0,width:31,height:31};}

          if(index === 3){return {x:0,y:31,width:31,height:31};}
          if(index === 4){return {x:31,y:31,width:31,height:31};}
          if(index === 5){return {x:62,y:31,width:31,height:31};}

          if(index === 6){return style===5?{x:0,y:62,width:62,height:62}:{x:0,y:62,width:31,height:31};}
          if(index === 7){return style===5?{x:62,y:62,width:31,height:31}:{x:31,y:62,width:62,height:62};}
          if(index === 8){return style===5?{x:62,y:93,width:31,height:31}:{x:0,y:93,width:31,height:31};}

      }
      else
      {
        if(index === 0){return {x:0,y:0,width:31,height:31};}
        if(index === 1){return {x:31,y:0,width:31,height:31};}
        if(index === 2){return {x:62,y:0,width:31,height:31};}

        if(index === 3){return {x:0,y:31,width:31,height:31};}
        if(index === 4){return {x:31,y:31,width:31,height:31};}
        if(index === 5){return {x:62,y:31,width:31,height:31};}

        if(index === 6){return {x:0,y:62,width:31,height:31};}
        if(index === 7){return {x:31,y:62,width:31,height:31};}
        if(index === 8){return {x:62,y:62,width:31,height:31};}





      }










  },



  refresh:function(){
    var that = this;
    
    
    ctx.save()
    ctx.setFillStyle('white');//填充白色
    ctx.fillRect(0,0,vwPx * 97,vwPx * 155);//画出矩形白色背景
    ctx.restore()

    for(var index=0;index<that.data.imgs.length;index++)
    {
      var imgData = that.data.imgs[index];
      ctx.drawImage(imgData.url,imgData.x,imgData.y,imgData.size,imgData.size, (imgData.lx + 2)*vwPx, (imgData.ly+2)*vwPx,(imgData.lwidth)*vwPx , (imgData.lheight)*vwPx);
    }
    ctx.drawImage(that.data.wxcode.url,that.data.wxcode.x,that.data.wxcode.y,that.data.wxcode.size,that.data.wxcode.size, (that.data.wxcode.lx)*vwPx, (that.data.wxcode.ly)*vwPx,(that.data.wxcode.lwidth)*vwPx , (that.data.wxcode.lheight)*vwPx);

    ctx.save()
    ctx.beginPath()
    ctx.arc(85*vwPx, 140*vwPx, 4*vwPx, 0, 2 * Math.PI)	//绘制圆圈
    ctx.clip()	//裁剪
    ctx.drawImage(that.data.userImg.url,that.data.userImg.x,that.data.userImg.y,that.data.userImg.size,that.data.userImg.size, (that.data.userImg.lx)*vwPx, (that.data.userImg.ly)*vwPx,(that.data.userImg.lwidth)*vwPx , (that.data.userImg.lheight)*vwPx);
    ctx.restore()




    that.drawTopic();
    that.drawPkTopic();

    ctx.draw()
    ctx.save();



    that.setData({statu:1})



  },

  back:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  }

})