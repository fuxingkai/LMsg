import {
  connect
} from '../../redux/index.js'

var util = require('../../utils/sh_util.js');
var config = require("../../siteinfo.js");
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    pageParams:{},
    title:"",//留言区标题
    content:"",//留言内容
    placeholder:"留言将由公众号筛选后显示,对所有人可见",
    lms: [
      // {
      //   "name": "小妮",
      //   "headimg": "https://woniujia.oss-cn-shenzhen.aliyuncs.com/consultant_head_photo/2.png",
      //   "time": "2018-06-26 14:12:22",
      //   "content": "这条是要置顶的",
      //   "isChoose": true,
      //   "isTop": true,
      //   "reply": {
      //     "content": "你很牛逼",
      //     "like": 10,
      //     "isLike": true,
      //   },
      //   "like": 1,
      //   "isLike": false,
      // }
    ],
    loadMore: {
      enableLoadMore: false,
      hasMore: true,
    },
  },

  onLoad: function (options) {
    this.data.pageParams = JSON.parse(decodeURIComponent(options.jp));
    console.log("pageParams", this.data.pageParams);
    this.setData({
      pageParams: this.data.pageParams,
    });
  },

  onShow: function() {

    console.log("pageParams", this.data.pageParams);
    this.setData({
      pageParams: this.data.pageParams,
      title: this.data.pageParams.title,
    });
  },

  onShow: function() {
    this.loadData();
  },

  loadData: function(){
    let updateData = {};
    let _this = this;
    wx.showLoading({
      mask: true
    });
    wx.cloud.callFunction({
      name: "ct",
      data: {
        "action": "getCTOfPersonalComment",
        "ctId": this.data.pageParams.ctId,
      },
      success: res => {
        wx.hideLoading();
        console.log("getCTOfPersonalComment", res);
        updateData['lms'] = res.result.data.comments;
        updateData['title'] = res.result.data.ct.title;
        wx.setNavigationBarTitle({
          title: res.result.data.ct.wxPublicName
        })
        _this.setData(updateData);
      },
      fail: err => {
        wx.hideLoading();
        console.error('getCTOfPersonalComment', err)

      }
    })
  },


  bindConentInput: function (e) {
    this.setData({
      "content": e.detail.value
    })
  },
  

  formSubmit: function formSubmit(e) {
    let _this = this;
    let tip = "";
    if (this.data.content == "") {
      tip = "内容不能为空";
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
    let userInfo = getApp().getMiniAppCacheInfo().wxUserInfo;
    wx.cloud.callFunction({
      name: "ct",
      data: {
        "action": "addComment",
        "formId": e.detail.formId,
        "comment":{
          "ctId": this.data.pageParams.ctId,
          "content": this.data.content,
          "name": userInfo.nickName,
          "headimg": userInfo.avatarUrl,
        }
      },
      success: res => {
        console.log("addComment", res);
        wx.hideLoading();
        if(res.result.code==1){
          _this.setData({
            "content":"",
          });
          _this.loadData();
        }
      
      },
      fail: err => {
        console.error('addComment', err)
        wx.hideLoading();
      }
    })
  },  

  onClickMoreListItem: function (e) {
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
        console.log("onClickMoreListItem", "delete");
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

}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)