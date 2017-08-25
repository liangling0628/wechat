/**
 * Created by lingliang on 2016/7/21.
 */
'use strict'
var path =require('path')
var util=require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var config ={
    wechat:{
        appID:'wxc6211dec08cd2d6b',
        appSecret:'f245090444d429c12dd6600476058f5d',
        token:'chendongmi',
        getAccessToken:function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

module.exports=config