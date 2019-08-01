import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
var config = require("../../siteinfo.js");
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    title:"",//留言区标题
    acticleLink:"",//文章链接
    wxPublicName:"",//公众号名称,
    des:""//描述
  },

  onLoad: function() {

  },

  onShow: function() {},

  onClickCreateCT: function(e) {
    console.log("ct", e);
  },

  onCallTitle: function (e) {
    this.setData({
      "title": e.detail.value
    })
  },
  
  onCallActicleLink: function (e) {
    this.setData({
      "acticleLink": e.detail.value
    })
  },

  onCallWXPublicName: function (e) {
    this.setData({
      "wxPublicName": e.detail.value
    })
  },

  onCallDes: function (e) {
    this.setData({
      "des": e.detail.value
    })
  },
  

  formSubmit: function formSubmit(e) {
    let tip = "";
    if (this.data.wxPublicName == "") {
      tip = "公众号名称不能为空";
    }
    if (this.data.title==""){
      tip = "留言区标题不能为空";
    }
    if (tip != "") {
      wx.showToast({
        title: tip,
        duration: 1500,
        icon: 'none',
        mask: true
      })
      return;
    }
    wx.showLoading({
      mask: true
    });
    console.log('form发生了submit事件，携带数据为：', e.detail)
    wx.cloud.callFunction({
      name: "ct",
      data: {
        "action": "addCT",
        "formId": e.detail.formId,
        "ct":{
          "title":this.data.title,
          "acticleLink": this.data.acticleLink,
          "wxPublicName": this.data.wxPublicName,
          "des": this.data.des,
        }
      },
      success: res => {
        wx.hideLoading();
        console.log("templateMessage", res);
        if (res.result.code == 1) {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('templateMessage', err)

      }
    })
  },  

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)