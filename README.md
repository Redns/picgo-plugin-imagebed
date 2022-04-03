# picgo-plugin-imagebed

## 简介

[ImageBed](https://github.com/Redns/ImageBed) 为笔者开发的一款图床服务，用于帮助用户搭建属于自己的图床服务器。

<br>

## 图床特点

- 安全可靠，图片完全存储在主机
- 无图片尺寸、带宽限制（取决于您的环境）
- 图片上传成功后自动将链接复制到剪贴板
- 跨平台，可在 `windows`、`Linux`、`MacOS`部署

<br>

## 环境搭建

1. 前往 [ImageBed](https://github.com/Redns/ImageBed) 根据 `Usage` 搭建 `ImageBed` 环境

   ![image-20220327222331165](http://jing-image.test.upcdn.net/image-20220327222331165.png)

<br>

2. `GUI` 用户直接搜索 `imagebed` 下载安装

   ![image-20220327222339489](http://jing-image.test.upcdn.net/image-20220327222339489.png)

   <br>

3. 根据实际情况修改设置

   ![image-20220327222344902](http://jing-image.test.upcdn.net/image-20220327222344902.png)

   `服务器url` 格式为 `http://{ip}:12121`

   - `局域网使用`： `{ip}` 为服务器的 `局域网IP`，本机使用则 `{ip}` 为 `127.0.0.1` 或 `localhost`
   - `公网使用`：`{ip}` 为服务器的 `公网IP`，若您的图床服务器包含域名解析，则此处直接填写域名

   <br>

4. 大功告成！

<br>


[![Star History Chart](https://api.star-history.com/svg?repos=Redns/picgo-plugin-imagebed&type=Date)](https://star-history.com/#Redns/picgo-plugin-imagebed&Date)
