//封装的HTTPS的请求类
const app = getApp()

var API_URL = 'https://api.cmdd.tech/';
// var API_URL = 'https://chanmao.oicp.vip/';
var defaulContentType = 'application/x-www-form-urlencoded; charset=UTF-8';

function POST(url, params, method, contenTTypeCust) {
  // console.log('dev - url',url) ;
  // console.log('dev - param',params) ; 
  // console.log('dev - method',method) ; 
  // console.log('dev - contenTTypeCust',contenTTypeCust) ;

  var contentType = defaulContentType;
  if (typeof contenTTypeCust != 'undefined') {
    contentType == contenTTypeCust;
  }
  let promise = new Promise(function(resolve, reject) {

    wx.request({
      url: API_URL+url,
      data: params,
      method: method,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log('返回结果：' + res)
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject('获取信息错误');
        }
      },
      fail: function(e) {
        reject('网络出错');
      }
    })
  });
  return promise
}
module.exports = {
  POST: POST
}