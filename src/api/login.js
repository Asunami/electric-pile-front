import request from '../utils/request.js'

//登录接口
export function userLogin(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}
//登出接口
export function userLogout(id) {
    return request({
        url: '/user/logout/'+id,
        method: 'post',
    })
}

//注册接口
export function userRegister(data) {
    return request({
        url:'/user/register',
        method:'post',
        data:data
    })
}

//得到用户信息
export function getUserById(id) {
    return request({
        url: '/user/information/'+id,
        method: 'get',
    })
}
//编辑个人信息 
export function addUser(data) {
    return request({
        url:'/user/add',
        method:'post',
        data:data
    })
}
//新增充值记录
export function addRecharge(data) {
    return request({
        url:'/recharge/add',
        method:'post',
        data:data
    })
}