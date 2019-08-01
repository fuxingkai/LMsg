// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  env: 'lmb-6ea1i'
})

const db = cloud.database()
const $ = db.command.aggregate
/**
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  switch (event.action) {
    case 'addCT':
      {
        //添加留言区
        return addCT(event, context)
      }
    case 'editCT':
      {
        //编辑留言区
        return editCT(event, context)
      }
    case 'getCTList':
      {
        //获得留言区列表
        return getCTList(event, context)
      }
    case 'removeCT':
      {
        //删除留言区
        return removeCT(event, context)
      }
    case 'getMCT':
      {
        //获得管理的某条留言区
        return getMCT(event, context)
      }
    case 'getCT':
      {
        //获得某条留言区
        return getCT(event, context)
      }
    case 'getCTIntro':
      {
        //获得某条留言区
        return getCTIntro(event, context)
      }
    case 'getSettingCT':
      {
        //获得留言区的配置
        return getSettingCT(event, context)
      }
    case 'addComment':
      {
        //给某条留言区添加评论
        return addComment(event, context)
      }
    case 'getCTOfPersonalComment':
      {
        //获得某个留言区某人的评论
        return getCTOfPersonalComment(event, context)
      }
    case 'removeComment':
      {
        //删除评论
        return removeComment(event, context)
      }
    case 'likeComment':
      {
        //点赞或者取消点赞某条评论
        return likeComment(event, context)
      }
    case 'chooseComment':
      {
        //留言区允许展示某条评论
        return chooseComment(event, context)
      }
    case 'topComment':
      {
        //留言区置顶某条评论
        return topComment(event, context)
      }
    case 'replyComment':
      {
        //留言区置顶某条评论
        return replyComment(event, context)
      }
    case 'getMyCMList':
      {
        //获得我的留言列表
        return getMyCMList(event, context)
      }

    default:
      {
        return
      }
  }
}

/**
 * 添加留言区
 */
async function addCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  const addFormIdResp = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'templateMessage',
    // 传递给云函数的参数
    data: {
      "action": "addFormId",
      "formId": event.formId,
      "openid": wxContext.OPENID,
    },
  })

  const insertData = {
    _openid: wxContext.OPENID,
    title: event.ct.title,
    acticleLink: event.ct.acticleLink,
    wxPublicName: event.ct.wxPublicName,
    des: event.ct.des,
    count: 0,
    look: 0,
    noReadCount: 0,
    createTime: db.serverDate(),
    codePath: "",
  }

  const ct = await db.collection('ct').add({
    // data 字段表示需新增的 JSON 数据
    data: insertData
  })

  console.log("ct", ct);
  if (ct.errMsg != "collection.add:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1004，请稍候重试"
    }
  } else {
    try {
      let jp = {
        ctId: ct._id,
      }
      let path = "pages/ct/ct?jp=" + encodeURIComponent(JSON.stringify(jp));
      const code = await cloud.openapi.wxacode.get({
        path: path,
        width: 400,
        isHyaline: true,
        autoColor: false,
        lineColor: {
          "r": 9,
          "g": 187,
          "b": 7
        }
      })
      console.log("wxacode.get", code)
      const codeName = ct._id + ".jpg";
      try {
        const uploadFile = await cloud.uploadFile({
          cloudPath: codeName,
          fileContent: code.buffer,
        })
        console.log("uploadFile", uploadFile)
        const updateComment = await db.collection('ct').doc(ct._id).update({
          data: {
            codePath: uploadFile.fileID,
          }
        })
      } catch (e) {
        console.log("uploadFile", e)
      }

      return {
        code: 1,
        description: "成功",
        data: {
          id: ct._id
        }
      }
    } catch (err) {
      console.log("wxacode.get", err)
      return {
        code: 0,
        description: "系统出现异常，异常码1015，请稍候重试"
      }

    }
  }
}


/**
 * 编辑留言区
 */
async function editCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  const addFormIdResp = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'templateMessage',
    // 传递给云函数的参数
    data: {
      "action": "addFormId",
      "formId": event.formId,
      "openid": wxContext.OPENID,
    },
  })

  const updateCT = await db.collection('ct').doc(event.ct.ctId).update({
    data: {
      title: event.ct.title,
      acticleLink: event.ct.acticleLink,
      wxPublicName: event.ct.wxPublicName,
      des: event.ct.des,
    }
  })

  console.log("updateCT", updateCT);
  if (updateCT.errMsg != "document.update:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1015，请稍候重试"
    }
  } else {
    return {
      code: 1,
      description: "成功",
      data: {
        id: updateCT.stats.updated
      }
    }
  }
}


/**
 * 获取留言区列表
 */
async function getCTList(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const cts = await db.collection('ct').where({
    _openid: wxContext.OPENID
  }).get()
  console.log("cts", cts);
  if (cts.errMsg != "collection.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1005，请稍候重试"
    }
  } else {
    return {
      code: 1,
      description: "成功",
      data: {
        list: cts.data
      }
    }
  }

}


/**
 * 删除留言区
 */
async function removeCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  const remove = await db.collection('ct').where({
    _id: event.ctId,
    _openid: wxContext.OPENID
  }).remove();
  console.log("remove", remove);
  if (remove.errMsg != "collection.remove:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1005，请稍候重试"
    }
  } else {
    if (ct.errMsg == "document.get:ok") {
      try {
        const fileIDs = [ct.data.codePath]
        const deleteFile = await cloud.deleteFile({
          fileList: fileIDs,
        })
      } catch (e) {
        console.log("deleteFile", e)
      }
    }

    const removeComment = await db.collection('ctComment').where({
      ctId: event.ctId,
    }).remove();

    const removeLike = await db.collection('commentLike').where({
      ctId: event.ctId,
    }).remove();

    return {
      code: 1,
      description: "成功",
      data: {}
    }
  }

}

/**
 * 获取个人管理某条留言区
 */
async function getMCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  console.log("getCT", ct);
  if (ct.errMsg != "document.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1008，请稍候重试"
    }
  } else {
    const updateCT = await db.collection('ct').doc(event.ctId).update({
      data: {
        noReadCount: 0
      }
    })

    const noDealcomments = await db.collection('ctComment').where({
      ctId: event.ctId,
      isNew: true,
    }).get()

    const comments = await db.collection('ctComment').where({
      ctId: event.ctId,
      isNew: false,
    }).get()

    const updateComments = await db.collection('ctComment').where({
      ctId: event.ctId,
      isNew: true,
    }).update({
      data: {
        isNew: false
      }
    })

    if (comments.errMsg != "collection.get:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1009，请稍候重试"
      }
    } else {

      if (comments.data.length > 0) {
        const nComments = [];
        const tasks = []
        for (let i = 0; i < comments.data.length; i++) {
          const comment = comments.data[i];
          console.log("comment—11", comment);
          const promise = new Promise(function(resolve, reject) {
            Promise.all([db.collection('commentLike').where({
              _openid: wxContext.OPENID,
              commentId: comment._id,
              commentType: "comment"
            }).get(), db.collection('commentLike').where({
              commentId: comment._id,
              commentType: "comment"
            }).count(), db.collection('commentLike').where({
              _openid: wxContext.OPENID,
              commentId: comment._id,
              commentType: "reply"
            }).get(), db.collection('commentLike').where({
              commentId: comment._id,
              commentType: "reply"
            }).count()]).then(function(value) {

              console.log("comment", value);
              comment.like = value[1].total;
              comment.isLike = value[0].data.length > 0 ? true : false;
              comment.reply.like = value[3].total;
              comment.reply.isLike = value[2].data.length > 0 ? true : false;
              const commentData = {};
              const commentList = [];
              commentList.push(comment);
              commentData.comments = commentList;
              console.log("comment1", commentData);
              resolve(commentData)
            }).catch(function(e) {
              console.log("comment_e", e);
            });
          })
          tasks.push(promise)
        }

        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            noDealcomments: noDealcomments.data,
            comments: (await Promise.all(tasks)).reduce((acc, cur) => {
              return {
                comments: acc.comments.concat(cur.comments)
              }
            }).comments
          }
        }
      } else {
        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            noDealcomments: noDealcomments.data,
            comments: comments.data
          }
        }
      }
    }

  }

}

/**
 * 获取某条留言区
 */
async function getCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  console.log("getCT", ct);
  if (ct.errMsg != "document.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1008，请稍候重试"
    }
  } else {
    const _ = db.command
    const updateComment = await db.collection('ct').doc(ct.data._id).update({
      data: {
        look: _.inc(1)
      }
    })
    const comments = await db.collection('ctComment').where({
      ctId: event.ctId,
      isChoose: true,
    }).get()

    if (comments.errMsg != "collection.get:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1009，请稍候重试"
      }
    } else {

      if (comments.data.length > 0) {
        const nComments = [];
        const tasks = []
        for (let i = 0; i < comments.data.length; i++) {
          const comment = comments.data[i];
          const promise = new Promise(function(resolve, reject) {
            Promise.all([db.collection('commentLike').where({
              _openid: wxContext.OPENID,
              commentId: comment._id,
              commentType: "comment"
            }).get(), db.collection('commentLike').where({
              commentId: comment._id,
              commentType: "comment"
            }).count(), db.collection('commentLike').where({
              _openid: wxContext.OPENID,
              commentId: comment._id,
              commentType: "reply"
            }).get(), db.collection('commentLike').where({
              commentId: comment._id,
              commentType: "reply"
            }).count()]).then(function(value) {

              console.log("comment", value);
              comment.like = value[1].total;
              comment.isLike = value[0].data.length > 0 ? true : false;
              comment.reply.like = value[3].total;
              comment.reply.isLike = value[2].data.length > 0 ? true : false;
              const commentData = {};
              const commentList = [];
              commentList.push(comment);
              commentData.comments = commentList;
              console.log("comment1", commentData);
              resolve(commentData)
            }).catch(function(e) {
              console.log("comment_e", e);
            });
          })
          tasks.push(promise)
        }

        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            comments: (await Promise.all(tasks)).reduce((acc, cur) => {
              return {
                comments: acc.comments.concat(cur.comments)
              }
            }).comments
          }
        }
      } else {
        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            comments: comments.data
          }
        }
      }
    }

  }

}


/**
 * 获取某条留言区
 */
async function getCTIntro(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  console.log("getCTIntro", ct);
  if (ct.errMsg != "document.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1008，请稍候重试"
    }
  } else {
    return {
      code: 1,
      description: "成功",
      data: {
        ct: ct.data,
      }
    }
  }
}

/**
 * 获取个人管理某条留言区
 */
async function getSettingCT(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  console.log("getSettingCT", ct);
  if (ct.errMsg != "document.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1008，请稍候重试"
    }
  } else {
    try {
      const fileList = [ct.data.codePath]
      const codePath = await cloud.getTempFileURL({
        fileList: fileList,
      })
      console.log("codePath.fileList", codePath.fileList)
      return {
        code: 1,
        description: "成功",
        data: {
          ct: ct.data,
          codePath: codePath.fileList[0].tempFileURL
        }
      }
    } catch (err) {
      console.log("codePath.fileList", err)
      return {
        code: 0,
        description: "系统出现异常，异常码1015，请稍候重试"
      }

    }

  }

}


/**
 * 给某天留言区添加评论
 */
async function addComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.comment.ctId).get()
  console.log("getCTIntro", ct);
  if (ct.errMsg == "document.get:ok") {
    const sendData = {
      ctId: ct.data._id,
      touser: ct.data._openid,
      title: ct.data.title,
      fromName: event.comment.name,
      createTime: db.serverDate(),
      content: event.comment.content
    }
    const sendCommentTemplateMessage = await cloud.callFunction({
      // 要调用的云函数名称
      name: 'templateMessage',
      // 传递给云函数的参数
      data: {
        "action": "sendCommentTemplateMessage",
        "sendData": sendData,
      },
    })

  }

  const addFormIdResp = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'templateMessage',
    // 传递给云函数的参数
    data: {
      "action": "addFormId",
      "formId": event.formId,
      "openid": wxContext.OPENID,
    },
  })

  const insertData = {
    _openid: wxContext.OPENID,
    ctId: event.comment.ctId,
    content: event.comment.content,
    name: event.comment.name,
    headimg: event.comment.headimg,
    like: 0,
    isLike: false,
    isChoose: false,
    isTop: false,
    isNew: true,
    createTime: db.serverDate(),
    reply: {
      content: "",
      createTime: db.serverDate(),
      name: "",
      headimg: "",
      like: 0,
      isLike: false,
    }
  }

  const ctComment = await db.collection('ctComment').add({
    data: insertData
  })

  const _ = db.command
  const updateComment = await db.collection('ct').doc(event.comment.ctId).update({
    data: {
      count: _.inc(1),
      noReadCount: _.inc(1)
    }
  })
  console.log("ctComment", ctComment);
  if (ctComment.errMsg != "collection.add:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1007，请稍候重试"
    }
  } else {
    return {
      code: 1,
      description: "成功",
      data: {
        id: ctComment._id
      }
    }
  }

}


/**
 * 获取某条留言区和某个人在该留言区的评论
 */
async function getCTOfPersonalComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const ct = await db.collection('ct').doc(event.ctId).get()
  console.log("getCT", ct);
  if (ct.errMsg != "document.get:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1008，请稍候重试"
    }
  } else {

    const comments = await db.collection('ctComment').where({
      _openid: wxContext.OPENID,
      ctId: event.ctId,
    }).get()

    if (comments.errMsg != "collection.get:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1009，请稍候重试"
      }
    } else {

      if (comments.data.length > 0) {
        const nComments = [];
        const tasks = []
        for (let i = 0; i < comments.data.length; i++) {
          const comment = comments.data[i];
          const promise = new Promise(function(resolve, reject) {
            Promise.all([db.collection('commentLike').where({
              _openid: comment._openid,
              commentId: comment._id,
              commentType: "comment"
            }).get(), db.collection('commentLike').where({
              _openid: comment._openid,
              commentId: comment._id,
              commentType: "comment"
            }).count(), db.collection('commentLike').where({
              _openid: comment._openid,
              commentId: comment._id,
              commentType: "reply"
            }).get(), db.collection('commentLike').where({
              _openid: comment._openid,
              commentId: comment._id,
              commentType: "reply"
            }).count()]).then(function(value) {

              console.log("comment", value);
              comment.like = value[1].total;
              comment.isLike = value[0].data.length > 0 ? true : false;
              comment.reply.like = value[3].total;
              comment.reply.isLike = value[2].data.length > 0 ? true : false;
              const commentData = {};
              const commentList = [];
              commentList.push(comment);
              commentData.comments = commentList;
              console.log("comment1", commentData);
              resolve(commentData)
            }).catch(function(e) {
              console.log("comment_e", e);
            });
          })
          tasks.push(promise)
        }

        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            comments: (await Promise.all(tasks)).reduce((acc, cur) => {
              return {
                comments: acc.comments.concat(cur.comments)
              }
            }).comments
          }
        }
      } else {
        return {
          code: 1,
          description: "成功",
          data: {
            ct: ct.data,
            comments: comments.data
          }
        }
      }
    }
  }

}


/**
 * 删除某条评论
 */
async function removeComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  await Promise.all([db.collection('ctComment').where({
    _openid: wxContext.OPENID,
    _id: event.commentId,
    ctId: event.ctId,
  }).remove(), db.collection('commentLike').where({
    _openid: wxContext.OPENID,
    commentId: event.commentId,
  }).remove()]).then(function(value) {
    console.log("removeComment", value);
    return {
      code: 1,
      description: "成功",
      data: {}
    }
  }).catch(function(e) {
    console.log("removeComment", e);
    return {
      code: 0,
      description: "系统出现异常，异常码1012，请稍候重试"
    }
  });
}


/**
 * 点赞或者取消点赞某条评论
 */
async function likeComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  if (event.operate == 1) {
    //点赞
    const insertData = {
      _openid: wxContext.OPENID,
      commentId: event.commentId,
      ctId: event.ctId,
      commentType: event.commentType,
    }
    //commentType点赞类型，comment，reply
    const like = await db.collection('commentLike').add({
      data: insertData
    })

    if (like.errMsg != "collection.add:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1010，请稍候重试"
      }
    } else {
      return {
        code: 1,
        description: "成功",
        data: {
          id: like._id
        }
      }
    }
  } else {
    //取消点赞
    const cancelLike = await db.collection('commentLike').where({
      _openid: wxContext.OPENID,
      commentId: event.commentId,
      commentType: event.commentType,
    }).remove();
    console.log("remove", cancelLike);
    if (cancelLike.errMsg != "collection.remove:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1011，请稍候重试"
      }
    } else {
      return {
        code: 1,
        description: "成功",
        data: {}
      }
    }
  }

}

/**
 * 展示或者取消展示某条评论
 */
async function chooseComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const updateComment = await db.collection('ctComment').doc(event.commentId).update({
    data: {
      // 是否允许该评论展示，1运行，2不允许
      isChoose: event.operate == 1 ? true : false
    }
  })
  console.log("updateComment", updateComment);
  if (updateComment.errMsg != "document.update:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1012，请稍候重试"
    }
  } else {
    const comment = await db.collection('ctComment').doc(event.commentId).get();
    console.log("comment", comment);
    if (comment.errMsg == "document.get:ok") {
      const ct = await db.collection('ct').doc(comment.data.ctId).get()
      console.log("ct", ct);
      if (ct.errMsg == "document.get:ok") {
        const sendData = {
          ctId: ct.data._id,
          touser: comment.data._openid,
          title: ct.data.title,
          createTime: db.serverDate(),
          content: comment.data.content
        }
        const sendChooseTemplateMessage = await cloud.callFunction({
          // 要调用的云函数名称
          name: 'templateMessage',
          // 传递给云函数的参数
          data: {
            "action": "sendChooseTemplateMessage",
            "sendData": sendData,
          },
        })

      }

    }

    return {
      code: 1,
      description: "成功",
      data: {}
    }
  }

}



/**
 * 置顶或者取消置顶某条评论
 */
async function topComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const updateComment = await db.collection('ctComment').doc(event.commentId).update({
    data: {
      // 是否允许该评论展示，1运行，2不允许
      isTop: event.operate == 1 ? true : false
    }
  })
  console.log("updateComment", updateComment);
  if (updateComment.errMsg != "document.update:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1013，请稍候重试"
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
 * 回复某条评论
 */
async function replyComment(event, context) {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext();
  const updateData = event.reply;
  updateData.createTime = db.serverDate();
  const updateComment = await db.collection('ctComment').doc(event.commentId).update({
    data: {
      reply: updateData
    }
  })
  console.log("updateComment", updateComment);
  if (updateComment.errMsg != "document.update:ok") {
    return {
      code: 0,
      description: "系统出现异常，异常码1014，请稍候重试"
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
   * 获取我的留言列表
   */
  async function getMyCMList(event, context) {
    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext()
    const comments = await db.collection('ctComment').where({
      _openid: wxContext.OPENID,
    }).get()
    console.log("getCM", comments);
    if (comments.errMsg != "collection.get:ok") {
      return {
        code: 0,
        description: "系统出现异常，异常码1016，请稍候重试"
      }
    } else {
      return {
        description: "成功",
        data: {
          cms: comments.data
        }
      }
    }
}
