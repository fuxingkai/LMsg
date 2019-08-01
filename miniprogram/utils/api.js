'use strict';

var Fetch = require('base_api.js');

let app = getApp();

// var URI_ES_JAVA = 'http://172.16.2.213:8086/app/api/public/1.0/';//效果软件测试
// var URI_ES_JAVA = 'http://182.61.33.241:8089/app/api/public/1.0/'; //效果软件测试
var URI_ES_JAVA = 'https://cc.jufuns.cn/cc1.2/app/api/public/1.0/'; //线上


// var URI_JAVA = 'http://182.61.33.241:8111/league/api/'; //测试
var URI_JAVA = 'https://woniujia.juke8.cn/league/api/'; //线上

// var URI_PHP = 'http://172.16.2.250/mo_bile/';//测试
// var URI_PHP = 'http://test.woniujia.com.cn/mo_bile/'; //测试
var URI_PHP = 'https://www.woniujia.com.cn/mo_bile/'; //线上

// var URI_AC_Test = 'http://192.168.1.161:8087' //活动营销本地
// var URI_AC_Test = 'http://211.149.203.186:8072' //活动营销测试
var URI_AC_Test = 'https://cc.jufuns.cn/wm-api' //活动营销线上


var METHOD_POST = 'POST';
var METHOD_GET = 'GET';

function fetch(path, method, params, header) {
  if (app == null || app == undefined) {
    app = getApp();
  }
  if (app == null || app == undefined) {
    if (params.cityname != undefined || params.cityname != null) {
      path = path + '&is_wxapp=1&cityname=' + params.cityname;
    } else {
      path = path + '&is_wxapp=1';
    }
  } else {
    if (app.getCurCityInfo() != undefined || app.getCurCityInfo().cityLetter != undefined) {
      path = path + '&is_wxapp=1&cityname=' + app.getCurCityInfo().cityLetter;
    } else {
      if (params.cityname != undefined || params.cityname != null) {
        path = path + '&is_wxapp=1&cityname=' + params.cityname;
      } else {
        path = path + '&is_wxapp=1';
      }
    }
  }
  return new Fetch(path, method, Object.assign({}, params), Object.assign({
    'Content-Type': 'application/json',
    'HTTP_USER_APPLET': 'WX_APPLET'
  }, header));
}


const $ARequest = (url, method = 'GET', data, header = {}) => {
  console.info('请求的接口：', url, '\n请求的数据：', data)
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      header: Object.assign(header, {
        'accessToken': wx.getStorageSync('activityToken') || ''
      }),
      data: data,
      method: method,
      dataType: 'json',
      success: function (data) {
        resolve(data)
        console.info('返回的数据：', data)
      },
      fail: function (data) {
        if (typeof reject == 'function') {
          reject(data);
        } else {
          console.log(data);
        }
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
}


/**
 * im相关
 */
var im = {
  /**
   * 获取IM账号
   */
  getIMAccount: function getIMAccount(params) {
    return fetch(URI_JAVA + 'nim/account/find?', METHOD_POST, params);
  },

  /**
   * 获取在线咨询IM账号
   */
  getLiveIMAccount: function getLiveIMAccount(params) {
    return fetch(URI_JAVA + 'nim/consultant/find?', METHOD_POST, params);
  },

  /**
   * 代发咨询师消息
   */
  postOptMsg: function postOptMsg(params) {
    return fetch(URI_JAVA + 'nim/custom-msg/send?', METHOD_POST, params);
  },

}



/**
 * 首页
 */
var index = {

  /**
   * 获得首页数据
   */
  getIndexData: function getIndexData(params) {
    let path = 'index.php?act=index&op=index_new&is_wxapp=1';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },

  /**
   * 获得首页更多数据
   */
  getIndexMoreData: function getIndexMoreData(params) {
    let path = 'index.php?act=newhouse&op=list&curpage=' + params.curpage + '&list_num=' + params.pageSize;
    return fetch(URI_PHP + path, METHOD_GET, params);
  },

  /**
   * 获得城市列表数据
   */
  getCityListData: function getCityListData(params) {
    let path = 'index.php?act=ajax&op=get_location_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },

};



/**
 * 楼盘
 */
var building = {

  /**
   * 获得楼盘筛选样板结构
   */
  getBuildingScreeningData: function getBuildingScreeningData(params) {
    let path = 'index.php?act=newhouse&op=screening';
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘列表数据
   */
  getBuildingListData: function getBuildingListData(params) {
    let path = 'index.php?act=newhouse&op=list&curpage=' + params.page + '&list_num=' + params.pageSize + '&c=' + params.sAreaId + '&o=' + params.sSortId + '&l=' + params.sTypeId + '&m=' + params.sStatusId ;
    if (params.t && params.t!=""){
      path = path + '&t=' + params.t; 
    }
    if (params.sPriceId && params.sPriceId != ""){
      path = path + '&p=' + params.sPriceId;
    }
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘搜索数据
   */
  getBuildidingSearchData: function getBuildidingSearchData(params) {
    let path = 'index.php?act=newhouse&op=list&curpage=1&list_num=100&q=' + params.keyword;
    // let path = 'index.php?act=search&op=search_list&keyword=' + params.keyword;
    return fetch(URI_PHP + path, METHOD_GET, params);
  },

  /**
   * 获得楼盘详情数据
   */
  getBuildingDetailData: function getBuildingDetailData(params) {
    let path = 'index.php?act=newhouse&op=detail&id=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘详情图片数据
   */
  getBuildingDetailImageData: function getBuildingDetailImageData(params) {
    let path = 'index.php?act=newhouse&op=photo&mid=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘详情更多数据
   */
  getBuildingDetailMoreData: function getBuildingDetailMoreData(params) {
    let path = 'index.php?act=newhouse&op=info&id=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘更多动态数据
   */
  getBuildingDynamicData: function getBuildingDynamicData(params) {
    let path = 'index.php?act=newhouse&op=news&current_page=' + params.page + '&list_num=' + params.pageSize + '&id=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },

  /**
   * 获得楼盘更多户型数据
   */
  getBuildingModeData: function getBuildingModeData(params) {
    let path = 'index.php?act=newhouse&op=apartment&current_page=' + params.page + '&list_num=' + params.pageSize + '&id=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },


  /**
   * 获得楼盘更多户型详情数据
   */
  getBuildingModeDetailData: function getBuildingModeDetailData(params) {
    let path = 'index.php?act=newhouse&op=apartment_detail&id=' + params.id;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },




  /**
   * 订阅楼盘信息
   */
  subscribeBuildingInfo: function subscribeBuildingInfo(params) {
    let path = 'index.php?act=newhouse&op=add_dingyue'
    params.client_type = 'miniApp';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },

  /**
   * 预约看房
   */
  orderLookBuilding: function orderLookBuilding(params) {
    let path = 'index.php?act=newhouse&op=add_booking'
    params.client_type = 'miniApp';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },


};



/**
 * 用户
 */
var user = {

  /**
   * 执行登录操作
   */
  postLogin: function postLogin(params) {
    let path = 'index.php?act=connect_wx&op=login&type=wxcode';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },

  /**
   * 保存用户手机
   */
  postUserPhone: function postUserPhone(params) {
    let path = 'index.php?act=ajax&op=getWxPhone';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },

  /**
   * 向后台上传formid
   */
  postFormId: function postFormId(params) {
    let path = 'index.php?act=ajax&op=saveOpenForm';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },

  /**
   *  记录用户浏览楼盘
   */
  postSaveMemberBorough: function postSaveMemberBorough(params) {
    let path = 'index.php?act=newhouse&op=saveMemberBorough';
    return fetch(URI_PHP + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },


  /**
   * 获得浏览历史数据
   */
  getLookHistoryListData: function getLookHistoryListData(params) {
    let path = 'index.php?act=newhouse&op=get_borough_history&member_id=' + params.id + '&crupage=' + params.page;
    return fetch(URI_PHP + path, METHOD_GET, {});
  },


};


/**
 * 咨询师
 */
var consultor = {

  /**
   * 咨询师列表 
   */
  getConsultorList: function (params) {
    let path = 'consultant/list/by-area?';
    return fetch(URI_JAVA + path, METHOD_POST, params);
  },
  /**
   * 咨询师详情
   */
  getConsultorDetail: function (params) {
    let path = 'consultant/get?';
    return fetch(URI_JAVA + path, METHOD_POST, params);
  },

  /**
   * 咨询师详情2
   */
  getConsultorDetail2: function (params) {
    let path = 'index.php?act=ajax&op=get_counselor_content_seo';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },


  /**
   * 咨询师服务动态列表
   */
  getConsultRecordList: function (params) {
    let path = 'consultant/activity/list?';
    return fetch(URI_JAVA + path, METHOD_POST, params);
  }
};


/**
 * 轨迹
 */
var trajectory = {

  /**
   *  微信分享-提交客户授权信息 
   */
  addWeixinInfo: function (params) {
    let path = 'weixinCust/addWeixinInfo?';
    return fetch(URI_ES_JAVA + path, METHOD_POST, params);
  },

  /**
   *  微信分享-提交用户的使用轨迹 
   */
  addWeixinTrace: function (params) {
    let path = 'weixinCust/addWeixinTrace?';
    let curParams = {};
    curParams.unid = params.unid;
    curParams.action = params.action;
    curParams.actionName = params.actionName;
    curParams.shareType = getCurrentPages().length == 1 ? 1 : 2;
    curParams.actionTime = params.actionTime;
    curParams.followId = params.followId;
    curParams.stayTime = params.stayTime;
    curParams.woUserId = params.woUserId != undefined ? params.woUserId : "";
    curParams.parentId = params.parentId != undefined ? params.parentId : "";
    curParams.actionId = params.actionId;
    return fetch(URI_ES_JAVA + path, METHOD_POST, curParams);
  },

};



/**
 * 楼盘资讯
 */
var buildingConsult = {
  /**
   * 获得首页数据
   */
  getBuildingConsultData: function (params) {
    let path = 'index.php?act=new&op=index_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
  getBuildingConsultClass: function (params) {
    let path = 'index.php?act=new&op=get_class';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
  /**
   * 获取分类数据
   * @param {*} params 
   */
  getBuildingConsultList: function (params) {
    let path = 'index.php?act=new&op=list_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
};

/**
 * 资讯详情
 */
var buildingConsultDetail = {
  /**
   * 获得主要数据
   */
  getMainData: function (params) {
    let path = 'index.php?act=new&op=detail_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
};


/**
 * 活动营销
 */
var activity = {
  /**
   * 提交用户获奖信息
   */
  submitUserInfo: function submitUserInfo(params) {
    let path = '/goodFortune/update'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 提现
   */
  withdraw: function withdraw(params) {
    let path = '/withdrawApply/save'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 提交用户获奖信息
   */
  updateUserInfo: function updateUserInfo(params) {
    let path = '/goodFortune/update'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 提交用户登录信息
   */
  activityLogin: function activityLogin(params) {
    let path = '/wechat/appLogin'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 抽奖
   */
  lottery: function lottery(params) {
    let path = '/activity/lottery'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 活动分享
   */
  activityShare: function activityShare(params) {
    let path = '/activity/share'
    return $ARequest(URI_AC_Test + path, METHOD_POST, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  },
  /**
   * 获得活动详情
   */
  getActivityDetail: function (params) {
    let path = '/activity/' + params.activityId;
    return $ARequest(URI_AC_Test + path, METHOD_GET);
  },
  /**
   * 获得我的钱包
   */
  getMyWallet: function (params) {
    let path = '/member/balance';
    return $ARequest(URI_AC_Test + path, METHOD_GET);
  },
  /**
   * 查询大转盘奖品列表
   */
  getPrizeList: function (params) {
    let path = '/activityPrize/list';
    return $ARequest(URI_AC_Test + path, METHOD_GET, params);
  },
  /**
   * 查询大转盘奖品列表
   */
  getPrizePeple: function (params) {
    let path = '/goodFortune/allList';
    return $ARequest(URI_AC_Test + path, METHOD_GET, params);
  },
  /**
   * 查询大转盘奖品列表
   */
  getMyprize: function (params) {
    let path = '/goodFortune/list';
    return $ARequest(URI_AC_Test + path, METHOD_GET, params);
  },
  /**
   * 获得活动列表
   */
  getActivityList: function (params) {
    let path = '/activity/list';
    return $ARequest(URI_AC_Test + path, METHOD_GET, params);
  },
};


/**
 * 微信服务相关接口
 */
var wxSeverApi = {
  /**
   * 获取小程序全局唯一后台接口调用凭据（access_token）
   */
  getAccessToken: function getAccessToken() {
    let path = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb95f720596289b1b&secret=9ee9afaea3ba53d77797b9716dd88428'
    return activityFetch(path, METHOD_GET, {});
  },
  /**
   * 发送模板消息
   */
  sendTemplateMessage: function sendTemplateMessage(params) {
    let path = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=21_JVD1vXmMWbtOdoKnSyWh6yz8-VQmmtnVokuEHt4lya389G_u-clRPGOmd_mwPAvKqevZR6xPpyxuA8LK6C7K48g7TjRRhb_MKGKj_FeQi2NDwZJFWm-TE1MBA_gSLPhACACVZ';
    let param = {
      "touser": "odNYf5cGt-HOVxX-QsJW6u8vkiqQ",
      "template_id": "vi3RCcFWeB_8MLqNtic8If_rmlcrn2uG2Jpajlk1HC0",
      "page": "/pages/index/index",
      "form_id": params.form_id,
      "data": {
        "keyword1": {
          "value": "339208499"
        },
        "keyword2": {
          "value": "2015年01月05日 12:30"
        },
        "keyword3": {
          "value": "腾讯微信总部"
        },
        "keyword4": {
          "value": "广州市海珠区新港中路397号"
        },
        "keyword5": {
          "value": "广州市海珠区新港中路397号"
        }
      },
      "emphasis_keyword": "339208499"
    }
    return activityFetch(path, METHOD_POST, param);
  },

  /**
   * 获取二维码
   */
  getWXacode: function getWXacode(params) {
    let path = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=21_3NVpGlaoOMGKaq9a8lCfdO39OaOU_na8zQRjR4ogXfOkbcRlmIE8ROhn7zGL71nVx_3feZjBr2YGIM9wrPmCuh7QmA0wD5UyYzGs3g92qiZkWEOALtb_wmEZRTBZIdZvNy3HnNMLO4xhuLYbPTCjADALPY';
    params.path = "page/index/index";
    params.width = 430;
    return activityFetch(path, METHOD_POST, params);
  },

};


/**
 * 房产百科
 */
var baike = {
  /**
   * 获得百科列表
   */
  getBaikeList: function (params) {
    let path = 'index.php?act=baike&op=list_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
  /**
   * 获得百科导航
   */
  getBaikeCeategory: function (params) {
    let path = 'index.php?act=baike&op=category';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },
};


/**
 * 房产详情
 */
var baikeDetail = {
  /**
   * 获得百科详情
   */
  getBaikeDetail: function (params) {
    let path = 'index.php?act=baike&op=detail_new';
    return fetch(URI_PHP + path, METHOD_GET, params);
  },

};


module.exports = {
  fetch: fetch,
  index: index,
  building: building,
  im: im,
  user: user,
  consultor: consultor,
  trajectory: trajectory,
  buildingConsult: buildingConsult,
  buildingConsultDetail: buildingConsultDetail,
  activity: activity,
  wxSeverApi: wxSeverApi,
  baike: baike,
  baikeDetail: baikeDetail
};