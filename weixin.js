/**
 * Created by lingliang on 2016/7/21.
 */
'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')
var path = require('path')
var wechatApi = new Wechat(config.wechat)

exports.reply = function*(next) {
	var message = this.weixin

	if(message.MsgType === 'event') {
		if(message.Event === 'subscribe') {
			if(message.EventKey) {
				console.log('扫码进来' + message.EventKey + ' ' + message.ticket)
			}

			this.body = '欢迎订阅这个号'
		} else if(message.Event === 'unsubscribe') {
			console.log('取消关注')
			this.body = ''
		} else if(message.Event === 'LOCATION') {
			this.body = '您上报的地理位置是： ' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
		} else if(message.Event === 'CLICK') {
			this.body = '您点击了菜单： ' + message.EventKey
		} else if(message.Event === 'SCAN') {
			console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket)

			this.body = '看到你扫了一下哦'
		} else if(message.Event === 'VIEW') {
			this.body = '您点击了菜单中的链接： ' + message.EventKey
		}
	} else if(message.MsgType === 'text') {
		var content = message.Content
		var reply = '牙合' + message.Content + '真不容易'

		if(content === '1') {
			reply = '第一'
		} else if(content === '2') {
			reply = '第儿'
		} else if(content === '3') {
			reply = '第三'
		} else if(content === '4') {

			reply = [{
				title: '小米子',
				description: '米米子',
				picUrl: __dirname + '\\img\\1.jpg',
				url: 'https://github.com/'
			}, {
				title: '猪迷子',
				description: '米米子',
				picUrl: __dirname + '\\img\\2.jpg',
				url: 'https://github.com/'
			}]
		} else if(content === '5') {
			var data = yield(wechatApi.uploadMaterial('image', __dirname + '\\img\\1.jpg'))
		yield reply = {
				type: 'image',
				mediaId: data.media_id
			}
		} else if(content === '6') {
			var data = yield(wechatApi.uploadMaterial('image', __dirname + '\\img\\2.jpg'));
			var data2 = yield(wechatApi.uploadMaterial('video', __dirname + '\\6.mp4'));
			yield reply = {
				type: 'video',
				title: '深圳湾公园',
				description: '我的猪迷子',
				mediaId: data2.media_id,
				thumbMediaId: data.media_id
			}
		} else if(content === '7') {
			var data = yield(wechatApi.uploadMaterial('image', __dirname + '\\img\\2.jpg'))
			yield reply = {
				type: 'music',
				title: '致橡树',
				description: '春风十里不如你',
				musicUrl: __dirname + '\\7.mp3',
				thumbMediaId: data.media_id
			}
		}
		this.body = reply;
		console.log(reply);

	}
	yield(next)
}