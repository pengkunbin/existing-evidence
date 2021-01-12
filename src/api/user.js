import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/loginUser',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUsers',
    method: 'post'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }

//注册
export function register(data) {
    return request ({
        url:'user/registerUser',
        method: 'post',
        data,
    })
}
