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
                        <h3>所有订单列表</h3>
                        <div style="margin: 20px;" v-for="item in orderList" :key="item.id">
                            <el-descriptions class="margin-top" :column="6">
                                <el-descriptions-item>
                                    <template slot="label">
                                        订单编号
                                    </template>
                                    {{item.id}}
                                </el-descriptions-item>

                                <!-- <el-descriptions-item>
                                    <template slot="label">
                                        预约记录编号
                                    </template>
                                    {{item.reservationId}}
                                </el-descriptions-item> -->
                                <el-descriptions-item>
                                    <template slot="label">
                                        用户编号
                                    </template>
                                    {{item.userId}}
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        充电桩编号
                                    </template>
                                    {{item.pileId}}
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
                                    <el-tag size="small" type="danger" effect="plain" v-if="item.status==1">未支付</el-tag>
                                    <el-tag size="small" type="primary" effect="plain"
                                        v-if="item.status==2">已支付</el-tag>
                                    <el-tag size="small" type="success" effect="plain"
                                        v-if="item.status==3">已评价</el-tag>
                                </el-descriptions-item>

                                <el-descriptions-item>
                                    <template slot="label">
                                        操作
                                    </template>
                                    <el-button type="primary" v-if="item.status == 1" size="mini"
                                        @click="handlePayNow(item)">支付</el-button>
                                    <el-button type="primary" v-if="item.status == 2" size="mini"
                                        @click="handleAdd(item)">评价</el-button>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-office-building"></i>
                                        充电时间段
                                    </template>
                                    {{item.startTime | dateTimeFormat}} 至 {{item.overTime | dateTimeFormat}}
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-divider></el-divider>
                        </div>
                    </el-col>
                    <el-col :span="3"></el-col>
                </el-row>
            </el-main>
        </el-container>
        <div>
            <el-dialog title="新增评价" :visible.sync="dialogFormVisible" width="35%">
                <el-alert title="每个订单你只可以评价一次，请慎重考虑！" type="warning">
                </el-alert>
                <el-form label-width="100px" size="small">
                    <el-form-item label="评论类型">
                        <el-radio v-model="evaluate.genre" label="1">评价该电站</el-radio>
                        <el-radio v-model="evaluate.genre" label="2">评价该电桩</el-radio>
                    </el-form-item>
                    <el-form-item label="评分">
                        <el-slider show-input v-model="evaluate.score">
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="评价">
                        <el-input type="textarea" v-model="evaluate.comment" :rows="2" placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-for-item>
                        <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/"
                            multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-for-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNewEvaluate()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { getOrderList, payOrderNow, addEvaluate } from '@/api/private.js';
    import { getUserById } from '@/api/login.js';
    export default {
        name: 'ElectricPileFrontIndex',

        data() {
            return {
                orderList: null,
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
                userInformation: {},
                dialogFormVisible: false,
                evaluate: {},

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
                getOrderList(id).then(res => {
                    if (res.data.code == 200) {
                        this.orderList = res.data.data;
                    }
                });
                getUserById(id).then(res => {
                    if (res.data.code == 200) {
                        this.userInformation = res.data.data;
                    }
                })
            },

            handlePayNow(item) {
                if (this.userInformation.balance < item.money) {
                    this.$message.error("余额不足,请先在个人中心余额充值处充值")
                } else {
                    payOrderNow(item.id).then(res => {
                        if (res.data.code == 200 && res.data.data == true) {
                            this.$message.success("支付成功，余额已经扣除！")
                            this.load();
                            this.$router.go(0);
                        }
                    })
                }
            },
            handleAdd(item) {
                this.dialogFormVisible = true;
                this.evaluate.userId = item.userId;
                this.evaluate.pileId = item.pileId;
                this.evaluate.orderId = item.id;
            },
            addNewEvaluate() {
                addEvaluate(this.evaluate).then(res => {
                    if (res.data.code = 200) {
                        this.$message.success("评价成功！")
                    }
                    this.dialogFormVisible = false;
                    this.$router.go(0);
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