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
                    <el-col :span="3"></el-col>
                    <el-col :span="18">
                        <h3>所有充值记录列表</h3>
                        <div style="margin: 20px;" v-for="item in recharge_list" :key="item.id">
                            <el-descriptions class="margin-top" :column="3" size="small">
                                <el-descriptions-item>
                                    <template slot="label">
                                        充值记录编号
                                    </template>
                                    {{item.id}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        用户编号
                                    </template>
                                    {{item.userId}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        支付宝订单号
                                    </template>
                                    {{item.alipayId}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        金额
                                    </template>
                                    {{item.money}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-tickets"></i>
                                        状态
                                    </template>
                                    <el-tag size="small" type="success" effect="plain"
                                        v-if="item.status==1">未支付</el-tag>
                                    <el-tag size="small" type="primary" effect="plain"
                                        v-if="item.status==2">已支付</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        操作
                                    </template>
                                    <el-button type="primary" v-if="item.status == 1" size="mini"
                                        @click="handleCharge(item)">支付</el-button>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-office-building"></i>
                                        充值时间
                                    </template>
                                    {{item.chargeTime | dateTimeFormat}}
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-divider></el-divider>
                        </div>
                    </el-col>
                    <el-col :span="3"></el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import { getRecharge, fakeRecharge } from '@/api/private.js';
    export default {
        name: 'ElectricPileFrontIndex',

        data() {
            return {
                recharge_list: null,
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},


            };
        },

        mounted() {
            setInterval(() => {
                this.$forceUpdate();
            }, 60 * 1000);
        },
        created() {
            this.load();
        },

        methods: {
            load() {
                let id = this.user.id;
                getRecharge(id).then(res => {
                    if (res.data.code == 200) {
                        this.recharge_list = res.data.data;
                    }
                })
            },
            handleCharge(item) {
                // window.open('http://localhost:8086/alipay/pay?tradeNo=' + item.id + "&totalAmount=" + item.money + '&subject=' + item.userId);
                fakeRecharge(item).then(res => {
                    if (res.data.code == 200) {
                        console.log(res);
                        this.$message({message: '充值成功',type: 'success'});
                        this.load();
                    }
                })
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