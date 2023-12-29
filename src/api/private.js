import request from '../utils/request.js'

//获取指定用户其下预约记录
export function getReserve(id) {
    return request({
        url: '/reservation/getReserve/'+id,
        method: 'get',
    })
}

//删除指定用户其下指定预约记录
export function deleteReserve(id) {
    return request({
        url: '/reservation/deleteReserve/'+id,
        method: 'delete',
    })
}

//获取指定用户其下充值记录
export function getRecharge(id) {
    return request({
        url: '/recharge/getRecharge/'+id,
        method: 'get',
    })
}

//根据预约id改变其状态
export function changeToStart(id) {
    return request({
        url: '/reservation/changeToStart/'+id,
        method: 'get',
    })
}

//获取指定用户id下的订单列表
export function getOrderList(id) {
    return request({
        url: '/order/getById/'+id,
        method: 'get',
    })
}

//根据订单id支付后的操作
export function payOrderNow(id) {
    return request({
        url: '/order/alreadyPay/'+id,
        method: 'get',
    })
}

//获取用户消费记录
export function getConsumptionList(id) {
    return request({
        url: '/consumption/getById/'+id,
        method: 'get',
    })
}

//新增评价
export function addEvaluate(data) {
    return request({
        url: '/evaluate/addNew',
        method: 'post',
        data: data
    })
}

//伪支付
export function fakeRecharge(data) {
    return request({
        url: '/recharge/pay',
        method: 'post',
        data: data
    })
}