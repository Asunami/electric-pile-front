<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="10">
                <el-carousel :interval="4000" type="card" height="312px">
                    <el-carousel-item v-for="item in imgList" :key="item.id">
                        <img :src=item.url />
                        <h5 class="medium">{{item.font}}{{ item.id }}</h5>
                    </el-carousel-item>
                </el-carousel>
                <el-divider></el-divider>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-statistic title="在线用户">
                            <template slot="formatter"> {{systemInfo.onlineUser}} </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic title="营业中充电站">
                            <template slot="formatter"> {{systemInfo.openStation}} </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic title="空闲充电桩">
                            <template slot="formatter"> {{systemInfo.usablePile}} </template>
                        </el-statistic>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="14">
                <h3>电站列表</h3>
                <div style="margin: 20px;" v-for="item in stationList" :key="item.id" class="station">
                    <el-image style="width: 120px; height: 120px" :src="item.picture">
                    </el-image>
                    <el-descriptions class="margin-top" :column="3">
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-user"></i>
                                电站名
                            </template>
                            {{item.name}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-mobile-phone"></i>
                                联系电话
                            </template>
                            {{item.phone}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                电站描述
                            </template>
                            {{item.description}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                电站状态
                            </template>
                            <el-tag type="success" effect="plain" v-if="item.status==1">营业中</el-tag>
                            <el-tag type="info" effect="plain" v-if="item.status==2">休息中</el-tag>
                            <el-tag type="danger" effect="plain" v-if="item.status==3">停业中</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-location-outline"></i>
                                地址
                            </template>
                            {{item.address}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                操作
                            </template>
                            <el-button type="primary" v-if="item.status == 1" size="mini"
                                @click="handleDetail(item.id)">查看详情</el-button>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { someStation, systemInfo } from '@/api/station.js'
    export default {
        name: 'ElectricPileFrontIndex',

        data() {
            return {
                imgList: [
                    { id: 1, url: require('@/assets/image/pile2.jpg'), font: "充电桩图" },
                    { id: 2, url: require('@/assets/image/pile3.jpg'), font: "充电桩图" },
                    { id: 3, url: require('@/assets/image/pile4.jpg'), font: "充电桩图" },
                    { id: 4, url: require('@/assets/image/pile5.jpg'), font: "充电桩图" },
                ],
                stationList: null,
                systemInfo: {},
                // location: null,
            };
        },
        created() {
            this.getSomeStation();
            this.getLocation();
        },

        mounted() {
        },

        methods: {
            //分页获取一定数量电站数据
            getSomeStation() {
                someStation().then(res => {
                    this.stationList = res.data.data.records;
                });
                systemInfo().then(res => {
                    this.systemInfo = res.data.data;
                })
            },
            getLocation() {
                const self = this
                AMap.plugin('AMap.Geolocation', function () {
                    var geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000,
                    })

                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', onComplete);
                    AMap.event.addListener(geolocation, 'error', onError);

                    function onComplete(data) {
                        // data是具体的定位信息
                        // self.location = data.position;
                        sessionStorage.setItem("location",JSON.stringify(data.position));
                        console.log('定位成功信息：', data);
                    }

                    function onError(data) {
                        // 定位出错
                        console.log('定位失败错误：', data);
                        // 调用ip定位
                        // self.getLngLatLocation();
                    }
                })
            },
            //跳转到指定电站详情页
            handleDetail(station_id) {
                console.log(station_id);
                this.$router.push({ path: '/station/detail', query: { id: station_id } });
            },

        },
    };
</script>

<style scoped>
    .row-bg {
        background-color: #f9fafc;
        height: 600px !important;
    }

    .station {
        display: flex;
        align-items: center;
    }

    .el-descriptions {
        width: 80%;
        margin-left: 20px;
    }
</style>