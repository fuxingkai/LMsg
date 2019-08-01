import {
  connect
} from '../../redux/index.js'
let app = getApp();
let store = app.store;


let pageConfig = {
  data: {
    userInfo: {
      avatarUrl: '/images/default-icon.png',
      nickName: '',
    },
    userType:"普通用户"
  },

  onLoad: function() {
    let miniAppCacheInfo = app.getMiniAppCacheInfo();
    if (miniAppCacheInfo.wxUserInfo) {
      if (!miniAppCacheInfo.wxUserInfo.avatarUrl) {
        miniAppCacheInfo.wxUserInfo.avatarUrl = '/images/default-icon.png';
      }
      this.setData({
        wxUserInfo: miniAppCacheInfo.wxUserInfo,
      });
    }
  },
  onShow: function() {

  },


  /**
   * 跳转关联小程序
   * @param {*} e 
   */
  onClickToAsMiniApp: function onClickToAsMiniApp(e) {
    wx.navigateTo({
      url: '/pages/as-miniapp/as-miniapp'
    })
  },
  
  /**
   * 跳转讨论区
   * @param {*} e 
   */
  onClickToDiscussion: function onClickToDiscussion(e) {
    let jp = {
      ctId: "9afd9b6a5d3037530a224f414cc37ff8",
    }
    wx.navigateTo({
      url: '/pages/ct/ct?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },

  /**
    * 跳转查看使用
    * @param {*} e 
    */
  onClickLookUser: function onClickLookUser(e) {
    let jp = {
      url: "https://mp.weixin.qq.com/s/wogwZdQnpnT-_kmtEk2Jtw",
    }
    wx.navigateTo({
      url: '/pages/web/web?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },
  
  /**
      * 跳转我的留言
      * @param {*} e 
      */
  onClickMyCm: function onClickMyCm(e) {
    let jp = {
     
    }
    wx.navigateTo({
      url: '/pages/my-cm/my-cm?jp=' + encodeURIComponent(JSON.stringify(jp)),
    })
  },
  

  
}

const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(undefined, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)