<template>
    <div>
        <el-row type="flex" justify="space-around">
            <el-col :span="8">
                <div>
                    <el-card>
                        <div slot="header" class="clearfix">
                            <span>充电桩编号：{{pile.id}}</span>
                            <el-descriptions title="电桩信息" :column="1">
                                <el-descriptions-item label="价格">{{pile.price}}/小时</el-descriptions-item>
                                <el-descriptions-item label="功率">{{pile.power}}瓦</el-descriptions-item>
                                <el-descriptions-item label="状态">
                                    <el-tag type="success" effect="plain" v-if="pile.status==1">空闲中</el-tag>
                                    <el-tag type="info" effect="plain" v-if="pile.status==2">充电中</el-tag>
                                    <el-tag type="danger" effect="plain" v-if="pile.status==3">不可用</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item label="信息">{{pile.information}}</el-descriptions-item>
                                <el-descriptions-item label="建桩时间">{{pile.creatTime |
                                    dateFormat}}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <span>评价</span>
                        <div v-for="comment in evaluate_list" :key="comment.id" class="text item">
                            <el-descriptions :column="3">
                                <el-descriptions-item label="评价人">{{comment.nickname}}</el-descriptions-item>
                                <el-descriptions-item label="评分">{{comment.score}}</el-descriptions-item>
                                <el-descriptions-item label="评论时间">{{comment.commentTime |
                                    dateFormat}}</el-descriptions-item>
                                <el-descriptions-item label="评论内容">{{comment.comment}}</el-descriptions-item>
                            </el-descriptions>
                            <el-divider></el-divider>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="charge">
                    <h3>正在充电中</h3>
                    <el-descriptions :column="1">
                        <el-descriptions-item>
                            <template slot="label">
                                预约记录编号
                            </template>
                            {{reservation.id}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                充电桩编号
                            </template>
                            {{reservation.pileId}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                状态
                            </template>
                            <el-tag size="small" type="success" effect="plain" v-if="reservation.status==1">未开始</el-tag>
                            <el-tag size="small" type="primary" effect="plain" v-if="reservation.status==2">已开始</el-tag>
                            <el-tag size="small" type="danger" effect="plain" v-if="reservation.status==3">已结束</el-tag>
                        </el-descriptions-item>

                        <el-descriptions-item label="已充时间">
                            {{getTimeDiff(reservation.startTime)}}
                        </el-descriptions-item>

                        <el-descriptions-item label="距离结束">
                            {{getTimeDiff(reservation.overTime)}}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                预约时间段
                            </template>
                            {{reservation.startTime | dateTimeFormat}}至{{reservation.overTime | dateTimeFormat}}
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template slot="label">
                                操作
                            </template>
                            <el-popconfirm style="margin-left:5px" confirm-button-text='确定' cancel-button-text='再想想'
                                icon="el-icon-info" icon-color="red" title="您确定结束吗？" @confirm="chargeOver()">
                                <el-button type="primary" size="small" slot="reference"
                                    icon="el-icon-delete">结束充电</el-button>
                            </el-popconfirm>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="本次充电详情" :visible.sync="dialogchargeOverVisible" width="30%">
            <el-descriptions :column="1">
                <el-descriptions-item label="预约编号">{{reservation.id}}</el-descriptions-item>
                <el-descriptions-item label="充电桩编号">{{reservation.pileId}}</el-descriptions-item>
                <el-descriptions-item label="用户编号">{{reservation.userId}}</el-descriptions-item>
                <el-descriptions-item label="充电时长">{{getTimeDiff(reservation.startTime)}}</el-descriptions-item>
                <el-descriptions-item label="应付金额">{{getChargeFee(reservation.startTime)}}</el-descriptions-item>
                <el-descriptions-item label="账户余额">{{userInformation.balance}}</el-descriptions-item>
                <el-descriptions-item label="操作">
                    <el-button type="primary" size="small" @click="payChargeNow()">支付</el-button>
                </el-descriptions-item>
            </el-descriptions>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogchargeOverVisible = false">取 消</el-button>
                <el-button type="primary" @click="notPayNow()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { pileDetail, pileComment, getStart, payForCharge } from '@/api/pile.js';
    import { getUserById } from '@/api/login.js';
    import moment from 'moment';
    export default {
        name: 'ElectricPileFrontCharge',

        data() {
            return {
                reservation: null,
                pile: null,
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
                userInformation: {},
                evaluate_list: null,
                dialogchargeOverVisible: false,

            };
        },

        mounted() {
            setInterval(() => {
                this.$forceUpdate();
            }, 60 * 1000);
        },
        created() {
            this.getStartReserve();
        },

        methods: {
            getStartReserve() {
                let id = this.user.id;
                getStart(id).then(res => {
                    if (res.data.code == 200) {
                        this.reservation = res.data.data;
                        if (this.reservation != null) {
                            let pileId = this.reservation.pileId;
                            pileComment(pileId).then(res => {
                                this.evaluate_list = res.data.data;
                            });
                            pileDetail(pileId).then(res => {
                                this.pile = res.data.data;
                            })
                        }
                        else {
                            this.$message.info("当前并没有正在充电的订单");
                        }
                    }
                })
            },
            getTimeDiff(date) {
                const duration = moment.duration(moment().diff(moment(date)));
                const days = Math.abs(duration.days());
                const hours = Math.abs(duration.hours());
                const minutes = Math.abs(duration.minutes());
                return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
            },

            getChargeFee(date) {
                const duration = moment.duration(moment().diff(moment(date)));
                const hours = Math.abs(duration.hours());
                const minutes = Math.abs(duration.minutes());
                const price = this.pile.price;
                return (hours * 60 + minutes) * price / 60;
            },

            chargeOver() {
                this.dialogchargeOverVisible = true;
                let userId = this.user.id;
                getUserById(userId).then(res => {
                    if (res.data.code == 200) {
                        this.userInformation = res.data.data;
                    }
                })
            },
            payChargeNow() {
                if (this.userInformation.balance < this.getChargeFee(this.reservation.startTime)) {
                    this.$message.error("余额不足,您可以先点击确定,稍后前往个人中心支付")
                } else {
                    let payList = Object.assign({}, this.reservation);
                    Object.defineProperty(payList, 'reservationId', Object.getOwnPropertyDescriptor(payList, 'id'));
                    delete payList.id;
                    Object.assign(payList,{money:''});
                    payList.money = this.getChargeFee(payList.startTime);
                    payForCharge(payList).then(res => {
                        if (res.data.code == 200 && res.data.data == true)
                            this.$message.success("支付成功，已为您生成订单记录并扣除余额")
                        this.dialogchargeOverVisible = false;
                        this.$router.go(0);
                    })
                }
            },
            notPayNow() {
                let payList = Object.assign({}, this.reservation);
                Object.defineProperty(payList, 'reservationId', Object.getOwnPropertyDescriptor(payList, 'id'));
                delete payList.id;
                Object.assign(payList,{money:''});
                payList.money = this.getChargeFee(payList.startTime)
                payList.status = 1;
                payForCharge(payList).then(res => {
                    if (res.data.code == 200 && res.data.data == true)
                        this.$message.success("结束充电成功，已为您生成订单记录，不要忘记前往支付哦！")
                    this.dialogchargeOverVisible = false;
                    this.getStartReserve();
                    this.$router.go(0);
                })
            }

        },
    };
</script>

<style scoped>
    .charge {
        margin: 20px;
    }
</style>