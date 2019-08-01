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
    des: "",
    miniAppPath: "",
    look: 0,
    defaultPosterIcon: "/images/icon-miniapp-code.jpg",
    canvasData: {
      canvasId: 'posterCode',
      canvasWidth: '750',
      canvasHeight: '300',
      codePath: '/images/icon-miniapp-code.jpg',
      color: '#000000'
    },
    greenCanvasData: {
      canvasId: 'greenPosterCode',
      canvasWidth: '750',
      canvasHeight: '300',
      codePath: '/images/icon-miniapp-code.jpg',
      color: '#61ce35'
    },
    blueCanvasData:{
      canvasId: 'bluePosterCode',
      canvasWidth: '750',
      canvasHeight: '300',
      codePath: '/images/icon-miniapp-code.jpg',
      color: '#027eff'
    },
    redCanvasData: {
      canvasId: 'redPosterCode',
      canvasWidth: '750',
      canvasHeight: '300',
      codePath: '/images/icon-miniapp-code.jpg',
      color: '#eb040a'
    }
    
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
        "action": "getSettingCT",
        "ctId": this.data.pageParams.ctId
      },
      success: res => {
        updateData['title'] = res.result.data.ct.title;
        updateData['look'] = res.result.data.ct.look;
        updateData['des'] = res.result.data.ct.des;
        updateData['defaultPosterIcon'] = res.result.data.codePath;
        wx.downloadFile({
          url: res.result.data.codePath,
          success(dlres) {
            wx.hideLoading();
            if (dlres.statusCode === 200) {
              updateData['canvasData.codePath'] = dlres.tempFilePath;
              updateData['blueCanvasData.codePath'] = dlres.tempFilePath;
              updateData['redCanvasData.codePath'] = dlres.tempFilePath;
              updateData['greenCanvasData.codePath'] = dlres.tempFilePath;
            }
            _this.setData(updateData);
          },
          fail() {
            wx.hideLoading()
          }
        })


     
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
   * 点击下载小程序码图片
   */
  onClickDownloadPoster: function(e) {
    console.log("onClickDownloadPoster", "onClickDownloadPoster");
    let _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _this.loadImg()
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.showModal({
            content: '检测到您未授予小程序 “保存图片到系统相册” 的权限，是否去设置打开？',
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else {
          _this.loadImg()
        }
      }
    })

  },

  loadImg: function loadImg() {

    wx.showLoading({
      mask: true
    })
    wx.downloadFile({
      url: this.data.defaultPosterIcon,
      success(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              wx.showToast({
                title: '已保存到相册',
                duration: 1500
              })
            },
            fail() {
              wx.hideLoading()
            }
          })
        }
      },
      fail() {
        wx.hideLoading()
      }
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
      url: '/pages/edit-ct/edit-ct?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },

  /**
   * 点击转发
   * @param {*} e 
   */
  onClickShare: function(e) {
    console.log("onClickShare", e);
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
  onClickNoReadListItem: function(e) {
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