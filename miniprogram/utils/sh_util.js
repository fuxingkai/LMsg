'use strict';

function showErrorMessage(message) {
  wx.showToast({
    title: message || '稍后重试',
    icon: 'none'
  });
}


/**
 * 判断是否空或空值字符串
 * @param  {String}  str [description]
 * @return {Boolean}     [description]
 */
function isNullOrEmpty(str) {
  if (str == null) {
    return true;
  }

  return str.trim().length == 0;
}

function isNotNull(str) {
  if (str !== null && str !== undefined && str !== '') {
    return true;
  }
  return false;
}

/**
 * 判断指定字符串是否手机号码
 * @param  {String}  str 目标字符串
 * @return {Boolean}
 */
function isPhoneNumber(str) {
  if (isNullOrEmpty(str)) {
    return false;
  }

  var reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;
  return reg.test(str);
}

function objectIsEqual(x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (var p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      if (x[p] === y[p]) {
        continue;
      }
      if (typeof (x[p]) !== "object") {
        return false;
      }
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};

/**
 * 存储咨询师信息
 */
function setStorageOpts(info) {
  let opts = null;
  try {
    opts = wx.getStorageSync('opts')
  } catch (e) {
  }
  if (opts == null || opts == undefined || opts == '') {
    opts = {};
  }
  try {
    let opt = {};
    opt.photoUrl = info.photoUrl;
    opt.nickName = info.nickName;
    opts[info.nimAccid] = opt;
    wx.setStorage({
      key: 'opts',
      data: opts
    })
  } catch (e) {
  }
}


/**
 * 同步获得存储的咨询师信息
 */
function getStorageSynOpts(nimAccid) {
  let opts = {};
  try {
    opts = wx.getStorageSync('opts')
  } catch (e) {
  }
  if (opts == null || opts == undefined || opts == '') {
    opts = {};
  }
  let opt = opts[nimAccid];
  if (opt == undefined) {
    opt = null;
  }
  return opt
}

/**
 * 代发咨询师卡片
 */
function postOptCardMsg(app, from) {
  let timeoutId = setTimeout(function () {
    // console.log('postOptMsg', app.store.getState());
    let session = app.store.getState().rawMessageList['p2p-' + from];
    // console.log('postOptMsg session', session);
    let isReq = true;
    if(session!=undefined&&session!=null){
        let messageKeys = Object.keys(session);
        messageKeys.map(key => {
          if (session[key].from == from
            && session[key].type == "custom"
            && (JSON.parse(session[key]['content'])['type'] == 2
              || JSON.parse(session[key]['content'])['type'] == 3)) {
            isReq = false;
            return;
          }
        });
    }
    
    // console.log('postOptMsg session isReq', isReq);
    if (isReq && app.getMiniAppCacheInfo().userInfo.accid) {
      let params = {};
      let msgType = [2];//[2, 3];
      params.type = msgType;
      params.from = from;
      params.to = app.getMiniAppCacheInfo().userInfo.accid;
      postOptMsgReq(app, params);
    }
  }, 3000);

}

/**
 * 代发咨询师繁忙
 */
function postOptBusyMsg(app, from) {
  let timeoutId = setTimeout(function () {
    // console.log('postOptBusyMsg', app.store.getState());
    let session = app.store.getState().rawMessageList['p2p-' + from];
    // console.log('postOptBusyMsg session', session);
    let isReq = true;
    if(session!=undefined&&session!=null){
        let messageKeys = Object.keys(session);
        messageKeys.map(key => {
          if (session[key].from == from
            && (session[key].type == "image"
              || (session[key].type == "text" && session[key].text != '')
              || (session[key].type == "custom" && JSON.parse(session[key]['content'])['type'] == 4))) {
            isReq = false;
            return;
          }
        });
    }

    // console.log('postOptMsg session isReq', isReq);
    if (isReq && app.getMiniAppCacheInfo().userInfo.accid) {
      let params = {};
      let msgType = [4];
      params.type = msgType;
      params.from = from;
      params.to = app.getMiniAppCacheInfo().userInfo.accid;
      postOptMsgReq(app, params);
    }
  }, 60000);

}

/**
* 执行代发消息请求
* @param {*} params 
*/
function postOptMsgReq(app, params) {
  new Promise(function (resolve, reject) {
    app.api.im.postOptMsg(params).onSuccess(function (res) {
      if (res) {
        resolve(res);
      } else {
        reject();
        showErrorMessage("响应数据为空");
      }
    }).onFail(function (res) {
      reject();
      showErrorMessage(res.msg);
    }).start();
  }).then(function (value) {
    console.log(value)
  }).catch(function (e) {
    console.log(e)
  });
}


/**
* 进入聊天界面
* @param {*} params 
*/
function toChart(app,buildingData,optData,source) {
  if(!optData.nimAccid){
    showErrorMessage("该楼盘咨询账号异常");
    return;
  }
  if (buildingData) {
    if (buildingData.price =="0 元/m²"){
      buildingData.price="待定"
    }
    let res = {
      "type": 1,
      "data": {
        "id": buildingData.id,
        "name": buildingData.title,
        "boroughAddress": buildingData.adress,
        "price": buildingData.price,
        "image_url": buildingData.thumbUrl,
        "url": buildingData.url,
        "bldAtrbRegion": buildingData.cityareaName,
        "bldAtrbRegionSection": buildingData.sectionName,
        "bldStatus": buildingData.attribute
      }
    }
    app.store.dispatch({
      type: 'CurrentSessionHomeInfo_Change',
      payload: res
    })
  }

 
  // 更新会话对象
  app.store.dispatch({
    type: 'CurrentChatTo_Change',
    payload: 'p2p-' + optData.nimAccid,
    // payload: 'p2p-1120524667430375424'
  })

  let jsonParam = {
    chatTo: optData.nimAccid,
    // chatTo: '1120524667430375424',
    type: 'p2p',
    chatingSource: source,
    nick: optData.name,
    photoUrl: optData.imgUrl,
  }
  
  wx.navigateTo({
    url: '/pages/chating/chating?jsonParam=' + encodeURIComponent(JSON.stringify(jsonParam)),
  })

}

/**
 * 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
 */
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
  return currentdate;
}


module.exports = {
  isNullOrEmpty: isNullOrEmpty,
  isPhoneNumber: isPhoneNumber,
  showErrorMessage: showErrorMessage,
  isNotNull: isNotNull,
  objectIsEqual: objectIsEqual,
  setStorageOpts: setStorageOpts,
  getStorageSynOpts: getStorageSynOpts,
  postOptCardMsg: postOptCardMsg,
  postOptBusyMsg: postOptBusyMsg,
  toChart: toChart,
  getNowFormatDate:getNowFormatDate
};