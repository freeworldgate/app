// var host = 'http://www.211shopper.com'; 
// var host = 'http://192.168.137.1:8080'; 
var host = 'http://192.168.43.67:8080'; 

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
        cashierOrderConfirm: `${host}/pk/cashierOrderConfirm`, 
 
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
         
        rewardOrder: `${host}/pk/rewardOrder`, 
        verifyOrder: `${host}/pk/verifyOrder`, 
        orderConfirmOutOfTime: `${host}/pk/orderConfirmOutOfTime`, 
        queryTaskOrder: `${host}/pk/queryTaskOrder`, 
        complainOrder: `${host}/pk/complainOrder`, 
        helpInfo: `${host}/pk/helpInfo`, 
        nextComplain: `${host}/pk/nextComplain`, 
         
        approvedComplain: `${host}/pk/approvedComplain`, 
    
        queryApproveInfo1: `${host}/pk/queryApproveInfo1`, 
        queryApproveInfo2: `${host}/pk/queryApproveInfo2`, 
        queryApproveInfo3: `${host}/pk/queryApproveInfo3`, 
        queryHomePage: `${host}/pk/queryHomePage`, 
        
        nextHomePage: `${host}/pk/nextHomePage`, 
        queryInvites: `${host}/pk/queryInvites`, 
        nextInvitePage: `${host}/pk/nextInvitePage`, 
        addUserInvite: `${host}/pk/addUserInvite`, 
        
        userPks: `${host}/pk/userPks`, 
        nextUserPks: `${host}/pk/nextUserPks`, 
        viewGroupCode: `${host}/pk/viewGroupCode`, 
        queryPkApprove: `${host}/pk/queryPkApprove`, 
        canEditApproveMessage: `${host}/pk/canEditApproveMessage`,
        selectCashier: `${host}/pk/selectCashier`,
        viewActiveGroupCode: `${host}/pk/viewActiveGroupCode`,
        confirmSelectCashier: `${host}/pk/confirmSelectCashier`,
        queryActiveGroupCode: `${host}/pk/queryActiveGroupCode`,




        setApprover: `${host}/pk/setApprover`, 
        setApproveInfo: `${host}/pk/setApproveInfo`, 
        queryApprovingPost: `${host}/pk/queryApprovingPost`, 
        queryApprovedPost: `${host}/pk/queryApprovedPost`, 
        queryMoreApprovingPost: `${host}/pk/queryMoreApprovingPost`, 
        queryMoreApprovedPost: `${host}/pk/queryMoreApprovedPost`, 
        publishApproveMessage: `${host}/pk/publishApproveMessage`, 
        queryApproveMessage: `${host}/pk/queryApproveMessage`, 
        replaceImg: `${host}/pk/replaceImg`,      
        replaceText: `${host}/pk/replaceText`,      
        complain: `${host}/pk/complain`,     
        createPk: `${host}/pk/createPk`,  
        
        viewPk: `${host}/pk/viewPk`,  

        postStatu: `${host}/pk/postStatu`,      
        isPostApproved: `${host}/pk/isPostApproved`,     
        
        editSelfComment: `${host}/pk/editSelfComment`, 
        queryGroupCode: `${host}/pk/queryGroupCode`, 
        uploadGroupCode: `${host}/pk/uploadGroupCode`, 
        setApproveUser: `${host}/pk/setApproveUser`, 
 
        removeApproveUser: `${host}/pk/removeApproveUser`, 
        approve: `${host}/pk/approve`, 
        setComment: `${host}/pk/setComment`, 
        querySort: `${host}/pk/querySort`, 
 
        queryMoreSort: `${host}/pk/queryMoreSort`, 
         
        updateTime: `${host}/pk/updateTime`, 
        setCommentVoice:`${host}/pk/setCommentVoice`, 
        setApproverVoice:`${host}/pk/setApproverVoice`, 
        approverDetail:`${host}/pk/approverDetail`, 
 
        allCashiers:`${host}/pk/allCashiers`, 
        nextPageCashiers:`${host}/pk/nextPageCashiers`, 

        allFeeCodes:`${host}/pk/allFeeCodes`, 
     
        allCashierGroups:`${host}/pk/allCashierGroups`, 
        nextPageCashierGroups:`${host}/pk/nextPageCashierGroups`, 
        
        createCashier:`${host}/pk/createCashier`, 
        
        changeCahierStatu:`${host}/pk/changeCahierStatu`, 
         
        uploadCashierGroup:`${host}/pk/uploadCashierGroup`, 
        
        changeGroupStatu:`${host}/pk/changeGroupStatu`, 


        oneTimeTask:`${host}/pk/oneTimeTask`, 
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
