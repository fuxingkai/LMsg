import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
var config = require("../../siteinfo.js");
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    pageParams: {},
    oprateBg:"/images/as_oprate_bg.png",
    appid:"wxc8428c65224939d1"
  },

  onLoad: function (options) {

  },

  onShow: function () {
   
  },

  onClickCopyAppId: function (e) {
    wx.setClipboardData({
      data: this.data.appid,
    })

  },

  /**
   * 点击预览
   * @param {*} e 
   */
  onClickLook: function (e) {
    let jp = {
      url: "https://mp.weixin.qq.com/s/wogwZdQnpnT-_kmtEk2Jtw",
    }
    wx.navigateTo({
      url: '/pages/web/web?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },



  onShareAppMessage: function (res) {
    console.log(res)
    let jp = {
      ctId: this.data.pageParams.ctId,
    }

    let path = "pages/ct/ct?jp=" + encodeURIComponent(JSON.stringify(jp));

    return {
      title: '[邀请留言]' + this.data.title,
      path: path,
      imageUrl: '/images/icon_share_default_bg.png'
    }

  }

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)