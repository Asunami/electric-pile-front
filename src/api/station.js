import request from '../utils/request.js'

//获取指定数量的电站信息
export function someStation(params) {
    return request({
        url: '/station/some',
        method: 'get',
        params: params
    })
}

//获取指定电站的信息
export function stationDetail(id) {
    return request({
        url: '/station/detail/'+id,
        method: 'get',
    })
}

//获取指定电站其下所有电桩的信息
export function stationPileDetail(id) {
    return request({
        url: '/station/detailPile/'+id,
        method: 'get',
    })
}

//获取指定电站其下评论
export function stationComment(id) {
    return request({
        url: '/station/comment/'+id,
        method: 'get',
    })
}

//根据传入的参数筛选获取电站列表
export function stationQueryList(data){
    return request({
        url:'/station/selectAll',
        method:'post',
        data:data
    })
}

//构造地图渲染所需参数
export function stationLocationMap() {
    return request({
        url: '/station/selectForMap',
        method: 'get',
    })
}

//获取系统在线数量信息
export function systemInfo() {
    return request({
        url: '/station/systemInfo',
        method: 'get',
    })
}