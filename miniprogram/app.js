import WeAppRedux from '/redux/index.js';
import createStore from '/redux/createStore.js';
import reducer from '/store/reducer.js';

import ENVIRONMENT_CONFIG from '/config/envConfig.js'
import PAGE_CONFIG from '/config/pageConfig.js'

import IMController from '/controller/im.js'

// const mtjwxsdk = require('./utils/mtj-wx-sdk.js');

var api = require('/utils/api.js');
var util = require('/utils/sh_util.js');

const {
  Provider
} = WeAppRedux;
const store = createStore(reducer) // redux store

var provider = Provider(store)({
  globalData: {
    ENVIRONMENT_CONFIG,
    PAGE_CONFIG,
    userInfo: null,
  },
  /**
   * 应用 API
   */
  api: api,

  /**
   * 系统信息
   */
  systemInfo: null, // 系统信息

  /**
   * 应用缓存信息
   */
  miniAppCacheInfo: null,

  /**
   * 应用默认缓存信息
   */
  defaultMiniAppCacheInfo: {
    wxUserInfo: {
      "openId":"",
      "nickName": "",
      "gender": 0,
      "city": "",
      "province": "",
      "country": "",
      "avatarUrl": ""
    },
    userType:0,
    token:"",
  },

  /**
   * 
   */
  siteInfo: require("siteinfo.js"),

  onShow: function(options) {

  },

  onLaunch: function(opt) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

  },
  /**
   * 设置小程序缓存的信息
   */
  setMiniAppCacheInfo: function (miniAppCacheInfo) {
    try {
      this.miniAppCacheInfo = miniAppCacheInfo;
      wx.setStorageSync('miniAppCacheInfo', miniAppCacheInfo);
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * 获得小程序缓存的信息
   */
  getMiniAppCacheInfo: function () {
    if (this.miniAppCacheInfo != null) {
      return this.miniAppCacheInfo;
    }
    try {
      let cache = wx.getStorageSync('miniAppCacheInfo');
      this.miniAppCacheInfo = cache == null || cache == '' ? this.defaultMiniAppCacheInfo : cache;
    } catch (e) {
      console.log(e);
    }
    return this.miniAppCacheInfo;
  },

    /**
   * 向后台上传formid
   * @param {*} e 
   */
  postFormId: function postFormId(params) {
    let miniAppCacheInfo = this.getMiniAppCacheInfo();
    if (miniAppCacheInfo.token != "") {
       params.token = miniAppCacheInfo.token;
    }
    this.api.user.postFormId(params).onSuccess(function (res) {
      console.log(res);
    }).onFail(function (error) {}).start();
  },
});
App(
  provider
)