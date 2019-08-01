// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init(
  {
    env: 'lmb-6ea1i'
  }
)

const db = cloud.database()

/**
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  switch (event.action) {
    case 'login': {
      return login(event, context)
    }
    default: {
      return
    }
  }
}

async function login(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  console.log("event", event);

  const userInfos = await db.collection('userInfo').where({
    _openid: wxContext.OPENID
  }).get()
  console.log("userInfos", userInfos);
  if (userInfos.errMsg != "collection.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1001，请稍候重试"
    }
  }

  if (userInfos.data.length == 0) {
    const insertData = {
      _openid: wxContext.OPENID,
      wxUserInfo: event.wxUserInfo,
      userType: 1,//1普通用户，2vip用户，3超级vip用户
    }
    const userInfo = await db.collection('userInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: insertData
    })
    console.log("userInfo", userInfo);
    if (userInfo.errMsg != "collection.add:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1002，请稍候重试"
      }
    } else {
      return {
        code: 1,
        description: "成功",
        data: insertData
      }
    }

  } else {
    return {
      code: 1,
      description: "成功",
      data: userInfos.data[0]
    }
  }
}