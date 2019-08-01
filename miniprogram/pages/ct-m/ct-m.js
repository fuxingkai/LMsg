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
    title: "",
    miniAppPath: "",
    look: 0,
    lms: [
      // {
      //   "name": "小妮",
      //   "headimg": "https://woniujia.oss-cn-shenzhen.aliyuncs.com/consultant_head_photo/2.png",
      //   "time": "2018-06-26 14:12:22",
      //   "content": "对的很不错额",
      //   "isChoose": false,
      //   "isTop": false,
      //   "reply": {
      //     "content": "",
      //     "like":0,
      //     "isLike":false,
      //   },
      //   "like":0,
      //   "isLike":false,
      // },

    ],
    noReadLMs:[

    ],
    noReadLMsloadMore: {
      enableLoadMore: false,
      hasMore: false,
    },
    loadMore: {
      enableLoadMore: false,
      hasMore: true,
    },
  },

  onLoad: function(options) {
    this.data.pageParams = JSON.parse(decodeURIComponent(options.jp));
    console.log("pageParams", this.data.pageParams);
    this.setData({
      pageParams: this.data.pageParams,
      miniAppPath: "pages/ct/ct?jp=" + options.jp,
    });
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
        "action": "getMCT",
        "ctId": this.data.pageParams.ctId
      },
      success: res => {
        wx.hideLoading();
        console.log("ct", res);

        updateData['title'] = res.result.data.ct.title;
        updateData['look'] = res.result.data.ct.look;
        updateData['des'] = res.result.data.ct.des;
        updateData['lms'] = res.result.data.comments;
        updateData['noReadLMs'] = res.result.data.noDealcomments;
        _this.setData(updateData);
      },
      fail: err => {
        wx.hideLoading();
        console.error('list', err)

      }
    })
  },

  onClickCopyPath: function(e) {
    wx.setClipboardData({
      data: this.data.miniAppPath,
    })

  },

  /**
   * 点击预览
   * @param {*} e 
   */
  onClickPreview: function(e) {
    wx.navigateTo({
      url: "/" + this.data.miniAppPath,
    })
  },

  /**
   * 点击配置
   * @param {*} e 
   */
  onClickSetting: function(e) {
    let jp = {
      ctId: this.data.pageParams.ctId,
    }
    wx.navigateTo({
      url: '/pages/as-p/as-p?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },


  /**
   * 点击item细向
   */
  onClickListItem: function(e) {
    console.log("onClickListItem", e);
    let updateData = {};
    let _this = this;
    switch (e.detail.clickEvent.target) {
      case 'choose':
        {
          console.log("onClickListItem", "choose");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "chooseComment",
              "commentId": e.detail._id,
              "operate": e.detail.isChoose ? 2 : 1,
            },
            success: res => {
              wx.hideLoading();
              console.log("chooseComment", res);

              let lms = _this.data.lms;
              let lm = _this.data.lms[e.detail.index];
              lm.isChoose = lm.isChoose == true ? false : true;
              lms.splice(e.detail.index, 1, lm);
              updateData['lms'] = lms;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('chooseComment', err)
            }
          })

          break;
        }
      case 'top':
        {
          console.log("onClickListItem", "choose");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "topComment",
              "commentId": e.detail._id,
              "operate": e.detail.isTop ? 2 : 1,
            },
            success: res => {
              wx.hideLoading();
              console.log("topComment", res);

              let lms = _this.data.lms;
              let lm = _this.data.lms[e.detail.index];
              lm.isTop = lm.isTop == true ? false : true;
              lms.splice(e.detail.index, 1, lm);
              updateData['lms'] = lms;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('topComment', err)
            }
          })

          break;
        }
      case 'reply':
        {
          console.log("onClickListItem", "reply");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "replyComment",
              "commentId": e.detail._id,
              "reply": e.detail.replyData,
            },
            success: res => {
              wx.hideLoading();
              console.log("replyComment", res);

              let lms = _this.data.lms;
              let lm = _this.data.lms[e.detail.index];
              lm.reply = e.detail.replyData;
              lms.splice(e.detail.index, 1, lm);
              updateData['lms'] = lms;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('replyComment', err)
            }
          })

          break;
        }
      default:
        {
          break
        }
    }
  },

  /**
   * 点击未读item细向
   */
  onClickNoReadListItem: function (e) {
    console.log("onClickListItem", e);
    let updateData = {};
    let _this = this;
    switch (e.detail.clickEvent.target) {
      case 'choose':
        {
          console.log("onClickListItem", "choose");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "chooseComment",
              "commentId": e.detail._id,
              "operate": e.detail.isChoose ? 2 : 1,
            },
            success: res => {
              wx.hideLoading();
              console.log("chooseComment", res);

              let noReadLMs = _this.data.noReadLMs;
              let lm = _this.data.noReadLMs[e.detail.index];
              lm.isChoose = lm.isChoose == true ? false : true;
              noReadLMs.splice(e.detail.index, 1, lm);
              updateData['noReadLMs'] = noReadLMs;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('chooseComment', err)
            }
          })

          break;
        }
      case 'top':
        {
          console.log("onClickListItem", "choose");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "topComment",
              "commentId": e.detail._id,
              "operate": e.detail.isTop ? 2 : 1,
            },
            success: res => {
              wx.hideLoading();
              console.log("topComment", res);

              let noReadLMs = _this.data.noReadLMs;
              let lm = _this.data.noReadLMs[e.detail.index];
              lm.isTop = lm.isTop == true ? false : true;
              noReadLMs.splice(e.detail.index, 1, lm);
              updateData['noReadLMs'] = noReadLMs;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('topComment', err)
            }
          })

          break;
        }
      case 'reply':
        {
          console.log("onClickListItem", "reply");
          wx.showLoading({
            mask: true
          });
          wx.cloud.callFunction({
            name: "ct",
            data: {
              "action": "replyComment",
              "commentId": e.detail._id,
              "reply": e.detail.replyData,
            },
            success: res => {
              wx.hideLoading();
              console.log("replyComment", res);

              let noReadLMs = _this.data.noReadLMs;
              let lm = _this.data.noReadLMs[e.detail.index];
              lm.reply = e.detail.replyData;
              noReadLMs.splice(e.detail.index, 1, lm);
              updateData['noReadLMs'] = noReadLMs;
              console.log("updateData", updateData);
              _this.setData(updateData);
            },
            fail: err => {
              wx.hideLoading();
              console.error('replyComment', err)
            }
          })

          break;
        }
      default:
        {
          break
        }
    }
  },

  onShareAppMessage: function(res) {
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