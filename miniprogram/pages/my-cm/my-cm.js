import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
var config = require("../../siteinfo.js");
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    cms: [      
    ],
    loadMore: {
      enableLoadMore: false,
      hasMore: true,
    },
  },

  onLoad: function() {
  },

  onShow: function() {
    let updateData = {};
    let _this = this;
    wx.showLoading({
      mask: true
    });
    wx.cloud.callFunction({
      name: "ct",
      data: {
        "action": "getMyCMList"
      },
      success: res => {
        wx.hideLoading();
        console.log("list", res);
        _this.data.cms = [];
        res.result.data.cms.forEach(function (value, index) {
          let item = value;
          item.miniAppPath = "";
          _this.data.cms.push(item);
        });
        updateData['cms'] = _this.data.cms;
        
        _this.setData(updateData);
      },
      fail: err => {
        wx.hideLoading();
        console.error('list', err)

      }
    })
  },

  onClickMoreListItem: function(e) {
    let updateData = {};
    let _this = this;
    switch (e.detail.clickEvent.target) {
      case 'item': {
        console.log("onClickMoreListItem", "item");
        let jp = {
          ctId: e.detail.ctId,
        }
        wx.navigateTo({
          url: '/pages/ct/ct?jp=' + encodeURIComponent(JSON.stringify(jp)),
        })
        break;
      }
      default: {
        break
      }
    }
  }


}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)