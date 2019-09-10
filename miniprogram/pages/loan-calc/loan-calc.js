import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    tabLoanId:"house_commercial_loan",
  },

  onLoad: function () {

  },

  onShow: function () { },

  /**
 * tab切换回调
 * @param {*} e 
 */
  onClickTabLoan: function onClickTabStatistics(e) {
    console.log(e);
    this.setData({
      tabLoanId: e.detail.id
    });
  },



}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)