import {
  connect
} from '../../redux/index.js'
let app = getApp();
var util = require('../../utils/sh_util.js');
import IMController from '../../controller/im.js'

let pageConfig = {
  data: {
    citys: [],
    formId: "",
  },

  onLoad: function (options) {

  },

  onShow: function () {
    let _that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          _that.loadData();
        }
      }
    })
  },

  loadData: function loadData() {
    this.checkSession();
  },

  /**
   * 点击授权
   * @param {*} e 
   */
  onClickAuth: function onClickAuth(e) {
    console.log("onClickAuth", e);
    let _that = this;
    if ("getUserInfo:ok" == e.detail.errMsg) {
      wx.getSetting({
        success(res) {
          console.log("onClickAuth2", res);
          _that.loadData();
        }
      })
    }
  },

  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    let miniAppCacheInfo = app.getMiniAppCacheInfo();
    if (miniAppCacheInfo.wxUserInfo != undefined && miniAppCacheInfo.wxUserInfo.openid != undefined && miniAppCacheInfo.wxUserInfo.openid != "") {
      let params = {};
      params.formId = e.detail.formId;
      app.postFormId(params);
    } else {
      this.data.formId = e.detail.formId;
      this.setData({
        formId: this.data.formId,
      });
    }
  },

  /**
   * 检查用户会话状态，如果用户退出登录就重新进行登录
   */
  checkSession: function () {
    let _that = this;
    wx.checkSession({
      success: function (res) {
        console.log('checkSession success', '');
        wx.navigateBack({
          delta: 1
        });
      },
      fail: function (res) {
        console.log('checkSession fail', res);
        // 更新当前会话对象账户
        _that.doLogin();
      }
    })
  },

  /**
   * 执行登录相关操作
   * @param {*} params 
   */
  doLogin: function () {
    let _that = this;
    wx.showLoading({
      mask: true
    });

    Promise.all([_that.postLogin()]).then(function (value) {
      console.log(value)

      //重设应用缓存
      let miniAppCacheInfo = app.getMiniAppCacheInfo();
      let userInfo = {};
      userInfo.id = value[0].data.data.id;
      userInfo.openId = value[0].data.data.openId;
      userInfo.nickName = value[0].data.data.nickName;
      userInfo.city = value[0].data.data.city;
      userInfo.province = value[0].data.data.province;
      userInfo.country = value[0].data.data.mobile;
      userInfo.avatarUrl = value[0].data.data.avatarUrl;
      miniAppCacheInfo.userType = value[0].data.data.userType;
      miniAppCacheInfo.token = value[0].data.data.token;
      miniAppCacheInfo.wxUserInfo = userInfo;
      app.setMiniAppCacheInfo(miniAppCacheInfo);

      if (_that.data.formId != "") {
        let params = {};
        params.formId = _that.data.formId;
        app.postFormId(params);
      }
      
      wx.navigateBack({
        delta: 1
      });
      wx.hideLoading();
    }).catch(function (e) {
      console.log(e);
      wx.hideLoading();
    });
  },

  /**
   * 执行登录
   * @param {*} params 
   */
  postLogin: function (params) {
    let _that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success(res) {
          console.log("postLogin login success", res);
          if (!res.code) {
            reject();
          }
          wx.getUserInfo({
            withCredentials: true,
            success(userRes) {
              app.api.user.postLogin({
                'code': res.code,
                "signature":userRes.signature,
                "rawData":userRes.rawData,
                'encryptedData': userRes.encryptedData,
                'iv': userRes.iv
              }).onSuccess(function (res) {
                if (res) {
                  resolve(res);
                } else {
                  reject();
                  util.showErrorMessage("登录失败");
                }
              }).onFail(function (res) {
                reject();
                util.showErrorMessage(res.msg);
              }).start();
            }
          })
        }
      });

    });
  },

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)