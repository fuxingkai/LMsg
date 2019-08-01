import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
var config = require("../../siteinfo.js");
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    cts: [      
    ],
    loadMore: {
      enableLoadMore: false,
      hasMore: true,
    },
    noReadTotal:0
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
        "action": "getCTList"
      },
      success: res => {
        wx.hideLoading();
        console.log("list", res);
        _this.data.cts = [];
        let noReadTotal = 0;
        res.result.data.list.forEach(function (value, index) {
          let item = value;
          item.miniAppPath = "";
          noReadTotal = noReadTotal + item.noReadCount;
          _this.data.cts.push(item);
        });
        updateData['cts'] = _this.data.cts;
        updateData['noReadTotal'] = noReadTotal;
        
        _this.setData(updateData);
      },
      fail: err => {
        wx.hideLoading();
        console.error('list', err)

      }
    })
  },

  onClickMoreListItem: function(e) {
    console.log("onClickMoreListItem",e);
    let updateData = {};
    let _this = this;
    switch (e.detail.clickEvent.target) {
      case 'item': {
        console.log("onClickMoreListItem", "item");
        let jp = {
          ctId: e.detail._id,
        }
        wx.navigateTo({
          url: '/pages/ct-m/ct-m?jp=' + encodeURIComponent(JSON.stringify(jp)),
        })
        break;
      }
      case 'delete': {
        console.log("onClickMoreListItem", "delete");
        wx.cloud.callFunction({
          name: "ct",
          data: {
            "action": "removeCT",
            "ctId": e.detail._id,
          },
          success: res => {
            console.log("removeCT", res);
            let cts = _this.data.cts;
            cts.splice(e.detail.index, 1);
            updateData['cts'] = cts;
            console.log("updateData", updateData);
            _this.setData(updateData);
          },
          fail: err => {
            console.error('removeCT', err)

          }
        })
        break;
      }
      case 'edit': {
        console.log("onClickMoreListItem", "edit");
        let jp = {
          ctId: e.detail._id,
        }
        wx.navigateTo({
          url: '/pages/edit-ct/edit-ct?jp=' + encodeURIComponent(JSON.stringify(jp)),
        })
        break;
      }
      default: {
        break
      }
    }
  },

  onClickCreateCT: function(e) {
    wx.navigateTo({
      url: '/pages/add-ct/add-ct',
    })
  },

  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      let jp = {
        ctId: res.target.dataset.item._id,
      }
     
      let path = "pages/ct/ct?jp=" + encodeURIComponent(JSON.stringify(jp));
     
      return {
        title: '[邀请留言]' + res.target.dataset.item.title,
        path: path,
        imageUrl: '/images/icon_share_default_bg.png'
      }
    }

  }

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)