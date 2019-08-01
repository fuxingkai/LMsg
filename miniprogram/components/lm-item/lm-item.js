'use strict';
var util = require('../../utils/util.js');
Component({
  properties: {
    item: {
      type: Object,
      value: {
        "name": "小妮",
        "headimg": "https://woniujia.oss-cn-shenzhen.aliyuncs.com/consultant_head_photo/2.png",
        "time": "2018-06-26 14:12:22",
        "content": "很不错额",
        "isChoose": true,
        "isTop": false,
        "reply": "你很牛逼",
      },
      observer: 'onDataChange'
    },
    index: {
      type: Number,
      value: "",
    },
    showLine: {
      type: Boolean,
      value: true,
    }
  },

  data: {
    isShowReplyInput: false,
    placeholder: "",
    replyContent: "",
  },

  methods: {
    onDataChange: function onDataChange() {
      this.data.item.createTime = util.formatDate(new Date(this.data.item.createTime));
      this.setData({
        placeholder: "回复：" + this.data.item.name,
        item: this.data.item,
      });

    },
    /**
     * 点击整个Item
     * @param {*} e 
     */
    onClickItem: function onClickItem(e) {
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'item';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },

    bindConentInput: function (e) {
      this.setData({
        replyContent: e.detail.value,
      });
    },


    /**
     * 点击置顶
     * @param {*} e 
     */
    onClickTop: function onClickTop(e) {
      console.log("onClickTop", e);
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'top';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },


    /**
     * 点击选择
     * @param {*} e 
     */
    onClickChoose: function onClickChoose(e) {
      console.log("onClickChoose", e);
      let data = e.currentTarget.dataset.item;
      data.index = this.data.index;
      let clickEvent = {};
      clickEvent.target = 'choose';
      data.clickEvent = clickEvent;
      this.triggerEvent('onClickItem', data);
    },

    /**
   * 点击回复
   * @param {*} e 
   */
    onClickReply: function onClickReply(e) {
      console.log("onClickReply", e);

      if (this.data.item.reply.content  == "") {
        this.setData({
          isShowReplyInput: this.data.isShowReplyInput ? false : true,
        })
      }

    },

    /**
     * 点击取消回复
     * @param {*} e 
     */
    onClickCancel: function onClickCancel(e) {
      console.log("onClickCancel", e);
      if (this.data.item.reply.content == "") {
        this.setData({
          isShowReplyInput: false,
        })
      }
    },

    /**
   * 点击发送回复
   * @param {*} e 
   */
    onClickSend: function onClickSend(e) {
      console.log("onClickSend", e);
      if (this.data.item.reply.content == "") {
        this.setData({
          isShowReplyInput: false,
        })
        let data = e.currentTarget.dataset.item;
        data.index = this.data.index;
        let clickEvent = {};
        clickEvent.target = 'reply';
        data.clickEvent = clickEvent;
        let replyData = {};
        replyData.content = this.data.replyContent;
        let userInfo = getApp().getMiniAppCacheInfo().wxUserInfo;
        replyData.headimg = userInfo.avatarUrl;
        replyData.name = userInfo.nickName;
        replyData.isLike = false;
        replyData.like = 0;
        data.replyData = replyData;
        this.triggerEvent('onClickItem', data);
      }
    },
  }
});