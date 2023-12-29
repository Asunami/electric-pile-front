import request from '../utils/request.js'

//获取指定电桩的信息
export function pileDetail(id) {
    return request({
        url: '/pile/detail/' + id,
        method: 'get',
    })
}

//获取指定电桩其下所有预约记录
export function pileResrvation(id) {
    return request({
        url: '/pile/reservation/' + id,
        method: 'get',
    })
}

//获取指定电桩其下评论
export function pileComment(id) {
    return request({
        url: '/pile/comment/' + id,
        method: 'get',
    })
}

//检查预约时间段是否可用
export function checkUsable(data) {
    return request({
        url: '/pile/checkUsable',
        method: 'post',
        data: data
    })
}

//插入预约记录addReservation 
export function addReservation(data) {
    return request({
        url: '/pile/addReservation',
        method: 'post',
        data: data
    })
}

//获取指定用户其下正在充电的预约记录
export function getStart(id) {
    return request({
        url: '/reservation/getStart/' + id,
        method: 'get',
    })
}

//更新预约记录状态，新增订单记录，新增消费记录，更新用户表余额
export function payForCharge(data) {
    return request({
        url: '/order/operation',
        method: 'post',
        data: data
    })
}

//根据用户id检查该用户是否有未支付的订单，如有则不允许预约
export function checkOrder(id) {
    return request({
        url: '/order/checkIf/' + id,
        method: 'get',
    })
}