import request from '@/utils/request'

export function defaultKaptcha() {
  return request({
    url: '/kaptcha/defaultKaptcha',
    method: 'post',
    responseType: 'blob'
  })
}

export function checkVerifyCode(code, verify_token) {
  return request({
    url: '/kaptcha/checkVerifyCode',
    method: 'post',
    data: {
      verifyCode: code,
      verifyToken: verify_token
    }
  })
}
