# 摆渡留言小程序
该项是主要为新开公众号提供留言功能，采用的后台是小程序云开发后台。个人如果想移植该项目的话也相当方便，只需要克隆该项目，然后替换小程序APPID，然后为自己的小程序开通云开发功能并替换项目的云开发环境为自己新开通的云开发环境就可以。

# 分支管理
##### master 主分支
##### develop http持续开发分支
##### wx_cloud 云开发分支
##### wx_cloud_develop 云开发持续开发分支

# 功能介绍
##### 留言区创建者：
1. 创建文章留言区，查看留言区，编辑；
2. 管理留言区，分享留言区,生成留言区小程序二维码；
3. 管理留言，回复，精选，点赞；
4. 查看自己留言；
5. 接收评论服务通知；

##### 普通用户
1. 查看留言区；
2. 评论留言区，点赞某条留言；
3. 查看自己留言；

详细介绍可以查看以下链接：

https://mp.weixin.qq.com/s/wogwZdQnpnT-_kmtEk2Jtw

# 云开发
## 移植小程序，基于wx_cloud云开发分支
1. 替换小程序APPID，打开项目找到project.config.json文件，替换掉appid为自己小程序id；
2. 为自己的小程序开通云开发功能；
3. 替换云开发环境，分别打开cloudfunctions目录下面的ct，templateMessage，user三个目录下面的index.js文件，替换里面的
```
// 初始化 cloud
cloud.init({
  env: 'lmb-6ea1i'//把lmb-6ea1i改为自己小程序云开发环境
})
```


# 微信扫码体验
![image](https://note.youdao.com/yws/api/personal/file/0C8769BF1F154C44B870D74EB48CBCC2?method=download&shareKey=eff2f2cbdd2d79b28b5af7c7e1c9241a)

# License

Copyright 2019 Frank

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
