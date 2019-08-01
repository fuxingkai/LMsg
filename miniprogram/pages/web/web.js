import { connect } from '../../redux/index.js'
let app = getApp();
let store = app.store;
var util = require('../../utils/sh_util.js');

let pageConfig = {
  data: {
    url: '',
    pageParams: {},
  },

  onLoad: function (options) {
    if (options.jp == undefined || options.jp == null) {
      options.jp = '%7B%22url%22%3A%22https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FwogwZdQnpnT-_kmtEk2Jtw%22%7D'
    }
    this.data.pageParams = JSON.parse(decodeURIComponent(options.jp));
    this.setData({
      pageParams: this.data.pageParams,
      url: this.data.pageParams.url,
    });
  },

  onShareAppMessage(options) {
    let jp = {
      url: this.data.url,
    }
    return {
      path: '/pages/web/url?jp=' + encodeURIComponent(JSON.stringify(jp)),
    }
  },

}

let mapStateToData = (state) => {
}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)