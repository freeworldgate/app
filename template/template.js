var request = require('./../utils/request.js')
var http = require('./../utils/http.js')
var tip = require('./../utils/tipUtil.js')
var login = require('./../utils/loginUtil.js')
var route = require('./../utils/route.js')
var redirect = require('./../utils/redirect.js')
var uuid = require('./../utils/uuid.js')
var inviteReq = require('./../utils/invite.js')
var userInvite = require('./../utils/userInvite.js')
var upload = require('./../utils/uploadFile.js')





// 反饋框
function createDialog(page) {
  if (page.dialog) {
    return page.dialog;
  }
  var dialog = new Object();
  dialog.visible = false;
  dialog.title = "",
    dialog.text = "",
    dialog.show = function (title, text) {
      page.setData({
        'dialog.title': title,
        'dialog.text': text,
        'dialog.visible': true,
      })
    }
  dialog.hide = function () {
    page.setData({
      'dialog.visible': false,
    })
  }
  page.dialog = dialog;
  page.dialog_confirm = function () {
    dialog.hide();
  }
  return dialog;
}
// info  warning  error
function createTipDialog(page) {
  if (page.tipDialog) {
    return page.tipDialog;
  }
  var tipDialog = new Object();
  tipDialog.visible = false;
  tipDialog.show = function (level, message) {
    page.setData({
      'tipDialog.message': message,
      'tipDialog.level': level,
      'tipDialog.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'tipDialog.visible': false,
      })
    }, 2000)
  }
  page.tipDialog = tipDialog;
  return tipDialog;



}
//操作框
function createOperateDialog(page) {
  if (page.operateDialog) {
    return page.operateDialog;
  }
  var operateDialog = new Object();
  operateDialog.visible = false;
  operateDialog.title = "",
    operateDialog.text = "",
    operateDialog.statu = 0;
  operateDialog.confirm = function () { };
  operateDialog.cancel = function () { };

  operateDialog.show = function (title, text, confirm, cancel) {
    operateDialog.confirm = confirm;
    operateDialog.cancel = cancel;
    page.setData({
      'operateDialog.title': title,
      'operateDialog.text': text,
      'operateDialog.visible': true,
    })
  }
  operateDialog.hide = function () {
    page.setData({
      'operateDialog.visible': false,
    })
    page.operateDialog = undefined;
  }
  page.operateDialog_confirm = function () {
    if (!operateDialog.statu === 0) {
      return;
    }
    operateDialog.statu = 1
    operateDialog.hide();

    operateDialog.confirm();
    operateDialog.statu = 0;
  };
  page.operateDialog_cancel = function () {
    operateDialog.hide();
    operateDialog.cancel();
  };
  page.operateDialog = operateDialog;
  return operateDialog;
}
//2秒钟信息显示框
function showTip(text) {
  wx.showToast({
    title: text,
  })
}
//中间位置 图片展示框(可以下载并保存图片)
function createImageShowDialog(page) { };
//编辑图片和文字窗口
function createEditMessageDialog(page) { };
//图片集合
function createImageListDialog(page) {
};
// 选择框
function createSelectionDialog(page) {
  if (page.selectionDialog) {
    return page.selectionDialog;
  }
  var selectionDialog = new Object();
  selectionDialog.visible = false;
  selectionDialog.style = 0;
  selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
  selectionDialog.items = new Array();
  selectionDialog.itemSelect = new Map();
  selectionDialog.statu = 0;
  selectionDialog.setLayout = function (location, direction) {
    selectionDialog.items.length = 0;
    selectionDialog.itemSelect.clear();
    if (direction === 'x' && location === 'top') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_top';
      selectionDialog.style = 5;
    }
    else if (direction === 'y' && location === 'top') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_top';
      selectionDialog.style = 4;
    }
    else if (location === 'left') {
      selectionDialog._selectionDialog_layout = 'ccc  selectionDialog_left';
      selectionDialog.style = 3;
    }
    else if (location === 'right') {
      selectionDialog._selectionDialog_layout = 'ccc selectionDialog_right';
      selectionDialog.style = 2;
    }
    else if (direction === 'x' && location === 'bottom') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
      selectionDialog.style = 1;
    }
    else {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
      selectionDialog.style = 0;
    }

    return selectionDialog;

  }

  selectionDialog.addItem = function (tabIcon, tabName, select) {
    var item = new Object();
    item.icon = tabIcon;
    item.name = tabName;
    selectionDialog.items.push(item);
    selectionDialog.itemSelect.set(tabName, select);
    return selectionDialog;
  }


  selectionDialog.show = function () {
    page.setData({
      'selectionDialog.items': selectionDialog.items,
      'selectionDialog.style': selectionDialog.style,
      'selectionDialog._selectionDialog_layout': selectionDialog._selectionDialog_layout,
      'selectionDialog.visible': true,

    })
  }

  selectionDialog.hide = function () {
    page.setData({
      'selectionDialog.visible': false,
    })
    // page.selectionDialog = undefined;
  }


  page.selectionDialog = selectionDialog;
  page._selectionDialog_hide = function () {
    page.setData({
      'selectionDialog.visible': false,
    })
  }
  page._selectDialog_choose = function (res) {
    if (page.selectionDialog.statu === 0) {
      page.selectionDialog.statu = 1;
      var name = res.currentTarget.dataset.name;
      var select = selectionDialog.itemSelect.get(name);
      select();
      setTimeout(function () {
        page.selectionDialog.statu = 0
      }, 600)
    }
  }
  return selectionDialog;
};
function createPageLoading(page) {
  if (page.pageLoadingDialog) {
    return page.pageLoadingDialog;
  }
  var pageLoadingDialog = new Object();
  pageLoadingDialog.visible = false;
  pageLoadingDialog.text = "",
    pageLoadingDialog.show = function () {
      page.setData({
        // 'pageLoadingDialog.text': text,
        'pageLoadingDialog.visible': true,
      })
    }
  pageLoadingDialog.hide = function () {
    page.setData({
      'pageLoadingDialog.visible': false,
    })
  }
  page.pageLoadingDialog = pageLoadingDialog;
  return pageLoadingDialog;
}
function createPageLoadingError(page) {
  if (page.pageLoadingDialogError) {
    return page.pageLoadingDialogError;
  }
  var pageLoadingDialogError = new Object();
  pageLoadingDialogError.visible = false;
  pageLoadingDialogError.text = "",
    pageLoadingDialogError.show = function () {
      page.setData({
        // 'pageLoadingDialogError.text': text,
        'pageLoadingDialogError.visible': true,
      })
    }
  pageLoadingDialogError.hide = function () {
    page.setData({
      'pageLoadingDialogError.visible': false,
    })
  }
  page.pageLoadingDialogError = pageLoadingDialogError;
  return pageLoadingDialogError;

}
function createLabelLoading(page) {
  if (page.labelLoadingDialog) {
    return page.labelLoadingDialog;
  }
  var labelLoadingDialog = new Object();
  labelLoadingDialog.visible = false;
  labelLoadingDialog.show = function () {

    page.setData({
      'labelLoadingDialog.visible': true,
    })
  }
  labelLoadingDialog.hide = function () {


    page.setData({
      'labelLoadingDialog.visible': false,
    })
  }
  page.labelLoadingDialog = labelLoadingDialog;
  return labelLoadingDialog;
}
function createLabelLoadingError(page) {
  if (page.labelLoadingDialogError) {
    return page.labelLoadingDialogError;
  }
  var labelLoadingDialogError = new Object();
  labelLoadingDialogError.visible = false;
  labelLoadingDialogError.show = function () {
    page.setData({
      'labelLoadingDialogError.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'labelLoadingDialogError.visible': false,
      })
    }, 1000)
  }
  page.labelLoadingDialogError = labelLoadingDialogError;
  return labelLoadingDialogError;
}
function createLabelLoadingSuccess(page) {

  if (page.labelLoadingDialogSuccess) {
    return page.labelLoadingDialogSuccess;
  }
  var labelLoadingDialogSuccess = new Object();
  labelLoadingDialogSuccess.visible = false;
  labelLoadingDialogSuccess.show = function () {
    page.setData({
      'labelLoadingDialogSuccess.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'labelLoadingDialogSuccess.visible': false,
      })
    }, 2000)
  }
  page.labelLoadingDialogSuccess = labelLoadingDialogSuccess;
  return labelLoadingDialogSuccess;

}
//文字图片编辑页面
//要统计失败率和成功率。
function createEditImageDialog(page) {
  if (page.editImageDialog) {
    return page.editImageDialog;
  }
  var editImageDialog = new Object();

  editImageDialog.width = (wx.getSystemInfoSync().windowWidth - 20 - 10) / 3.0;
  editImageDialog.success = function () { }

  editImageDialog.setDialog = function (_dialog_title, _default_edit_text, _max_images, confirm,success,fail) {
    editImageDialog.success = success;
    editImageDialog.confirm = confirm;
    editImageDialog.fail = fail;
    //初始化
    page.setData({
      'editImageDialog.images': new Array(),
      'editImageDialog.left':50,
      'editImageDialog.text': '',
      'editImageDialog.width': editImageDialog.width,
      'editImageDialog._dialog_title': _dialog_title,
      'editImageDialog._default_edit_text': _default_edit_text,
      'editImageDialog._max_images': _max_images,
      'editImageDialog.visible': false,
    })

    return editImageDialog;
  }

  editImageDialog.show = function () {
    wx.chooseImage({
      count: page.data.editImageDialog._max_images > 9 ? 9 : page.data.editImageDialog._max_images,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        page.setData({
          'editImageDialog.images': res.tempFilePaths,
          "editImageDialog.text": "",
          'editImageDialog.visible': true,
        })
      },
    })
  }
  editImageDialog.hide = function () {
    page.setData({
      'editImageDialog': {},
      "editImageDialog.text":"",
      'editImageDialog.visible': false,
    })
  }
  //-----------------------------page---------------------------------------

  page.editImageDialog = editImageDialog;


  page._editImageDialog_selectImgs = function () {

    wx.chooseImage({
      count: page.data.editImageDialog._max_images > 9 ? 9 : page.data.editImageDialog._max_images,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        var length = page.data.editImageDialog.images.length + res.tempFilePaths.length;
        if (length > page.data.editImageDialog._max_images) {
          wx.showToast({
            title: '图片数量超限...',
          })
          return;
        }
        var imgs = page.data.editImageDialog.images.concat(res.tempFilePaths);
        page.setData({
          'editImageDialog.images': imgs,
        })
      },
    })
  };
  //确认发布
  page._editImageDialog_confirm = function () {
    login.getUser(function (user) {
      page.setData({
        'editImageDialog.visible': false,
      })
      editImageDialog.confirm();
      upload.uploadImages2(user.userId, "userUpload", page.data.editImageDialog.images, page,
        function (urls) {
          console.log("图片集合", urls);

          page.editImageDialog.success(page.data.editImageDialog.text, urls);
          // createLabelLoading(page).hide();
          // createLabelLoadingSuccess(page).show();
        },
        function () {
          showTip("发布失败......");
          page.editImageDialog.fail();
        });
    
    })
  };

  page._editImageDialog_cancelUpload = function () {
    page.setData({
      'editImageDialog.uploadIndex': 0
    })
    tip.showContentTip("上传终止")
  }
  page._editImageDialog_remove = function (res) {

    var index = parseInt(res.currentTarget.dataset.index);
    page.data.editImageDialog.images.splice(index, 1);

    page.setData({
      'editImageDialog.images': page.data.editImageDialog.images,
    })
  };
  page._editImageDialog_change = function (res) {

    var index = parseInt(res.currentTarget.dataset.index);

    wx.chooseImage({
      count:1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        page.data.editImageDialog.images.splice(index,1,res.tempFilePaths[0]);
        page.setData({
          'editImageDialog.images': page.data.editImageDialog.images,
        })
      },
    })

    // page.setData({
    //   'editImageDialog.images': page.data.editImageDialog.images,
    // })
  };
  page._editImageDialog_input = function (res) {
    var value = res.detail.value;
    var left = 50 - value.length;
    page.setData({
      'editImageDialog.left': left,
    })
    page.data.editImageDialog.text = value;
  };
  page._editImageDialog_closeEdit = function () {

    page.editImageDialog.hide();
  };
  return editImageDialog;

}


//文本编辑的窗口
function createEditTextDialog(page) {
  if (page.editTextDialog) {
    return page.editTextDialog;
  }
  var editTextDialog = new Object();
  editTextDialog._confirm = function () { }


  editTextDialog.show = function (_title, _placeholder,_text, _max_length, _confirm) {
    editTextDialog._confirm = _confirm;
    page.setData({
      "editTextDialog.title": _title,
      "editTextDialog.placeholder": _placeholder,
      "editTextDialog.maxLength": _max_length,
      "editTextDialog.text": _text,
      "editTextDialog.visible": true
    })

  }
  editTextDialog.hide = function () {
    page.setData({
      "editTextDialog": {},
      // 'editTextDialog.title': '编辑',
      // 'editTextDialog.placeholder': '编辑',
      // 'editTextDialog.maxLength': 20,
      // 'editTextDialog.text': "",
    })

  }


  page._editTextDialog_close = function () {
    page.editTextDialog.hide();
  }
  page._editTextDialog_input = function (res) {
    var value = res.detail.value;
    if (value.length > page.data.editTextDialog.maxLength) {
      showTip("内容超出长度");
      // return;
    }
    page.setData({
      'editTextDialog.text': value
    })
  }
  page._editTextDialog_confirm = function () {
    var tempText = page.data.editTextDialog.text
    if (tempText.length > page.data.editTextDialog.maxLength) {
      showTip("内容超出长度");
      return;
    }
    page.editTextDialog.hide();
    page.editTextDialog._confirm(tempText);
  }


  page.editTextDialog = editTextDialog;
  return editTextDialog;








}
//短文本编辑窗口  例如 修改用户名等...
function createShortTextDialog(page) {
  if (page.shortTextDialog) {
    return page.shortTextDialog;
  }
  var shortTextDialog = new Object();
  shortTextDialog.confirm = function () { }
  shortTextDialog.show = function (title, maxLength,text, confirm) {
    shortTextDialog.confirm = confirm;
    page.setData({
      'shortTextDialog.maxLength': maxLength,
      "shortTextDialog.title": title,
      "shortTextDialog.text": text,
      'shortTextDialog.visible': true,
    })
  }
  shortTextDialog.hide = function () {
    page.setData({
      'shortTextDialog.visible': false,
      'shortTextDialog.maxLength': 0,
      "shortTextDialog.title": '标题',

    })
  }



  page._shortTextDialog_close = function () {
    page.shortTextDialog.hide();
  }
  page._shortTextDialog_confirm = function () {
    if (page.data.shortTextDialog.text.length === 0) {
      return;
    }
    var value = page.data.shortTextDialog.text;
    page.shortTextDialog.confirm(value);
    page.shortTextDialog.hide();
  }
  page._shortTextDialog_input = function (res) {
    var value = res.detail.value;
    page.setData({
      "shortTextDialog.text": value,
    })
  }
  page.shortTextDialog = shortTextDialog;
  return shortTextDialog;
}

//数字编辑框
function createEditNumberDialog(page) {
  if (page.editNumberDialog) {
    return page.editNumberDialog;
  }
  var editNumberDialog = new Object();
  editNumberDialog.confirm = function () { }
  editNumberDialog.show = function (title, maxLength,text, confirm) {
    editNumberDialog.confirm = confirm;
    page.setData({
      'editNumberDialog.maxLength': maxLength,
      "editNumberDialog.title": title,
      "editNumberDialog.text": "",
      'editNumberDialog.visible': true,
    })
  }
  editNumberDialog.hide = function () {
    page.setData({
      'editNumberDialog.visible': false,
      'editNumberDialog.maxLength': 0,
      "editNumberDialog.title": '标题',

    })
  }



  page._editNumberDialog_close = function () {
    page.editNumberDialog.hide();
  }
  page._editNumberDialog_confirm = function () {
    if (page.data.editNumberDialog.text.length === 0) {
      return;
    }
    var value = page.data.editNumberDialog.text;
    page.editNumberDialog.confirm(value);
    page.editNumberDialog.hide();
  }
  page._editNumberDialog_input = function (res) {
    var value = res.detail.value;
    page.setData({
      "editNumberDialog.text": value,
    })
  }
  page.editNumberDialog = editNumberDialog;
  return editNumberDialog;
}

//可下载的图片
function createDownloadImageDialog(page) {
  if (page.downloadImageDialog) {
    return page.downloadImageDialog;
  }
  var downloadImageDialog = new Object();

  downloadImageDialog.show = function (title, subTitle, imageUrl) {
    page.setData({
      'downloadImageDialog.title': title,
      'downloadImageDialog.subTitle': subTitle,
      'downloadImageDialog._image': imageUrl,
      'downloadImageDialog.visible': true
    })
  }
  downloadImageDialog.hide = function () {
    page.setData({
      'downloadImageDialog.title': '标题',
      'downloadImageDialog.subTitle': "副标题",
      'downloadImageDialog._image': "",
      'downloadImageDialog.visible': false
    })
  }
  page._downloadImageDialog_close = function () {
    page.downloadImageDialog.hide();
  }
  page._downloadImageDialog_save = function (res) {
    var imgSrc = res.currentTarget.dataset.url;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
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
      }
    })
  }
  page.getInfo = function () {
    // wx.scanCode({
    //   success(res) {
    //     console.log(res)
    //     wx.navigateTo({
    //       url: res.result,
    //     })
    //   }
    // })
    wx.previewImage({
      urls: [page.data.downloadImageDialog._image],
    })


  }
  page.downloadImageDialog = downloadImageDialog;
  return downloadImageDialog;


}

//可上传图片
function createUploadImageDialog(page) {
  if (page.uploadImageDialog) {
    return page.uploadImageDialog;
  }
  var uploadImageDialog = new Object();
  uploadImageDialog.success = function(url){}
  uploadImageDialog.show = function (title, subTitle, imageUrl, successCallBack) {
    uploadImageDialog.success = successCallBack;
    page.setData({
      'uploadImageDialog.title': title,
      'uploadImageDialog.subTitle': subTitle,
      'uploadImageDialog._image': imageUrl,
      'uploadImageDialog.visible': true
    })
  }
  uploadImageDialog.hide = function () {
    page.setData({
      'uploadImageDialog.title': '标题',
      'uploadImageDialog.subTitle': "副标题",
      'uploadImageDialog._image': "",
      'uploadImageDialog.visible': false
    })
  }
  page._uploadImageDialog_close = function () {
    page.uploadImageDialog.hide();
  }
  //上传图片
  page._uploadImageDialog_save = function (res) {
    login.getUser(function(user){
      upload.uploadImages1(user.userId, 1, "Upload", function(files){
        wx.hideLoading();
        page.setData({
          'uploadImageDialog._image':files[0]
        })

      },function(){
        createLabelLoadingError(page).show();

      });
    })
     




  }
  page._uploadImageDialog_confirm = function(res){
    var url = res.currentTarget.dataset.url;
    uploadImageDialog.hide();
    uploadImageDialog.success(url);
  }
  page.getInfo = function () {
    wx.previewImage({
      urls: [page.data.uploadImageDialog._image],
    })
  }
  page.uploadImageDialog = uploadImageDialog;
  return uploadImageDialog;


}

//创建订单
function createOrderDialog(page){

  if (page.orderDialog) {
    return page.orderDialog;
  }
  var orderDialog = new Object();

  orderDialog.show = function (orderInfo) {

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#00658d',
    })
    page.setData({
      'orderDialog.visible': true
    })
    var num = 10;
    page.setData({ 'orderDialog.height': '20%' });

    page.setData({ 'orderDialog.height': '40%' });

    page.setData({ 'orderDialog.height': 'auto' });

    page.setData({
      'orderDialog.orderInfo': orderInfo,
    })


  }
  orderDialog.hide = function () {

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    page.setData({
      'orderDialog.orderInfo': {},

    })
    page.setData({ 'orderDialog.height': '40%' });

    page.setData({ 'orderDialog.height': '20%' });

    page.setData({ 'orderDialog.height': '0%' });
    page.setData({
      'orderDialog.visible': false
    })
  }
  page._orderDialog_close = function () {
    page.orderDialog.hide();
  }
  page._orderDialog_changeCashier = function(e){
    page.orderDialog.hide();
    var orderId = e.currentTarget.dataset.orderid;
    login.getUser(function(user){
      createChooseDialog(page).show(request.url.selectCashier, { orderId: orderId, userId: user.userId }, function (cashier) {

        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (order) {
          createChooseDialog(page).hide();
          page.orderDialog.show(order);
        })
        httpClient.send(request.url.confirmCashier, "GET", { orderId: orderId, userId: user.userId, cashierId: cashier.userId });

      });
    })



    // var orderId = e.currentTarget.dataset.orderid;
    // var httpClient = createHttpClient(page);
    // httpClient.setMode("label", true);
    // httpClient.addHandler("orderInfo", function (orderInfo) {
    //   page.orderDialog.show(orderInfo);
    // })
    // httpClient.send(request.url.changeCashier, "GET", { orderId: orderId });





  }
  
  page._orderDialog_createOrder = function (e) {

    var orderId = e.currentTarget.dataset.orderid;
    var httpClient = createHttpClient(this);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (orderId) {
      page.orderDialog.hide();
      redirect.goTo("/pages/dynamic/queryOrder/queryOrder?orderId=" + orderId);
    })
    httpClient.send(request.url.createOrder, "GET", { orderId: orderId });
  }



  page.orderDialog = orderDialog;
  return orderDialog;


}


//列表选择框
function createChooseDialog(page) {

  if (page.chooseDialog) 
  {
    return page.chooseDialog;
  }
  var chooseDialog = new Object();
  chooseDialog.args = {},
  chooseDialog.url = "",
  chooseDialog.successCallBack = function(){}


  
  chooseDialog.show = function (url,args,successCallback) {
    chooseDialog.url = url;
    chooseDialog.args = args;
    chooseDialog.successCallBack = successCallback;

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#61616180',
    })

    args.page = 1;
    var httpClient = createHttpClient(page);
    httpClient.setMode("", false);
    httpClient.addHandler("success", function (data) {

        page.setData({
          'chooseDialog.domain': data,
        })

        // 没有更多数据了
        if (data.datas.length < 20) {
          page.setData({
            'chooseDialog.statu': 2,
          })
        }
        else{
          page.setData({
            'chooseDialog.statu': 1,
          })
        }

    })


    // 显示 弹出列表框
    page.setData({
      'chooseDialog.visible': true,
      'chooseDialog.statu': 1,
    })
    page.setData({ 'chooseDialog.height': 10 });
    page.setData({ 'chooseDialog.height': 20 });
    page.setData({ 'chooseDialog.height': 30 });
    page.setData({ 'chooseDialog.height': 40 });
    page.setData({ 'chooseDialog.height': 50 });
    page.setData({ 'chooseDialog.height': 60 });
    page.setData({ 'chooseDialog.height': 70 });
    page.setData({ 'chooseDialog.height': 80 });
    page.setData({ 'chooseDialog.height': 90 });    



    httpClient.send(url, "GET", args);



    
  }
  chooseDialog.hide = function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })

    var num = 10;
    page.setData({
      'chooseDialog.domain': {},
    })
    page.setData({ 'chooseDialog.height': 90 });
    page.setData({ 'chooseDialog.height': 80 });
    page.setData({ 'chooseDialog.height': 70 });
    page.setData({ 'chooseDialog.height': 60 });
    page.setData({ 'chooseDialog.height': 50 });
    page.setData({ 'chooseDialog.height': 40 });
    page.setData({ 'chooseDialog.height': 30 });
    page.setData({ 'chooseDialog.height': 20 });
    page.setData({ 'chooseDialog.height': 10 });
    page.setData({ 'chooseDialog.height': 0 });
    page.setData({
      'chooseDialog.visible': false,
    })
  }
  page._chooseDialog_close = function () {
    chooseDialog.hide();
  }
  page._chooseDialog_select = function(e){
    var item = e.currentTarget.dataset.item;
    chooseDialog.successCallBack(item);
  }
  page.nextPage = function () {
    if (page.data.chooseDialog.statu === 2) {
      //没有更多数据了，返回
      return;
    }
    
    chooseDialog.args.page = chooseDialog.args.page + 1
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (data) {
      var newData = page.data.chooseDialog.domain.datas.concat(data.datas);
      page.setData({
        'chooseDialog.domain.datas': newData,
      })


      // 没有更多数据了
      if (data.datas.length < 20) {
        page.setData({
          'chooseDialog.statu': 2,
        })
      }

    })
    httpClient.send(chooseDialog.url, "GET", chooseDialog.args);
  }
  page._chooseDialog_user_detail = function(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/user/userPage/userPage?userId=' + item.userId,
    })
  }
  page._chooseDialog_location_detail = function (e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url:"/pages/location/detail/detail?locationId=" + item.locationId
    })
  }
  page._makePhone = function(e){
    var phones = e.currentTarget.dataset.numbers;
    if(phones.length > 0){
      createPhoneCallDialog(page).show(phones);
    }
    
  }
  page.oper = function(e) {
    var index = e.currentTarget.dataset.index;
    var member = e.currentTarget.dataset.member;
    var oper = parseInt(e.currentTarget.dataset.oper);
    if (oper === 1) { //同意
      var httpClient = createHttpClient(this);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (joiner) {

        var key = 'chooseDialog.domain.datas[' + index + ']'
        page.setData({
          [key]: joiner
        })

      })
      httpClient.send(request.url.joinerApprove, "GET", { orgId: member.orgId, joinerId: member.user.userId });
    }
    if (oper === 2) { //拒绝
      var httpClient = createHttpClient(this);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (joiner) {
        var key = 'chooseDialog.domain.datas[' + index + ']'
        page.setData({
          [key]: joiner
        })


      })
      httpClient.send(request.url.joinerDisapprove, "GET", { orgId: member.orgId, joinerId: member.user.userId });
    }

  }
  page.goToOrg = function (e) {
    var org = e.currentTarget.dataset.org;
    createChooseDialog(page).hide();
    createOrgDialog(page).show(org);
    // wx.navigateTo({
    //   url: '/pages/org/singleOrg/singleOrg?orgId=' + orgId,
    // })
  }
  page.catchReturn = function(){}
  page.chooseDialog = chooseDialog;
  return chooseDialog;
}


//电话
function createPhoneCallDialog(page) {

  if (page.phoneCallDialog) {
    return page.phoneCallDialog;
  }
  var phoneCallDialog = new Object();

  phoneCallDialog.show = function (phoneNumbers) {
    page.setData({
      'phoneCallDialog.phoneNumbers': phoneNumbers,
      'phoneCallDialog.visible': true
    })
  }
  phoneCallDialog.hide = function () {
    page.setData({
      'phoneCallDialog.visible': false
    })
  }
  page._phoneCallDialog_close = function () {
    phoneCallDialog.hide();
  }

  page._makePhoneCall = function (e) {
    var phone = e.currentTarget.dataset.phone;
    phoneCallDialog.hide();
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }

  page.phoneCallDialog = phoneCallDialog;
  return phoneCallDialog;
}

//创建OrgDialog
function createOrgDialog(page) {

  if (page.orgDialog) {
    return page.orgDialog;
  }
  var orgDialog = new Object();

  orgDialog.show = function (org) {

     wx.setNavigationBarColor({
       frontColor: '#ffffff',
       backgroundColor: '#282828cc',
     })
    
    page.setData({
      'orgDialog.visible': true,
      'orgDialog.org': org,
    })


  }
  orgDialog.hide = function () {

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })

    page.setData({
      'orgDialog.org': {},

    })
    page.setData({ 'orgDialog.height': '40%' });

    page.setData({ 'orgDialog.height': '20%' });

    page.setData({ 'orgDialog.height': '0%' });
    page.setData({
      'orgDialog.visible': false
    })
  }
  page._orgDialog_close = function () {
    page.orgDialog.hide();
  }




  page.orgDialog = orgDialog;
  return orgDialog;


}


//创建operDialog
function createOperDialog(page) {

  if (page.operDialog) {
    return page.operDialog;
  }
  var operDialog = new Object();

  operDialog.show = function (operDomain) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#5e5e5eb3',
    })
    page.setData({
      'operDialog.visible': true,
      'operDialog.operDomain': operDomain
    })


  }
  operDialog.hide = function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    page.setData({
      'operDialog.visible': false,
    })

  }
  page._operDialog_close = function () {
    page.operDialog.hide();
  }
  
  page._oper_click = function(e){

    var operSwitch = e.currentTarget.dataset.operswitch
    if(!operSwitch){return;}
    var id = e.currentTarget.dataset.id;
    var operId = e.currentTarget.dataset.operid;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function (order) {
      login.getUser(function(user){});
    })
    httpClient.addHandler("feeOrderInfo",function(order){
        operDialog.hide();
        createOrderDialog(page).show(order);
    })
    httpClient.addHandler("inivteOrders", function (){
      operDialog.hide();
      var user = wx.getStorageSync("user");
      createChooseDialog(page).show(request.url.inviteOrders,{inviteId:id,userId:user.userId},function(order){
      });
    })
    httpClient.addHandler("joinUserList", function (order) {
      operDialog.hide();
      createChooseDialog(page).show(request.url.joinUserList, { inviteId: id}, function () { });
    })
    httpClient.addHandler("cancelInvite", function () {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (inviteId) {
      
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (data) {
          createOperDialog(page).show(data);
        })
        httpClient.send(request.url.opers, "GET", { inviteId: inviteId });
      })
      httpClient.send(request.url.cancelInvite, "GET", { inviteId: id });
    })
    httpClient.addHandler("finishInvite", function () {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (inviteId) {
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (data) {
          createOperDialog(page).show(data);
        })
        httpClient.send(request.url.opers, "GET", { inviteId: inviteId });
      })
      httpClient.send(request.url.finishInvite, "GET", { inviteId: id });
    })
    httpClient.addHandler("albums", function () {
      operDialog.hide();
      login.getUser(function (user) {
          createChooseDialog(page).show(request.url.inviteAlbums, { inviteId: id, userId: user.userId }, function (order) {
        });
      })
    })
    // 上线联谊
    httpClient.addHandler("onLineInvite", function () {
      operDialog.hide();
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (inviteId) {
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (data) {
          createOperDialog(page).show(data);
        })
        httpClient.send(request.url.opers, "GET", { inviteId: inviteId });
      })
      httpClient.send(request.url.onLineInvite, "GET", { inviteId: id });
    })
    httpClient.addHandler("follow", function () {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (inviteId) {
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (data) {
          createOperDialog(page).show(data);
        })
        httpClient.send(request.url.opers, "GET", { inviteId: inviteId });
      })
      httpClient.send(request.url.likeInvite, "GET", { inviteId: id });
    })
    httpClient.addHandler("disFollow", function () {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (inviteId) {
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (data) {
          createOperDialog(page).show(data);
        })
        httpClient.send(request.url.opers, "GET", { inviteId: inviteId });
      })
      httpClient.send(request.url.disLikeInvite, "GET", { inviteId: id });
    })
    
    httpClient.addHandler("createInviteOrder", function () {
      operDialog.hide();
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      // 显示创建订单
      httpClient.addHandler("orderInfo", function (orderInfo) {
        createOrderDialog(page).show(orderInfo);
      })
      httpClient.send(request.url.joinInvite, "GET", { inviteId: id });
    })

    httpClient.addHandler("joinerOrgs", function () {
      operDialog.hide();
      createChooseDialog(page).show(request.url.apply2Orders, { inviteId: id }, function (org) {
        operDialog.hide();
        createChooseDialog(page).hide();
        createOperateDialog(page).show("选择联谊团体", org.school.schoolName + "-" + org.orgName, function () {

          var httpClient = createHttpClient(page);
          httpClient.setMode("label", true);
          httpClient.send(request.url.setInvitorOrg, "GET", { inviteId:id,orgId: org.orgId });

        }, function () { });




 
      });
    })

    httpClient.addHandler("certificate", function () {
      operDialog.hide();
      createOperateDialog(page).show("需要认证校园用户","点击确定前往认证中心...",function(){
        wx.navigateTo({
          url: '/pages/share/certificate/certificate',
        })
      },function(){});



    })

    httpClient.addHandler("createOrg", function () {
        operDialog.hide();
        createOperateDialog(page).show("创建团体","校园联谊需要创建校园团体申请",function(){
          createEditTextDialog(page).show("团体名称", "例如:自动化学院 测控技术与仪器5班","", 50, function(text){
              wx.setStorageSync("orgName", text);
              createChooseDialog(page).show(request.url.orgLevels, {}, function (orgLevel) {
                  createChooseDialog(page).hide();
                  var httpClient = createHttpClient(page);
                  httpClient.setMode("label", true);
                  httpClient.addHandler("showOrg",function(org){
                      createOrgDialog(page).show(org);

                  })
                  var orgName = wx.getStorageSync("orgName")
                  httpClient.send(request.url.createJoinerOrg, "GET", { inviteId: id, orgName: orgName, orgLevelCode: orgLevel.levelCode });
              });




          })
          
        },function(){});



    })
    
    httpClient.addHandler("showOrg", function (org) {
      operDialog.hide();
      createOrgDialog(page).show(org);
    })
    httpClient.addHandler("success", function (org) {
      operDialog.hide();
    })
    var user = wx.getStorageSync("user");
    httpClient.send(request.url.operClick, "GET", { inviteId: id, operId: operId ,userId:user.userId});


  }

  page.operDialog = operDialog;
  return operDialog;


}

//创建feeDialog
function createFeeDialog(page) {

  if (page.feeDialog) {
    return page.feeDialog;
  }
  var feeDialog = new Object();

  feeDialog.show = function (fee) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#5e5e5eb3',
    })
    page.setData({
      'feeDialog.visible': true,
      'feeDialog.fee': fee
    })


  }
  feeDialog.hide = function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    page.setData({
      'feeDialog.visible': false,
    })

  }
  page._feeDialog_close = function () {
    page.feeDialog.hide();
  }




  page.feeDialog = feeDialog;
  return feeDialog;


}

//创建feeDialog
function createFinanceDialog(page) {

  if (page.financeDialog) {
    return page.financeDialog;
  }
  var financeDialog = new Object();

  financeDialog.show = function (finance) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#5e5e5eb3',
    })
    page.setData({
      'financeDialog.visible': true,
      'financeDialog.finance': finance
    })


  }
  financeDialog.hide = function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    page.setData({
      'financeDialog.visible': false,
    })

  }
  page._financeDialog_close = function () {
    page.financeDialog.hide();
  }




  page.financeDialog = financeDialog;
  return financeDialog;


}
//创建成员页面
function createMemberDialog(page) {

  if (page.memberDialog) {
    return page.memberDialog;
  }
  var memberDialog = new Object();

  memberDialog.show = function (members) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#5e5e5eb3',
    })
    page.setData({
      'memberDialog.visible': true,
      'memberDialog.members': members
    })


  }
  memberDialog.hide = function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    page.setData({
      'memberDialog.visible': false,
    })

  }
  page._memberDialog_close = function () {
    page.memberDialog.hide();
  }

  page.memberDialog = memberDialog;
  return memberDialog;


}











//Http发射器
function createHttpClient(page) {
  var httpClient = new Object();
  //label,page,
  httpClient.loadingMode = "",
  httpClient.isNeedUser = false;
  httpClient.codeHandlers = new Map();

  httpClient.setMode = function (loadingMode, isNeedUser) {
    httpClient.loadingMode = loadingMode,
      httpClient.isNeedUser = isNeedUser;
    return httpClient;
  }
  httpClient.addHandler = function (code, handler) {
    httpClient.codeHandlers.set(code, handler)
    return httpClient;
  }
  httpClient.send = function (url, method, args) {

    if (httpClient.isNeedUser) {
      login.getUser(function (user) {
        page.setData({
          user:user
        })

        args.userId = user.userId;
        httpClient.doSend(url, method, args);
      })
    }
    else {

      httpClient.doSend(url, method, args);
    }
    return httpClient;
  }
  httpClient.doSend = function (url, method, args) {
    if (page.httpStatus.get(url)) {
      return;
    }
    page.httpStatus.set(url, "on");

    if (httpClient.loadingMode === "label") { createLabelLoading(page).show(); }
    else if (httpClient.loadingMode === "page") { createPageLoading(page).show(); }
    else { }

    wx.request({
      url: url,
      method: method,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: args,
      success: function (res) {
        if (res.statusCode === 200) {
          httpClient.resultProcess(res.data);
        }
        else {
          createTipDialog(page).show("error", "服务异常  状态码:" + res.statusCode);
        }
      },
      fail: function () {


        if (httpClient.loadingMode === "label") { createLabelLoadingError(page).show(); }
        else if (httpClient.loadingMode === "page") { createPageLoadingError(page).show(); }
        else { }
      },
      complete: function () {
        page.httpStatus.delete(url);
        if (httpClient.loadingMode === "label") { createLabelLoading(page).hide(); }
        else if (httpClient.loadingMode === "page") { createPageLoading(page).hide(); }
        else { }
      }
    })
  }
  httpClient.resultProcess = function (data) {
    if (data._action_type === 0) {
      createDialog(page).show(data._0_title, data._0_message);
    }
    else if (data._action_type === 1) {
      createTipDialog(page).show(data._1_message_level, data._1_message);
    }
    else if (data._action_type === 2) {
      httpClient.dataSet(data._2_data_sets)
    }
    else if (data._action_type === 3) {
      httpClient.navigateResponseUrl(data._3_url, data._3_isneed_userId)
    }
    else if (data._action_type === 4) {
      httpClient.handleResponse(data._4_handler_name, data._4_data)
    }
    else {
        if (httpClient.loadingMode === "label") { createLabelLoadingError(page).show(); }
        else if (httpClient.loadingMode === "page") { createPageLoadingError(page).show(); }
        else { }
        // createTipDialog(page).show("warn", "服务端异常");
    }
  }
  httpClient.dataSet = function (datas) {
    for (var i = 0; i < datas.length; i++) {
      var key = datas[i].key;
      var data = datas[i].data;
      page.setData({
        [key]: data,
      })
    }
  }
  httpClient.navigateResponseUrl = function (pageUrl, isNeedUserId) {
    if (isNeedUserId) {
      var newUrl = pageUrl;
      login.getUser(function (user) {
        var userId = user.userId;
        if (pageUrl.indexOf("?") === -1) {
          newUrl = pageUrl + "?userId=" + userId;
        }
        else {
          newUrl = pageUrl + "&userId=" + userId;
        }
        redirect.goTo(newUrl);
      })
    }
    else {
      redirect.goTo(pageUrl);
    }
  }
  httpClient.handleResponse = function (handlerName, data) {
    var handler = httpClient.codeHandlers.get(handlerName);
    if (handler) {
      handler(data);
    }
    else {
      createDialog(page).show("请求处理", "请求响应未找到对应的处理器: 处理器名称=" + handlerName)
    }
  }
  if (!page.httpStatus) {
    page.httpStatus = new Map();
  }

  return httpClient;
}
function pageInitLoading(page){
    // 请求
    var data_url = wx.getStorageSync("page_data_url")
    wx.removeStorageSync("page_data_url");
    var data_args = wx.getStorageSync("page_data_args")
    wx.removeStorageSync("page_data_args");
    var data_isNeedUser = wx.getStorageSync("page_data_isNeedUser")
    wx.removeStorageSync("page_data_isNeedUser");



    var list_url = wx.getStorageSync("page_list_url")
    wx.removeStorageSync("page_list_url");
    var list_args = wx.getStorageSync("page_list_args")
    wx.removeStorageSync("page_list_args");
    var list_isNeedUser = wx.getStorageSync("page_list_isNeedUser")
    wx.removeStorageSync("page_list_isNeedUser");

    page.data.data_url = data_url;
    page.data.data_args = data_args;
    page.data.data_isNeedUser = data_isNeedUser; 
    page.data.data={},

    page.data.list_url = list_url;
    page.data.list_args = list_args;
    page.data.list_isNeedUser = list_isNeedUser;
    page.data.items = new Array();
    page.data.noMore = false;
    page.data.list_num = 0;

    page.onReachBottom = function(){
        page.queryListData();
    };

    page.queryListData = function(){
        var httpClient = createHttpClient(page);
        
        if (page.data.list_num === 0) 
        {
          httpClient.setMode("page", page.data.list_isNeedUser);
        } else {
          httpClient.setMode("label", page.data.list_isNeedUser);
        }

        httpClient.addHandler("success", function (data) {
          var newItems = page.data.items.concat(data);
          page.setData({
            items: newItems,
            list_num: page.data.list_num + 1
          })
          if (data.length < 30) {
            page.setData({
              noMore: true
            })
          }
        })
        page.data.list_args.page = page.data.list_num;
        httpClient.send(page.data.list_url, "GET",  page.data.list_args);
    };
    if(list_url)
    {
        page.queryListData();    
        if(data_url){
          var httpClient2 = createHttpClient(page);
          httpClient2.setMode("", data_isNeedUser);
          httpClient2.send(data_url, "GET", data_args);
        }


        
    }
    else
    {
        if (data_url) {
          var httpClient2 = createHttpClient(page);
          httpClient2.setMode("page", data_isNeedUser);
          httpClient2.send(data_url, "GET", data_args);
        }

    }

}


// 初始化頁面
function pageInit(page) {
  // 请求
  var data_url = wx.getStorageSync("page_data_url")
  wx.removeStorageSync("page_data_url");
  var data_args = wx.getStorageSync("page_data_args")
  wx.removeStorageSync("page_data_args");
  var data_isNeedUser = wx.getStorageSync("page_data_isNeedUser")
  wx.removeStorageSync("page_data_isNeedUser");



  var list_url = wx.getStorageSync("page_list_url")
  wx.removeStorageSync("page_list_url");
  var list_args = wx.getStorageSync("page_list_args")
  wx.removeStorageSync("page_list_args");
  var list_isNeedUser = wx.getStorageSync("page_list_isNeedUser")
  wx.removeStorageSync("page_list_isNeedUser");

  page.data.data_url = data_url;
  page.data.data_args = data_args;
  page.data.data_isNeedUser = data_isNeedUser;
  page.data.data = {},

    page.data.list_url = list_url;
  page.data.list_args = list_args;
  page.data.list_isNeedUser = list_isNeedUser;
  page.data.items = new Array();
  page.data.noMore = false;
  page.data.list_num = 0;

  page.onReachBottom = function () {
    page.queryListData();
  };

  page.queryListData = function () {
    var httpClient = createHttpClient(page);

    if (page.data.list_num === 0) {
      httpClient.setMode("page", page.data.list_isNeedUser);
    } else {
      httpClient.setMode("label", page.data.list_isNeedUser);
    }

    httpClient.addHandler("success", function (data) {
      var newItems = page.data.items.concat(data);
      page.setData({
        items: newItems,
        list_num: page.data.list_num + 1
      })
      if (data.length < 30) {
        page.setData({
          noMore: true
        })
      }
    })
    page.data.list_args.page = page.data.list_num;
    httpClient.send(page.data.list_url, "GET", page.data.list_args);
  };
  if (list_url) {
    page.queryListData();
    if (data_url) {
      var httpClient2 = createHttpClient(page);
      httpClient2.setMode("", data_isNeedUser);
      httpClient2.send(data_url, "GET", data_args);
    }



  }
  else {
    if (data_url) {
      var httpClient2 = createHttpClient(page);
      httpClient2.setMode("page", data_isNeedUser);
      httpClient2.send(data_url, "GET", data_args);
    }

  }

}



function createSinglePostDialog(page) {
  if (page.singlePostDialog) {
    return page.singlePostDialog;
  }
  var singlePostDialog = new Object();
  singlePostDialog.success = function(post){}

  singlePostDialog.show = function (post, successFunc) {
    singlePostDialog.success = successFunc;
    page.setData({
      'singlePostDialog.visible': true,
      'singlePostDialog.post': post,
    })

    page.setData({ 'singlePostDialog.left': '-77' });
    page.setData({ 'singlePostDialog.left': '-67' });
    page.setData({ 'singlePostDialog.left': '-57' });
    page.setData({ 'singlePostDialog.left': '-47' });
    page.setData({ 'singlePostDialog.left': '-37' });
    page.setData({ 'singlePostDialog.left': '-27' });
    page.setData({ 'singlePostDialog.left': '-17' });
    page.setData({ 'singlePostDialog.left': '-7' });
    page.setData({ 'singlePostDialog.left': '3' });
  }
  singlePostDialog.hide = function () {
    page.setData({ 'singlePostDialog.left': '-17' });
    page.setData({ 'singlePostDialog.left': '-37' });
    page.setData({ 'singlePostDialog.left': '-57' });
    page.setData({ 'singlePostDialog.left': '-77' });
    page.setData({ 'singlePostDialog.left': '-90' });
    page.setData({
      'singlePostDialog': {},
    })
  }

  //-----------------------------page---------------------------------------
  page.singlePostDialog_likeOrDisLike = function (res){

    var post = res.currentTarget.dataset.post;

    var httpClient = createHttpClient(page);
    httpClient.setMode("", true);
    httpClient.addHandler("success", function () { })
    httpClient.send(request.url.likeOrDisLike, "GET", { pkId: post.pkId, postId: post.postId, isQueryerCollect: post.queryerCollect });


    page.setData({
      "singlePostDialog.post.queryerCollect": !post.queryerCollect
    })
  }
  page._singlePostDialog_upload = function(res){
    // 续传图片
    var post = res.currentTarget.dataset.post;
    
    page.singlePostDialog.hide();

    createEditImageDialog(page).setDialog("续传榜帖", post.topic, 9, function () {
      console.log("-------------confirm------------");
      page.singlePostDialog.show(post, singlePostDialog.success);
      page.setData({
        "singlePostDialog.statu": 'loading'
      })

    }, function (text, urls) {
      //上传成功
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (post) {

        page.setData({
          "singlePostDialog.post": post,
          "singlePostDialog.statu": 'normal'
        })
        page.singlePostDialog.success(post);

      })
      httpClient.send(request.url.uploadPostImgs, "GET",
        {
          pkId:page.data.pkId,
          postId:post.postId,
          title: text,
          imgUrls: urls,
        }
      );

    }, function () {
      //上传失败
      page.setData({
        "singlePostDialog.statu": 'normal'
      })
      tip.showContentTip("续传失败!");
      
    }).show();




  
  }
  page._singlePostDialog_remove = function (res) {
    var img = res.currentTarget.dataset.img;
    var index = res.currentTarget.dataset.index;
    var post = res.currentTarget.dataset.post;

    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (post) {
        //去除index位置的Img
      page.setData({
        "singlePostDialog.post": post
      })

    })
    httpClient.send(request.url.deletePostImg, "GET", { pkId: page.data.pkId,postId: post.postId, imgId: img.imageId });


  }
  page._singlePostDialog_onOffLine = function(res){

    if (page.data.singlePostDialog.post.statu.key === 1) { page.setData({ 'singlePostDialog.post.statu.key': 2, }) }
    else { page.setData({ 'singlePostDialog.post.statu.key': 1, }) }
    var postId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (statu) {
      page.setData({
        'singlePostDialog.post.statu': statu,
      })
      tip.showContentTip(statu.name + "成功!");
    })
    httpClient.send(request.url.postConfirm, "GET", { pkId: page.data.pkId, postId: postId });



  }


  page.singlePostDialog = singlePostDialog;
  page._singlePostDialog_close = function () {
    page.singlePostDialog.hide();
  };
  return singlePostDialog;

}

//分享弹出框
function createShareDialog(page) {

    if (page.shareDialog) {
      return page.shareDialog;
    }
    var shareDialog = new Object();
    shareDialog.args = {},
    shareDialog.feeCodeUrl = "",



    shareDialog.message = [],
    shareDialog.cacheMessage = [],


    shareDialog.select = false,
    shareDialog.show = function (shareData) {

      // 显示 弹出列表框
      page.setData({
        'shareDialog.feeCodeUrl': shareData.userFeeCodeUrl,
        'shareDialog.visible': true,
      })
      page.setData({ 'shareDialog.height': 10 });
      page.setData({ 'shareDialog.height': 20 });
      page.setData({ 'shareDialog.height': 30 });
      page.setData({ 'shareDialog.height': 'auto' });


    }
  shareDialog.hide = function () {
    var num = 10;

    page.setData({ 'shareDialog.height': 30 });
    page.setData({ 'shareDialog.height': 20 });
    page.setData({ 'shareDialog.height': 10 });
    page.setData({ 'shareDialog.height': 0 });
    page.setData({
      'shareDialog': {},
      // 'shareDialog.visible': false,
    })
  }
  page._shareDialog_close = function () {
    shareDialog.hide();
  }
  page._shareDialog_select = function () {
    var newSelect = !(page.data.shareDialog.select)
    page.setData({
      'shareDialog.select': newSelect
    })
  }
  page._shareDialog_uploadFeeCode = function () {
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("code", function (userCode) {
      page.setData({
        'shareDialog.feeCodeUrl': userCode.url,
      })
      page.shareDialog.hide();
      
      setTimeout(function(){
        
        createUploadFeeDialog(page).show(userCode);
      },300)
      

    })


    httpClient.send(request.url.uploadFeeCode, "GET", {pkId:page.data.pkId});
  }


  page.catchReturn = function () { }
  page.shareDialog = shareDialog;
  return shareDialog;
}

function createUploadFeeDialog(page){
  if (page.uploadFeeDialog) {
    return page.uploadFeeDialog;
  }
  var uploadFeeDialog = new Object();


  uploadFeeDialog.show = function (userCode) {
    page.setData({
      'uploadFeeDialog.visible': true,
      'uploadFeeDialog.userCode': userCode,
    })            
    
    page.setData({ 'uploadFeeDialog.left': '-77' });
    page.setData({ 'uploadFeeDialog.left': '-57' });
    page.setData({ 'uploadFeeDialog.left': '-37' });
    page.setData({ 'uploadFeeDialog.left': '-17' });
    page.setData({ 'uploadFeeDialog.left': '3' });

  }
  uploadFeeDialog.hide = function () {

    page.setData({ 'uploadFeeDialog.left': '-17' });
    page.setData({ 'uploadFeeDialog.left': '-37' });
    page.setData({ 'uploadFeeDialog.left': '-57' });
    page.setData({ 'uploadFeeDialog.left': '-77' });
    page.setData({ 'uploadFeeDialog.left': '-90' });
    page.setData({
      'uploadFeeDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.uploadFeeDialog = uploadFeeDialog;



  page._uploadFeeDialog_setPhone = function(){
 
    createEditNumberDialog(page).show("手机号码", 11, "添加手机号码", function(phoneStr){
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
        page.setData({
          'uploadFeeDialog.userCode.phone': phoneStr,
        })
      })
      httpClient.send(request.url.setPhone, "GET", {pkId:page.data.pkId, phone: phoneStr });
    });


  }

  page._uploadFeeDialog_setFeeCode = function () {

    var  statu = page.data.uploadFeeDialog.userCode.statu.key;
    if (statu === 2)  { return; }
    if (statu === 3) { return; }
    if (statu === 4) { return; }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        login.getUser(function (loginUser) {

          wx.showLoading({
            title: '上传收款码...',
          })
          upload.uploadImages2(loginUser.userId, "feeCode", [res.tempFilePaths[0]], page,
            function (urls) {
              wx.hideLoading();
              console.log("图片集合", urls);
              var httpClient = createHttpClient(page);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (userCode) {
                page.setData({
                  'uploadFeeDialog.userCode': userCode,
                })                
                // showTip("设置成功......");
              })
              httpClient.send(request.url.setFeeCode, "GET", { pkId: page.data.pkId,url: urls[0] });
            },
            function () {
              wx.hideLoading();
              showTip("设置失败......");

            });


        })
        





      },
    })

  }




  page._uploadFeeDialog_apply = function(){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {

    })

    //可以创建支付窗口
    httpClient.addHandler("createPayOrder", function (creatorId) {
        var httpClient = createHttpClient(page);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (order) {
          createUploadFeeDialog(page).hide();
          setTimeout(function () { createSingleOrderDialog(page).show(order); }, 500)
        })
        httpClient.send(request.url.queryCreateOrder, "GET", { pkId: page.data.pkId, cashierId: creatorId });
    })
    httpClient.send(request.url.applyOrder, "GET", {pkId:page.data.pkId});


  }


  page._uploadFeeDialog_close = function () {
    page.uploadFeeDialog.hide();
  };
  return uploadFeeDialog;
  
}


function createApplyOrderDialog(page) {
  if (page.applyOrderDialog) {
    return page.applyOrderDialog;
  }
  var applyOrderDialog = new Object();


  applyOrderDialog.show = function (order) {

    page.setData({
      'applyOrderDialog.time.leftTimes': order.leftTimes,
      'applyOrderDialog.time.minute':  parseInt(order.leftTimes/60),
      'applyOrderDialog.time.second': order.leftTimes%60,

    })
    var clock = setInterval(() => {
      var leftTimes = page.data.applyOrderDialog.time.leftTimes - 1
      //确认中 模式下才需要定时刷新时间
      if(page.data.applyOrderDialog.order.statu.key != 1){ clearInterval(page.data.applyOrderDialog.clock);return;}
      if(leftTimes < 0){

        page._apply_confirm(order.orderId);

        clearInterval(page.data.applyOrderDialog.clock);
        

        return;
      }
      var minute =  parseInt(leftTimes/60);
      var second =  leftTimes%60;
      page.setData({
        'applyOrderDialog.time':{
          leftTimes:leftTimes,
          minute:minute,
          second:second
        }
      })
    }, 1000);
    page.data.applyOrderDialog.clock = clock;



    page.setData({
      'applyOrderDialog.visible': true,
      'applyOrderDialog.order': order,
    })




    page.setData({ 'applyOrderDialog.left': '-77' });
    page.setData({ 'applyOrderDialog.left': '-57' });
    page.setData({ 'applyOrderDialog.left': '-37' });
    page.setData({ 'applyOrderDialog.left': '-17' });
    page.setData({ 'applyOrderDialog.left': '3' });

  }
  applyOrderDialog.hide = function () {
    clearInterval(page.data.applyOrderDialog.clock);
    page.setData({ 'applyOrderDialog.left': '-17' });
    page.setData({ 'applyOrderDialog.left': '-37' });
    page.setData({ 'applyOrderDialog.left': '-57' });
    page.setData({ 'applyOrderDialog.left': '-77' });
    page.setData({ 'applyOrderDialog.left': '-90' });
    page.setData({
      'applyOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.applyOrderDialog = applyOrderDialog;
  page._applyOrderDialog_uploadOrderCut = function(){

    //
    if(page.data.applyOrderDialog.order.statu.statu === 1){return;}
    if (page.data.applyOrderDialog.order.statu.statu === 2) { return; }
    if (page.data.applyOrderDialog.order.statu.statu === 3) { return; }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        login.getUser(function (loginUser) {

          wx.showLoading({
            title: '上传订单截图...',
          })
          upload.uploadImages2(loginUser.userId, "feeCode", [res.tempFilePaths[0]], page,
            function (urls) {
              wx.hideLoading();
              console.log("图片集合", urls);
              var httpClient = createHttpClient(page);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (order) {
                page.setData({
                  'applyOrderDialog.order': order,
                })
              })
              httpClient.send(request.url.setOrderCut, "GET", { orderId: page.data.applyOrderDialog.order.orderId, url: urls[0]});
            },
            function () {
              wx.hideLoading();
              showTip("上传失败......");

            });


        })






      },
    })





  }
  page._applyOrderDialog_save = function(res){
    var imgSrc = res.currentTarget.dataset.url;
    let fileName = new Date().valueOf();
    let filePath = wx.env.USER_DATA_PATH + "/" + fileName + ".jpg";
    tip.showContentTip("下载图片中...");
    wx.downloadFile({
      url: imgSrc,
      filePath:filePath,
      success: function (data) {
     
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function (succ) {
            wx.showToast({
              title: '保存成功',
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
      }
    })
  }
  page._applyOrderDialog_confirm = function(){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'applyOrderDialog.order': order,
      })
    })
    httpClient.send(request.url.orderConfirm, "GET", { orderId: page.data.applyOrderDialog.order.orderId});



  }
  page._apply_confirm = function(orderId){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (order) {
        createApplyOrderDialog(page).show(order);
    })
    httpClient.send(request.url.orderConfirmOutOfTime, "GET", { orderId: orderId});









  }

  page._applyOrderDialog_close = function () {
    page.applyOrderDialog.hide();
  };
  return applyOrderDialog;

}



function createCashierOrderDialog(page) {
  if (page.cashierOrderDialog) {
    return page.cashierOrderDialog;
  }
  var cashierOrderDialog = new Object();


  cashierOrderDialog.show = function (order) {
    page.setData({
      'cashierOrderDialog.visible': true,
      'cashierOrderDialog.order': order,
    })

    page.setData({ 'cashierOrderDialog.left': '-77' });
    page.setData({ 'cashierOrderDialog.left': '-67' });
    page.setData({ 'cashierOrderDialog.left': '-57' });
    page.setData({ 'cashierOrderDialog.left': '-47' });
    page.setData({ 'cashierOrderDialog.left': '-37' });
    page.setData({ 'cashierOrderDialog.left': '-27' });
    page.setData({ 'cashierOrderDialog.left': '-17' });
    page.setData({ 'cashierOrderDialog.left': '-7' });
    page.setData({ 'cashierOrderDialog.left': '3' });

  }
  cashierOrderDialog.hide = function () {
    page.setData({ 'cashierOrderDialog.left': '-17' });
    page.setData({ 'cashierOrderDialog.left': '-27' });
    page.setData({ 'cashierOrderDialog.left': '-37' });
    page.setData({ 'cashierOrderDialog.left': '-47' });
    page.setData({ 'cashierOrderDialog.left': '-57' });
    page.setData({ 'cashierOrderDialog.left': '-67' });
    page.setData({ 'cashierOrderDialog.left': '-77' });
    page.setData({ 'cashierOrderDialog.left': '-87' });
    page.setData({ 'cashierOrderDialog.left': '-90' });
    page.setData({
      'cashierOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.cashierOrderDialog = cashierOrderDialog;

  page._cashierOrderDialog_confirm1 = function(res){
    var orderId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'cashierOrderDialog.order': order,
        'cashierOrderDialog.page': page.data.cashierOrderDialog.page - 1,
      })
    })
    httpClient.send(request.url.cashierOrderConfirm1, "GET", { orderId: orderId });





  }
  page._cashierOrderDialog_confirm2 = function (res) {
    var orderId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'cashierOrderDialog.order': order,
        'cashierOrderDialog.page': page.data.cashierOrderDialog.page - 1,
      })
    })
    httpClient.send(request.url.cashierOrderConfirm2, "GET", { orderId: orderId });



  }
  page._cashierOrderDialog_nextOrder = function(){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'cashierOrderDialog.order': order,
        'cashierOrderDialog.type': parseInt(page.data.cashierOrderDialog.type),
        'cashierOrderDialog.page': page.data.cashierOrderDialog.page + 1,
      })
    })
    httpClient.send(request.url.feeOrder, "GET", { pkId: page.data.pkId, type: page.data.cashierOrderDialog.type, page: page.data.cashierOrderDialog.page+1 });
  }
  page._cashierOrderDialog_selectType = function(res){
    var type = parseInt(res.currentTarget.dataset.type);
    if(type != page.data.cashierOrderDialog.type){
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (order) {
        page.setData({
          'cashierOrderDialog.order': order,
          'cashierOrderDialog.type': type,
          'cashierOrderDialog.page': 1,
        })
      })
      httpClient.send(request.url.feeOrder, "GET", { pkId: page.data.pkId, type: type, page:1 });

    }

  }

  page._cashierOrderDialog_close = function () {
    page.cashierOrderDialog.hide();
  };
  return cashierOrderDialog;

}



// 查看打赏订单
function createRewardOrderDialog(page) {
  if (page.rewardOrderDialog) {
    return page.rewardOrderDialog;
  }
  var rewardOrderDialog = new Object();


  rewardOrderDialog.show = function (order) {

    page.setData({
      'rewardOrderDialog.time.leftTimes': order.leftTimes,
      'rewardOrderDialog.time.minute':  parseInt(order.leftTimes/60),
      'rewardOrderDialog.time.second': order.leftTimes%60,

    })
    var clock = setInterval(() => {
      var leftTimes = page.data.rewardOrderDialog.time.leftTimes - 1
      //确认中 模式下才需要定时刷新时间
      if(page.data.rewardOrderDialog.order.statu.key != 1){ clearInterval(page.data.rewardOrderDialog.clock);return;}
      if(leftTimes < 0){

        page._reward_confirm(request.url.cashierOrderConfirm1,order.orderId);

        clearInterval(page.data.rewardOrderDialog.clock);
        

        return;
      }
      var minute =  parseInt(leftTimes/60);
      var second =  leftTimes%60;
      page.setData({
        'rewardOrderDialog.time':{
          leftTimes:leftTimes,
          minute:minute,
          second:second
        }
      })
    }, 1000);
    page.data.rewardOrderDialog.clock = clock;



    page.setData({
      'rewardOrderDialog.visible': true,
      'rewardOrderDialog.order': order,
    })




    page.setData({ 'rewardOrderDialog.left': '-77' });
    page.setData({ 'rewardOrderDialog.left': '-57' });
    page.setData({ 'rewardOrderDialog.left': '-37' });
    page.setData({ 'rewardOrderDialog.left': '-17' });
    page.setData({ 'rewardOrderDialog.left': '3' });

  }
  rewardOrderDialog.hide = function () {
    clearInterval(page.data.rewardOrderDialog.clock);
    page.setData({ 'rewardOrderDialog.left': '-17' });
    page.setData({ 'rewardOrderDialog.left': '-37' });
    page.setData({ 'rewardOrderDialog.left': '-57' });
    page.setData({ 'rewardOrderDialog.left': '-77' });
    page.setData({ 'rewardOrderDialog.left': '-90' });
    page.setData({
      'rewardOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.rewardOrderDialog = rewardOrderDialog;
  //已收款
  page._rewardOrderDialog_confirm1 = function(res){
    var orderId = res.currentTarget.dataset.id;
    page._reward_confirm(request.url.cashierOrderConfirm1,orderId);
  }
  //未收款
  page._rewardOrderDialog_confirm2 = function (res) {
    var orderId = res.currentTarget.dataset.id;
    page._reward_confirm(request.url.cashierOrderConfirm2,orderId);
  }

  page._reward_confirm = function (url,orderId) {
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {

      createRewardOrderDialog(page).show(order);
    })
    httpClient.send(url, "GET", { orderId: orderId });
  }







  page._rewardOrderDialog_close = function () {
    page.rewardOrderDialog.hide();
  };
  return rewardOrderDialog;
}


function createPayerOrderDialog(page) {
  if (page.payerOrderDialog) {
    return page.payerOrderDialog;
  }
  var payerOrderDialog = new Object();


  payerOrderDialog.show = function (order) {
    page.setData({
      'payerOrderDialog.visible': true,
    })

    page.setData({ 'payerOrderDialog.left': '-77' });
    page.setData({ 'payerOrderDialog.left': '-67' });
    page.setData({ 'payerOrderDialog.left': '-57' });
    page.setData({ 'payerOrderDialog.left': '-47' });
    page.setData({ 'payerOrderDialog.left': '-37' });
    page.setData({ 'payerOrderDialog.left': '-27' });
    page.setData({ 'payerOrderDialog.left': '-17' });
    page.setData({ 'payerOrderDialog.left': '-7' });
    page.setData({ 'payerOrderDialog.left': '3' });
    page.setData({
      'payerOrderDialog.order': order,
    })
  }
  payerOrderDialog.hide = function () {
    page.setData({ 'payerOrderDialog.left': '-17' });
    page.setData({ 'payerOrderDialog.left': '-27' });
    page.setData({ 'payerOrderDialog.left': '-37' });
    page.setData({ 'payerOrderDialog.left': '-47' });
    page.setData({ 'payerOrderDialog.left': '-57' });
    page.setData({ 'payerOrderDialog.left': '-67' });
    page.setData({ 'payerOrderDialog.left': '-77' });
    page.setData({ 'payerOrderDialog.left': '-87' });
    page.setData({ 'payerOrderDialog.left': '-90' });
    page.setData({
      'payerOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.payerOrderDialog = payerOrderDialog;


  page._payerOrderDialog_nextOrder = function () {
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'payerOrderDialog.order': order,
        'payerOrderDialog.type': parseInt(page.data.payerOrderDialog.type),
        'payerOrderDialog.page': page.data.payerOrderDialog.page + 1,
      })
    })
    httpClient.send(request.url.payOrder, "GET", { pkId: page.data.pkId, type: page.data.payerOrderDialog.type, page: page.data.payerOrderDialog.page + 1 });
  }
  page._payerOrderDialog_save = function (res) {
    var imgSrc = res.currentTarget.dataset.url;
    tip.showContentTip("下载图片中...");
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
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
      }
    })
  }

  page._payerOrderDialog_selectType = function (res) {
    var type = parseInt(res.currentTarget.dataset.type);
    if (type != page.data.payerOrderDialog.type) {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (order) {
        page.setData({
          'payerOrderDialog.order': order,
          'payerOrderDialog.type': type,
          'payerOrderDialog.page': 1,
        })
      })
      httpClient.send(request.url.payOrder, "GET", { pkId: page.data.pkId, type: type, page: 1 });

    }

  }

  page._payerOrderDialog_close = function () {
    page.payerOrderDialog.hide();
  };
  return payerOrderDialog;

}



function createApproveOrderDialog(page) {
  if (page.approveOrderDialog) {
    return page.approveOrderDialog;
  }
  var approveOrderDialog = new Object();


  approveOrderDialog.show = function (order) {
    page.setData({
      'approveOrderDialog.visible': true,
    })

    page.setData({ 'approveOrderDialog.left': '-77' });
    page.setData({ 'approveOrderDialog.left': '-67' });
    page.setData({ 'approveOrderDialog.left': '-57' });
    page.setData({ 'approveOrderDialog.left': '-47' });
    page.setData({ 'approveOrderDialog.left': '-37' });
    page.setData({ 'approveOrderDialog.left': '-27' });
    page.setData({ 'approveOrderDialog.left': '-17' });
    page.setData({ 'approveOrderDialog.left': '-7' });
    page.setData({ 'approveOrderDialog.left': '3' });
    page.setData({
      'approveOrderDialog.order': order,
    })
  }
  approveOrderDialog.hide = function () {
    page.setData({ 'approveOrderDialog.left': '-17' });
    page.setData({ 'approveOrderDialog.left': '-27' });
    page.setData({ 'approveOrderDialog.left': '-37' });
    page.setData({ 'approveOrderDialog.left': '-47' });
    page.setData({ 'approveOrderDialog.left': '-57' });
    page.setData({ 'approveOrderDialog.left': '-67' });
    page.setData({ 'approveOrderDialog.left': '-77' });
    page.setData({ 'approveOrderDialog.left': '-87' });
    page.setData({ 'approveOrderDialog.left': '-90' });
    page.setData({
      'approveOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.approveOrderDialog = approveOrderDialog;

  page._approveOrderDialog_confirm1 = function (res) {
    var dynamicId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'approveOrderDialog.order': order,
        'approveOrderDialog.page': page.data.approveOrderDialog.page - 1,
      })
    })
    httpClient.send(request.url.approveOrderConfirm1, "GET", { dynamicId: dynamicId });





  }
  page._approveOrderDialog_confirm2 = function (res) {
    var dynamicId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'approveOrderDialog.order': order,
        'approveOrderDialog.page': page.data.approveOrderDialog.page - 1,
      })
    })
    httpClient.send(request.url.approveOrderConfirm2, "GET", { dynamicId: dynamicId });

  }

  page._approveOrderDialog_selectType = function (res) {
    var type = parseInt(res.currentTarget.dataset.type);
    if (type != page.data.approveOrderDialog.type) {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (order) {
        page.setData({
          'approveOrderDialog.order': order,
        })
      })
      httpClient.send(request.url.approveUserCode, "GET", { pkId: page.data.pkId });

    }

  }

  page._approveOrderDialog_close = function () {
    page.approveOrderDialog.hide();
  };
  return approveOrderDialog;

}

function createPostApproveDialog(page) {
  if (page.postApproveDialog) {
    return page.postApproveDialog;
  }
  var postApproveDialog = new Object();


  postApproveDialog.show = function (order) {
    page.setData({
      'postApproveDialog.visible': true,
    })

    page.setData({ 'postApproveDialog.left': '-77' });
    page.setData({ 'postApproveDialog.left': '-67' });
    page.setData({ 'postApproveDialog.left': '-57' });
    page.setData({ 'postApproveDialog.left': '-47' });
    page.setData({ 'postApproveDialog.left': '-37' });
    page.setData({ 'postApproveDialog.left': '-27' });
    page.setData({ 'postApproveDialog.left': '-17' });
    page.setData({ 'postApproveDialog.left': '-7' });
    page.setData({ 'postApproveDialog.left': '3' });
    page.setData({
      'postApproveDialog.order': order,
    })
  }
  postApproveDialog.hide = function () {
    page.setData({ 'postApproveDialog.left': '-17' });
    page.setData({ 'postApproveDialog.left': '-27' });
    page.setData({ 'postApproveDialog.left': '-37' });
    page.setData({ 'postApproveDialog.left': '-47' });
    page.setData({ 'postApproveDialog.left': '-57' });
    page.setData({ 'postApproveDialog.left': '-67' });
    page.setData({ 'postApproveDialog.left': '-77' });
    page.setData({ 'postApproveDialog.left': '-87' });
    page.setData({ 'postApproveDialog.left': '-90' });
    page.setData({
      'postApproveDialog': {},
    })
  }
  //-----------------------------page---------------------------------------


  page.postApproveDialog = postApproveDialog;


  page._postApproveDialog_nextOrder = function () {
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      page.setData({
        'postApproveDialog.order': order,
        'postApproveDialog.type': parseInt(page.data.postApproveDialog.type),
        'postApproveDialog.page': page.data.postApproveDialog.page + 1,
      })
    })
    httpClient.send(request.url.postApprove, "GET", { pkId: page.data.pkId, type: page.data.postApproveDialog.type, page: page.data.postApproveDialog.page + 1 });
  }
  page._postApproveDialog_onOffLine = function(res){
    if (page.data.postApproveDialog.order.statu.key === 1){page.setData({'postApproveDialog.order.statu.key': 2,})}
    else { page.setData({ 'postApproveDialog.order.statu.key': 1, })}

    var postId = res.currentTarget.dataset.id;
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (statu) {
      page.setData({
        'postApproveDialog.order.statu': statu,
        'postApproveDialog.page': page.data.postApproveDialog.page - 1,
      })
      tip.showContentTip(statu.name + "成功!");
    })
    httpClient.send(request.url.postConfirm, "GET", { pkId: page.data.pkId, postId: postId });






  }
  page._postApproveDialog_selectType = function (res) {
    var type = parseInt(res.currentTarget.dataset.type);
    if (type != page.data.postApproveDialog.type) {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (order) {
        page.setData({
          'postApproveDialog.order': order,
          'postApproveDialog.type': type,
          'postApproveDialog.page': 1,
        })
      })
      httpClient.send(request.url.postApprove, "GET", { pkId: page.data.pkId, type: type, page: 1 });

    }

  }

  page._postApproveDialog_close = function () {
    page.postApproveDialog.hide();
  };
  return postApproveDialog;

}

//任务页面
function createTaskDialog(page) {
  if (page.taskDialog) {
    return page.taskDialog;
  }
  var taskDialog = new Object();


  taskDialog.show = function (order) {
    page.setData({
      'taskDialog.visible': true,
    })

    page.setData({ 'taskDialog.left': '-77' });
    page.setData({ 'taskDialog.left': '-67' });
    page.setData({ 'taskDialog.left': '-57' });
    page.setData({ 'taskDialog.left': '-47' });
    page.setData({ 'taskDialog.left': '-37' });
    page.setData({ 'taskDialog.left': '-27' });
    page.setData({ 'taskDialog.left': '-17' });
    page.setData({ 'taskDialog.left': '-7' });
    page.setData({ 'taskDialog.left': '3' });
    page.setData({
      'taskDialog.order': order,
    })
  }
  taskDialog.hide = function () {
    page.setData({ 'taskDialog.left': '-17' });
    page.setData({ 'taskDialog.left': '-27' });
    page.setData({ 'taskDialog.left': '-37' });
    page.setData({ 'taskDialog.left': '-47' });
    page.setData({ 'taskDialog.left': '-57' });
    page.setData({ 'taskDialog.left': '-67' });
    page.setData({ 'taskDialog.left': '-77' });
    page.setData({ 'taskDialog.left': '-87' });
    page.setData({ 'taskDialog.left': '-90' });
    page.setData({
      'taskDialog': {},
    })
  }
  //-----------------------------page---------------------------------------


  page.taskDialog = taskDialog;
  page._taskDialog_selectType = function (res) {
    var type = parseInt(res.currentTarget.dataset.type);
    if (type != page.data.taskDialog.type) {
      var httpClient = createHttpClient(page);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (order) {
        page.setData({
          'taskDialog.order': order,
          'taskDialog.type': type,
          'taskDialog.page': 1,
        })
      })
      httpClient.send(request.url.queryTasks, "GET", { pkId: page.data.pkId, type: type, page: 1 });

    }

  }
  page._taskDialog_fee = function(res){
    page.taskDialog.hide();
    var userId = res.currentTarget.dataset.feeid;
    var that = this;
    var httpClient = createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      createApplyOrderDialog(that).show(order);
    })
    httpClient.send(request.url.queryCreateOrder, "GET", { pkId: that.data.pkId, cashierId: userId });







  }
  page._taskDialog_close = function () {
    page.taskDialog.hide();
  };
  return taskDialog;

}


function createIntegralDialog(page) {
  if (page.integralDialog) {
    return page.integralDialog;
  }
  var integralDialog = new Object();


  integralDialog.show = function (userIntegral) {
    page.setData({
      'integralDialog.visible': true,
      'integralDialog.integral': userIntegral,
    })

    page.setData({ 'integralDialog.left': '-77' });
    page.setData({ 'integralDialog.left': '-57' });
    page.setData({ 'integralDialog.left': '-37' });
    page.setData({ 'integralDialog.left': '-17' });
    page.setData({ 'integralDialog.left': '3' });

  }
  integralDialog.hide = function () {
    page.setData({ 'integralDialog.left': '-17' });
    page.setData({ 'integralDialog.left': '-37' });
    page.setData({ 'integralDialog.left': '-57' });
    page.setData({ 'integralDialog.left': '-77' });
    page.setData({ 'integralDialog.left': '-90' });
    page.setData({
      'integralDialog': {},
    })
  }
  //-----------------------------page---------------------------------------


  page.integralDialog = integralDialog;



  page._integralDialog_close = function () {
    page.integralDialog.hide();
  };
  return integralDialog;

}

// /订单页面
function createSingleOrderDialog(page) {
  if (page.singleOrderDialog) {
    return page.singleOrderDialog;
  }
  var singleOrderDialog = new Object();


  singleOrderDialog.show = function (order) {
 

    page.setData({
      'singleOrderDialog.time.leftTimes': order.leftTimes,
      'singleOrderDialog.time.minute':  parseInt(order.leftTimes/60),
      'singleOrderDialog.time.second': order.leftTimes%60,

    })
    if((order.statu.key===1) && (order.leftTimes > 0)){
      var clock = setInterval(() => {
        var leftTimes = page.data.singleOrderDialog.time.leftTimes - 1
        //确认中 模式下才需要定时刷新时间
        if(page.data.singleOrderDialog.order.statu.key != 1){ clearInterval(page.data.singleOrderDialog.clock);return;}
        if(leftTimes <= 0){
  
          page._order_outOfTime(order.orderId);
          clearInterval(page.data.singleOrderDialog.clock);
        
          return;
        }
        var minute =  parseInt(leftTimes/60);
        var second =  leftTimes%60;
        page.setData({
          'singleOrderDialog.time':{
            leftTimes:leftTimes,
            minute:minute,
            second:second
          }
        })
      }, 1000);
      page.data.singleOrderDialog.clock = clock;

    }




    page.setData({
      'singleOrderDialog.visible': true,
      'singleOrderDialog.order': order,
    })




    page.setData({ 'singleOrderDialog.left': '-77' });
    page.setData({ 'singleOrderDialog.left': '-57' });
    page.setData({ 'singleOrderDialog.left': '-37' });
    page.setData({ 'singleOrderDialog.left': '-17' });
    page.setData({ 'singleOrderDialog.left': '3' });

  }
  singleOrderDialog.hide = function () {
    
    clearInterval(page.data.singleOrderDialog.clock);

    page.setData({ 'singleOrderDialog.left': '-17' });
    page.setData({ 'singleOrderDialog.left': '-37' });
    page.setData({ 'singleOrderDialog.left': '-57' });
    page.setData({ 'singleOrderDialog.left': '-77' });
    page.setData({ 'singleOrderDialog.left': '-90' });
    page.setData({
      'singleOrderDialog': {},
    })
  }
  //-----------------------------page---------------------------------------




  page.singleOrderDialog = singleOrderDialog;
  //收款或者未收款
  page._singleOrderDialog_feeConfirm = function(res){
    var orderId = res.currentTarget.dataset.id;
    var tag = res.currentTarget.dataset.tag;
    page._reward_confirm(request.url.cashierOrderConfirm,orderId,tag);
  }


  page._reward_confirm = function (url,orderId,tag) {
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      createSingleOrderDialog(page).hide();
      createSingleOrderDialog(page).show(order);
    })
    httpClient.send(url, "GET", { orderId: orderId,tag: tag });
  }
  // 订单超时
  page._order_outOfTime = function(orderId){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (order) {
        createSingleOrderDialog(page).hide();
        createSingleOrderDialog(page).show(order);
    })
    httpClient.send(request.url.orderConfirmOutOfTime, "GET", { orderId: orderId});

  }

  //上传支付截图
  page._singleOrderDialog_uploadOrderCut = function(){

    //
    if(page.data.singleOrderDialog.order.statu.statu === 1){return;}
    if (page.data.singleOrderDialog.order.statu.statu === 2) { return; }
    if (page.data.singleOrderDialog.order.statu.statu === 3) { return; }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        login.getUser(function (loginUser) {

          wx.showLoading({
            title: '上传订单截图...',
          })
          upload.uploadImages2(loginUser.userId, "feeCode", [res.tempFilePaths[0]], page,
            function (urls) {
              wx.hideLoading();
              console.log("图片集合", urls);
              var httpClient = createHttpClient(page);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (order) {
                page.setData({
                  'singleOrderDialog.order': order,
                })
              })
              httpClient.send(request.url.setOrderCut, "GET", { orderId: page.data.singleOrderDialog.order.orderId, url: urls[0]});
            },
            function () {
              wx.hideLoading();
              showTip("上传失败......");

            });


        })






      },
    })





  }
  //确定创建订单
  page._singleOrderDialog_confirm = function(){
    var httpClient = createHttpClient(page);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (order) {
      
      createSingleOrderDialog(page).show(order);

    })
    httpClient.send(request.url.orderConfirm, "GET", { orderId: page.data.singleOrderDialog.order.orderId});



  }



  page._singleOrderDialog_close = function () {
    page.singleOrderDialog.hide();
  };
  return singleOrderDialog;
}


//页面加固


module.exports = { createDialog,createSingleOrderDialog,createRewardOrderDialog,createIntegralDialog, createTaskDialog, createPostApproveDialog ,createApproveOrderDialog,createPayerOrderDialog,createCashierOrderDialog, createUploadFeeDialog, createApplyOrderDialog, createSinglePostDialog, createShareDialog, createFeeDialog, createFinanceDialog,createMemberDialog,createPhoneCallDialog, createOperDialog, createChooseDialog, createOrderDialog, createOrgDialog, pageInit, pageInitLoading, createHttpClient, createTipDialog, createDownloadImageDialog, createUploadImageDialog, createShortTextDialog, createEditNumberDialog, createOperateDialog, createPageLoading, createPageLoadingError, createLabelLoading, createLabelLoadingSuccess, createLabelLoadingError, createSelectionDialog, createEditImageDialog, createEditTextDialog }









