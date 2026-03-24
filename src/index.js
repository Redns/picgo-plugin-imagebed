const config = (ctx) => {
    const userConfig = ctx.getConfig('picBed.imagebed') || {}

    return [
        {
            name: 'url',
            type: 'input',
            alias: '服务器url',
            default: userConfig.url || '',
            message: '服务器url不能为空',
            required: true
        }
    ]
}

const requestConstruct = (userConfig, fileName, img) => {
    return {
        method: 'POST',
        url: `${userConfig.url}/api/image`,
        headers: {},
        formData: {
            file: {
                value: img,
                options: {
                    filename: fileName,
                    contentType: 'image'
                }
            }
        }
    }
}

const handle = async (ctx) => {
    const userConfig = ctx.getConfig('picBed.imagebed')

    if (!userConfig || !userConfig.url) {
        throw new Error('请配置服务器url')
    }

    const imgList = ctx.output

    for (let i in imgList) {
        try {
            let img = imgList[i].buffer

            if (!img && imgList[i].base64Image) {
                img = Buffer.from(imgList[i].base64Image, 'base64')
            }

            const request = requestConstruct(userConfig, imgList[i].fileName, img)

            const res = await ctx.Request.request(request)

            // ⭐ 统一解析返回（终极稳定写法）
            const raw = res?.data ?? res?.body ?? res

            if (!raw) {
                throw new Error(`接口无返回数据: ${JSON.stringify(res)}`)
            }

            let responseObject

            if (typeof raw === 'string') {
                try {
                    responseObject = JSON.parse(raw)
                } catch {
                    throw new Error(`返回不是合法JSON: ${raw}`)
                }
            } else if (typeof raw === 'object') {
                responseObject = raw
            } else {
                throw new Error(`未知返回类型: ${typeof raw}`)
            }

            // ❌ 接口失败
            if (responseObject.statusCode !== 200) {
                throw new Error(responseObject.message || '上传失败')
            }

            // ❌ 没拿到URL
            if (!responseObject.res || !responseObject.res[0]) {
                throw new Error('未获取到图片URL')
            }

            // ✅ 自动补全URL（关键）
            let url = responseObject.res[0]

            if (!/^https?:\/\//i.test(url)) {
                url = `${userConfig.url}/${url.replace(/^\/+/, '')}`
            }

            imgList[i].imgUrl = url

        } catch (err) {
            ctx.log.error('上传失败:', err.message || err)
            throw err
        }

        delete imgList[i].base64Image
        delete imgList[i].buffer
    }

    return ctx
}

module.exports = (ctx) => {
    const register = () => {
        ctx.log.success('imagebed加载成功！')

        ctx.helper.uploader.register('imagebed', {
            handle,
            config,
            name: 'imagebed'
        })
    }

    return {
        register,
        uploader: 'imagebed'
    }
}