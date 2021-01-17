import request from '@/utils/request'

export const saveTort = (data) => {
  return request({
    url: `/tort/saveTort`,
    method: 'post',
    data
  })
}

export const getTort = () => {
  return request({
    url: '/tort/getTort',
    method: 'post'
  })
}
