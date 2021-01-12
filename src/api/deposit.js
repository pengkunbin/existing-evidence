import request from '@/utils/request'

export const createDepositItem = (data) => {
  return request({
    url: '/evidence/saveEvidence',
    method: 'post',
    transformRequest: (data) => (data), // DO NOT stringify
    data
  })
}

export const getDepositList = () =>
  request({
    url: '/evidence/getEvidence',
    method: 'post'
  })

export const getNotarizationList = () =>
  request({
    url: '/authority/getAuthority',
    method: 'post'
  })
