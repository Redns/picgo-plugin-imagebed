const config = (ctx) => {
    let userConfig = ctx.getConfig('picBed.imagebed')
    if (!userConfig) {
        userConfig = {}
    }
    const config = [
        {
            name: 'url',
            type: 'input',
            alias: '服务器url',
            default: userConfig.url || '',
            message: '服务器url不能为空',
            required: true
        }
    ]
    return config
}


const requestConstruct = (userConfig, fileName, img) => {
    const url = userConfig.url

    return {
        'method': 'POST',
        'url': `${url}/api/image`,
        'headers': {
        },
        formData: {
            '': {
                'value': img,
                'options': {
                'filename': fileName,
                'contentType': 'image'
                }
            }
        }
    }
}


const handle = async (ctx) => {
    // 获取用户配置信息
    const userConfig = ctx.getConfig('picBed.imagebed')
    if(!userConfig){
        throw new Error('请配置服务器url')
    }       

    const imgList = ctx.output
    for(var i in imgList) {
        try{
            let img = imgList[i].buffer
            if(!img && imgList[i].base64Image){
                img = Buffer.from(imgList[i].base64Image, 'base64')
            }

            const request = requestConstruct(userConfig, imgList[i].fileName, img)
            await ctx.Request.request(request, function(err, response){
                var responseObject = JSON.parse(response.body)
                if(err){
                    throw new Error(err)
                }
                else{
                    imgList[i]['imgUrl'] = `${userConfig.url}/api/image/${responseObject.res[0].split('/').slice(-1)[0]}`
                }
            })
        }
        catch(err){
            throw new Error(err)
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
            handle: handle,
            config: config,
            name: 'imagebed'
        })
    }
    return {
        register,
        uploader: 'imagebed'
    }
}