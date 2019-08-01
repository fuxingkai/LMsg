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

  onLoad: function(options) {

  },

  onShow: function() {

  },

  loadData: function loadData() {
    this.checkSession();
  },

  /**
   * 点击授权
   * @param {*} e 
   */
  onClickAuth: function onClickAuth(e) {

    console.log('onClickAuth', e)
    let _that = this;
    if ("getUserInfo:ok" == e.detail.errMsg) {
      wx.showLoading({
        mask: true
      });
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
              app.setMiniAppCacheInfo(res.result.data)
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
  },

  formSubmit: function formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    wx.cloud.callFunction({
      name: "templateMessage",
      data: {
        "action": "addFormId",
        "formId": e.detail.formId
      },
      success: res => {
        console.log("templateMessage", res);

      },
      fail: err => {
        console.error('templateMessage', err)

      }
    })
  },


}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)