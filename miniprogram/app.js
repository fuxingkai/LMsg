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
      "nickName": "",
      "gender": 0,
      "city": "",
      "province": "",
      "country": "",
      "avatarUrl": ""
    },
    userType:0
  },

  /**
   * 
   */
  siteInfo: require("siteinfo.js"),

  onShow: function(options) {
    let _that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          _that.checkSession();
        }
      }
    })
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
 * 检查用户会话状态，如果用户退出登录就重新进行登录
 */
  checkSession: function () {
    let _that = this;
    wx.checkSession({
      success: function (res) {
        console.log('checkSession success', res);
      },
      fail: function (res) {
        console.log('checkSession fail', res);
        wx.getUserInfo({
          success: res => {
            console.log("getUserInfo", res);
            // 调用云函数
            wx.cloud.callFunction({
              name: "user",
              data: {
                "action": "login",
                "wxUserInfo": res.userInfo
              },
              success: res => {
                console.log("user", res);
                _that.setMiniAppCacheInfo(res.result.data)
                wx.navigateBack({
                  delta: 1
                });
                wx.hideLoading();
              },
              fail: err => {
                console.error('user', err)
                wx.hideLoading();
              }
            })
          }
        })
      }
    })
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
});
App(
  provider
)