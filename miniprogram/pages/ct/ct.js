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
      //     "like": 0,
      //     "isLike": false,
      //   },
      //   "like": 0,
      //   "isLike": false,
      // }
    ],
    loadMore: {
      enableLoadMore: false,
      hasMore: true,
    },
    isLoading:true,
    isShowEmpty:false,
  },

  onLoad: function(options) {
    if (options.jp == undefined || options.jp==null){
        options.jp = '%7B%22ctId%22%3A%229afd9b6a5d3037530a224f414cc37ff8%22%7D'
    }
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
    updateData['isLoading'] = true;
    wx.cloud.callFunction({
      name: "ct",
      data: {
        "action": "getCT",
        "ctId": this.data.pageParams.ctId
      },
      success: res => {
        wx.hideLoading();
        console.log("list", res);
        updateData['title'] = res.result.data.ct.title;
        updateData['des'] = res.result.data.ct.des;
        updateData['lms'] = res.result.data.comments;
        updateData['isLoading'] = false;
        _this.setData(updateData);
      },
      fail: err => {
        wx.hideLoading();
        console.error('list', err)
        updateData['isLoading'] = false;
        updateData['isShowEmpty'] = true;
        _this.setData(updateData);
      }
    })
  },

  onClickCopyPath: function(e) {
    wx.setClipboardData({
      data: this.data.miniAppPath,
    })

  },

  /**
   * 点击评论
   * @param {*} e 
   */
  onClickAddComment: function(e) {
    let jp = {
      "ctId": this.data.pageParams.ctId,
    }
    wx.navigateTo({
      url: '/pages/add-comment/add-comment?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },

  /**
   * 点击配置
   * @param {*} e 
   */
  onClickSetting: function(e) {
    console.log("onClickSetting", e);
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
  onClickListItem: function (e) {
    console.log("onClickMoreListItem", e);
    let updateData = {};
    let _this = this;
    switch (e.detail.clickEvent.target) {
      case 'delete': {
        console.log("onClickMoreListItem", "delete");
        let updateData = {};
        let _this = this;
        wx.showLoading({
          mask: true
        });
        wx.cloud.callFunction({
          name: "ct",
          data: {
            "action": "removeComment",
            "commentId": e.detail._id,
            "ctId": e.detail.ctId,
          },
          success: res => {
            wx.hideLoading();
            console.log("removeComment", res);
            let lms = _this.data.lms;
            lms.splice(e.detail.index, 1);
            updateData['lms'] = lms;
            console.log("updateData", updateData);
            _this.setData(updateData);
          },
          fail: err => {
            wx.hideLoading();
            console.error('removeComment', err)
          }
        })
        break;
      }
      case 'commentLike': {
        console.log("onClickListItem", "commentLike");
        wx.showLoading({
          mask: true
        });
        wx.cloud.callFunction({
          name: "ct",
          data: {
            "action": "likeComment",
            "commentId": e.detail._id,
            "ctId": e.detail.ctId,
            "operate": e.detail.isLike ? 2 : 1,
            "commentType": "comment",
          },
          success: res => {
            wx.hideLoading();
            console.log("likeComment", res);

            let lms = _this.data.lms;
            let lm = _this.data.lms[e.detail.index];
            if (lm.isLike) {
              lm.like = lm.like - 1;
            } else {
              lm.like = lm.like + 1;
            }
            lm.isLike = lm.isLike == true ? false : true;
            lms.splice(e.detail.index, 1, lm);
            updateData['lms'] = lms;
            console.log("updateData", updateData);
            _this.setData(updateData);
          },
          fail: err => {
            wx.hideLoading();
            console.error('likeComment', err)
          }
        })

        break;
      }

      case 'replyLike': {
        console.log("onClickListItem", "replyLike");
        wx.showLoading({
          mask: true
        });
        wx.cloud.callFunction({
          name: "ct",
          data: {
            "action": "likeComment",
            "commentId": e.detail._id,
            "operate": e.detail.reply.isLike ? 2 : 1,
            "commentType": "reply",
          },
          success: res => {
            wx.hideLoading();
            console.log("likeComment", res);

            let lms = _this.data.lms;
            let lm = _this.data.lms[e.detail.index];
            if (lm.reply.isLike) {
              lm.reply.like = lm.reply.like - 1;
            } else {
              lm.reply.like = lm.reply.like + 1;
            }
            lm.reply.isLike = lm.reply.isLike == true ? false : true;
            lms.splice(e.detail.index, 1, lm);
            updateData['lms'] = lms;
            console.log("updateData", updateData);
            _this.setData(updateData);
          },
          fail: err => {
            wx.hideLoading();
            console.error('likeComment', err)
          }
        })

        break;
      }

      default: {
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