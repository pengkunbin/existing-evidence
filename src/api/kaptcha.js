import request from '@/utils/request'

export function defaultKaptcha() {
  return request({
    url:'/kaptcha/defaultKaptcha',
    method:'post',
    responseType:'blob'
  })
}

export function checkVerifyCode(code,sessionId) {
  return request({
    url:'/kaptcha/checkVerifyCode',
    method:'post',
    // headers:{
    //     Cookies:'JSESSIONID='+sessionId
    // },
    params:{
      verificationCode:code,
    }
  })
}