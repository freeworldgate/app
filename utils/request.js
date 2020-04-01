
var host = 'http://192.168.43.67:8084';

// 上传图片接口
var uploadUrl = 'https://oss.211shopper.com';

var appinfo = {
    appName:'APP1号',
};
    
var value = {
        success: '0x03000000',
        nouser:'0x03001001',
        wrongVCode:'0x03001002',
    };

var url = {

        shareMenu: `${host}/pk/shareMenu`,
        click: `${host}/pk/click`,
        zoneRefresh: `${host}/pk/zoneRefresh`,
        addPost: `${host}/pk/addPost`,
        createPost: `${host}/pk/createPost`,
        queryPk: `${host}/pk/queryPk`,
        queryUserPost: `${host}/pk/queryUserPost`,
        nextPage: `${host}/pk/nextPage`,
        queryPost: `${host}/pk/queryPost`,
        uploadFront: `${host}/pk/uploadFront`,
        deleteImg: `${host}/pk/deleteImg`,
        likeOrDisLike: `${host}/pk/likeOrDisLike`,
        deletePostImg: `${host}/pk/deletePostImg`,
        uploadPostImgs: `${host}/pk/uploadPostImgs`,
        showShareMenu: `${host}/pk/showShareMenu`,
        uploadFeeCode: `${host}/pk/uploadFeeCode`,
  
        setFeeCode: `${host}/pk/setFeeCode`,
        applyOrder: `${host}/pk/applyOrder`,
        setPhone: `${host}/pk/setPhone`,
        setOrderCut: `${host}/pk/setOrderCut`,
        orderConfirm: `${host}/pk/orderConfirm`,
        feeOrder: `${host}/pk/feeOrder`,
        cashierOrderConfirm2: `${host}/pk/cashierOrderConfirm2`,
        cashierOrderConfirm1: `${host}/pk/cashierOrderConfirm1`,
        approveOrderConfirm1: `${host}/pk/approveOrderConfirm1`,
        approveOrderConfirm2: `${host}/pk/approveOrderConfirm2`,
        payOrder: `${host}/pk/payOrder`,
        queryCreateOrder: `${host}/pk/queryCreateOrder`,
        approveUserCode: `${host}/pk/approveUserCode`,
        postApprove: `${host}/pk/postApprove`,
        postConfirm: `${host}/pk/postConfirm`,
        queryPostById: `${host}/pk/queryPostById`,
        queryTasks: `${host}/pk/queryTasks`,
        userIntegral: `${host}/pk/userIntegral`,
        queryPkStatu: `${host}/pk/queryPkStatu`,






        // 登录地址，用于建立会话
        loginUrl: `${host}/user/login`,
        userRegister: `${host}/user/register`,
        getVCode: `${host}/user/vcode`,
        getOssUploadUrl: `${host}/oss/getUrl`,
        postUploadImgs: `${host}/oss/postUploadImgs`,

        //获取Token Url
        accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3a496d6928523d69&secret=af61063e84fc1834bb55351f34fa1390',

        uploadToWx: 'https://api.weixin.qq.com/cgi-bin/media/upload?&type=image&access_token=',

    };

var  getRequest = (urlReq,dataParam,success,failure) =>{
    wx.request({
      url: urlReq,
      method:'GET',
      data:dataParam,
      success:function(res)
      {
          success(res);
      },
      failure:function(){
          failure();
      }
    })


}





module.exports = { uploadUrl,value, url, appinfo, getRequest};