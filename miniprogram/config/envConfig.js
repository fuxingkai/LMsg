// 配置
let envir = 'online'
let ENVIRONMENT_CONFIG = {}
let configMap = {
    test: {
      appkey: 'eacab89276984fd2b7d81c17d73f8094',
      url: 'https://apptest.netease.im'
    },

    pre: {
      appkey: 'eacab89276984fd2b7d81c17d73f8094',
      url: 'http://preapp.netease.im:8184'
    },
    online: {
      appkey: 'eacab89276984fd2b7d81c17d73f8094',
      url: 'https://app.netease.im'
    }
  };
ENVIRONMENT_CONFIG = configMap[envir];
// 是否开启订阅服务
ENVIRONMENT_CONFIG.openSubscription = true

module.exports = ENVIRONMENT_CONFIG