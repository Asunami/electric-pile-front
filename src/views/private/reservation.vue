<template>
    <div class="box">
        <el-container class="container">
            <el-aside width="200px" class="aside">
                <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
                    <el-menu-item index="/private/updateInfo">
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                    <el-menu-item index="/private/reservation">
                        <span slot="title">预约记录</span>
                    </el-menu-item>
                    <el-menu-item index="/private/orderItem">
                        <span slot="title">我的订单</span>
                    </el-menu-item>
                    <el-menu-item index="/private/recharge">
                        <span slot="title">充值记录</span>
                    </el-menu-item>
                    <el-menu-item index="/private/consumption">
                        <span slot="title">消费记录</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="1"></el-col>
                    <el-col :span="22">
                        <h3>所有预约记录列表</h3>
                        <div style="margin: 20px;" v-for="item in reservation_list" :key="item.id">
                            <el-descriptions class="margin-top" :column="5">
                                <el-descriptions-item>
                                    <template slot="label">
                                        预约记录编号
                                    </template>
                                    {{item.id}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        充电桩编号
                                    </template>
                                    {{item.pileId}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        电站名称
                                    </template>
                                    {{item.name}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-tickets"></i>
                                        状态
                                    </template>
                                    <el-tag size="small" type="success" effect="plain"
                                        v-if="item.status==1">未开始</el-tag>
                                    <el-tag size="small" type="primary" effect="plain"
                                        v-if="item.status==2">已开始</el-tag>
                                    <el-tag size="small" type="danger" effect="plain" v-if="item.status==3">已结束</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        操作
                                    </template>
                                    <el-button type="primary" v-if="item.userId == user.id" size="small"
                                        @click="handleStart(item)">开始充电</el-button>
                                    <el-popconfirm style="margin-left:5px" confirm-button-text='确定'
                                        cancel-button-text='再想想' icon="el-icon-info" icon-color="red" title="您确定取消吗？"
                                        @confirm="handleDelete(item.id)">
                                        <el-button type="danger" size="small" slot="reference"
                                            icon="el-icon-delete">取消</el-button>
                                    </el-popconfirm>
                                </el-descriptions-item>

                                <el-descriptions-item label="距离开始">
                                    {{getTimeDiff(item.startTime)}}
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-office-building"></i>
                                        预约时间段
                                    </template>
                                    {{item.startTime | dateTimeFormat}}至{{item.overTime | dateTimeFormat}}
                                </el-descriptions-item>

                            </el-descriptions>
                            <el-divider></el-divider>
                        </div>
                    </el-col>
                    <el-col :span="1"></el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import { getReserve, deleteReserve, changeToStart } from '@/api/private.js';
    import moment from 'moment';
    export default {
        name: 'ElectricPileFrontIndex',

        data() {
            return {
                reservation_list: null,
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
            };
        },

        mounted() {
            setInterval(() => {
                this.$forceUpdate();
            }, 60 * 1000);

        },
        created() {
            this.load()
        },

        methods: {
            getTimeDiff(date) {
                const duration = moment.duration(moment().diff(moment(date)));
                const days = Math.abs(duration.days());
                const hours = Math.abs(duration.hours());
                const minutes = Math.abs(duration.minutes());
                if (days === 0 && hours === 0 && minutes <= 10) {
                    this.$message.info('距离最近的预约即将开始!');
                }
                return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
            },

            load() {
                let id = this.user.id;
                getReserve(id).then(res => {
                    if (res.data.code == 200) {
                        this.reservation_list = res.data.data;
                    }
                })
            },
            handleDelete(id) {
                deleteReserve(id).then(res => {
                    if (res.data.code == 200 && res.data.data == true) {
                        this.$message.success("取消成功！");
                    } else (
                        this.$message.error("取消失败！")
                    )
                    this.load();
                })
            },
            handleStart(item) {
                const duration = moment.duration(moment().diff(moment(item.startTime)));
                const days = Math.abs(duration.days());
                const hours = Math.abs(duration.hours());
                const minutes = Math.abs(duration.minutes());
                if (days === 0 && hours === 0 && minutes <= 30) {
                    changeToStart(item.id).then(res => {
                        if (res.data.code == 200 && res.data.data == true)
                            this.$message.success("开始充电成功，请前往充电详情页查看相关信息！");
                            this.$router.push('/pile/charge');
                    })
                } else {
                    this.$message.error("距离预约时间还早,请耐心等待...")
                }
            }

        },
    };
</script>

<style scoped>
    .box {
        height: 100%;
    }

    .container {
        height: 100%;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
        height: 100%;
    }

    .el-menu-vertical-demo {
        height: 100%;
    }

    .el-main {
        text-align: center;
        line-height: 20px;
    }
</style>