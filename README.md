# 不译
将电脑输出的音频或麦克风输入的音频转写为文本，并翻译至其他语言。项目链接：https://notranslate.pages.dev/

![演示](https://tva1.sinaimg.cn/large/008vxvgGly1h73sf6w2yeg30z70jte81.gif)

# 使用场景
- 远程会议
- 听播客
- 观看视频

# 工作流程
通过[BackgroundMusic](https://github.com/kyleneideck/BackgroundMusic)或同类虚拟声卡将系统音频输出模拟为麦克风音频输入，通过腾讯语音识别将音频生成文本，最后通过百度翻译将上一步所生成的文本翻译至其他语言。

# 如何使用
1.如果使用的是Mac，先安装[BackgroundMusic](https://github.com/kyleneideck/BackgroundMusic)，Windows端不太了解，可以自行搜索同类软件。

2.前往腾讯[语音识别](https://cloud.tencent.com/document/product/1093/48982)，注册为开发者后，按照[文档](https://cloud.tencent.com/document/product/1093/48982)生成生成 AppID、SecretID 和 SecretKey， 每个月有5个小时的免费时长。

3.前往百度翻译的[通用翻译](https://fanyi-api.baidu.com/doc/21)，注册为开发者后，按照[文档](https://fanyi-api.baidu.com/doc/21)，获得APPID和SECRET(密钥)，每个月有100万字符的免费调用量。当然，如果无需翻译，则可以跳过这一步。

4.在不译的设置项中填入步骤2和步骤3中所获取到的AppID等。

![](https://tva1.sinaimg.cn/large/008vxvgGly1h74l5qxsr3g30z70jtq86.gif)

5.开始使用🎉
# 其他

密钥等相关信息均存储在用户本地，不会上传至服务器，请放心使用。本项目代码已上传至GitHub：https://github.com/aqeja/noTranslate