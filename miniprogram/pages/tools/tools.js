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
   
  },

  /**
   *点击贷款计算器
   */
  onClickLoanCalc: function(e) {
    let jp = {
    }
    wx.navigateTo({
      url: '/pages/loan-calc/loan-calc?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)