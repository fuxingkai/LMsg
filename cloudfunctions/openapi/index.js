// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'lmb-6ea1i'
  }
)
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'addFormId':
      {
        console.log("addFormId", "addFormId");
        return addFormId(event, context)
      }
    case 'sendCommentTemplateMessage':
      {
        console.log("sendCommentTemplateMessage", "sendCommentTemplateMessage");
        return sendCommentTemplateMessage(event, context)
      }
    case 'sendReplyTemplateMessage':
      {
        return sendReplyTemplateMessage(event, context)
      }
    default:
      {
        return
      }
  }
}

async function addFormId(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const openid = event.openid != "" ? event.openid : wxContext.OPENID;
  const insertData = {
    _openid: openid,
    formId: event.formId,
    createTime: db.serverDate()
  }
  if (event.formId == 'the formId is a mock one') {
    return {
      code: 0,
      description: "系统出现异常，异常码1030，请稍候重试"
    }
  }
  return await db.collection('formId').add({
    // data 字段表示需新增的 JSON 数据
    data: insertData
  })
    .then(res => {
      return {
        code: 1,
        description: "成功",
        data: {}
      }
    }).catch(e => {
      return {
        code: 0,
        description: "系统出现异常，异常码1030，请稍候重试"
      }
    });

}

/**
 * 留言区收到评论的时候发送留言通知给留言区用户
 */
async function sendCommentTemplateMessage(event, context) {
  const sendData = event.sendData;
  const formIds = await db.collection('formId').where({
    _openid: sendData.touser
  }).get()
  console.log("formIds", formIds);
  if (formIds.errMsg != "collection.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1031，请稍候重试"
    }
  }
  if (formIds.data.length < 1) {
    return {
      code: 0,
      description: "系统出现异常，异常码1032，请稍候重试"
    }
  }

  const curDate = new Date(db.serverDate());
  const formId = "";
  for (let i = 0; i < formIds.data.length; i++) {
    let ofromId = formIds.data[i];
    const fromIdDate = new Date(ofromId.createTime);
    if (curDate.getTime() - fromIdDate.getTime() > 604800000) {
      formId = ofromId.formId;
      try {
        const removeFormId = await db.collection('formId').doc(ofromId._id).remove();
        console.log("removeFormId", removeFormId)
      } catch (e) {
      }
      break;
    } else {
      try {
        const removeFormId = await db.collection('formId').doc(ofromId._id).remove();
        console.log("removeFormId", removeFormId)
      } catch (e) {
      }
    }
  }


  let jp = {
    ctId: sendData.ctId,
  }
  let path = "pages/ct/ct?jp=" + encodeURIComponent(JSON.stringify(jp));
  console.log("path", path)
  const date = new Date(sendData.createTime);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  const dateStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

  const result = await cloud.openapi.templateMessage.send({
    touser: sendData.touser,
    page: path,
    data: {
      keyword1: {
        value: '留言提醒'
      },
      keyword2: {
        value: sendData.title
      },
      keyword3: {
        value: sendData.fromName
      },
      keyword4: {
        value: dateStr
      },
      keyword5: {
        value: sendData.content
      }
    },
    templateId: sendData.templateId,
    formId: formId,
    emphasisKeyword: '留言提醒'
  })

  console.log("sendTemplateMessage", result)
  if (result.errMsg != "openapi.templateMessage.send:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1033，请稍候重试"
    }
  } else {
    return {
      code: 1,
      description: "成功",
      data: {}
    }
  }

}

/**
 * 留言区作者回复评论的时候发送留言通知给留言客户用户
 */
async function sendReplyTemplateMessage(event, context) {

}