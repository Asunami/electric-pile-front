<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-around">
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
                                    <el-tag type="danger" effect="plain" v-if="pile.status==3">有故障</el-tag>
                                    <el-tag type="danger" effect="plain" v-if="pile.status==4">不可用</el-tag>
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
                <el-button type="primary" @click="handleAdd()">点击预约</el-button>
                <h3>所有预约记录列表</h3>
                <div style="margin: 20px;" v-for="item in reservation_list" :key="item.id">
                    <el-descriptions class="margin-top" :column="3">
                        <el-descriptions-item>
                            <template slot="label">
                                预约记录编号
                            </template>
                            {{item.id}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                状态
                            </template>
                            <el-tag type="success" effect="plain" v-if="item.status==1">未开始</el-tag>
                            <el-tag type="primary" effect="plain" v-if="item.status==2">已开始</el-tag>
                            <el-tag type="danger" effect="plain" v-if="item.status==3">已结束</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                操作
                            </template>
                            <el-button type="primary" v-if="item.userId == user.id" size="mini"
                                @click="handleEdit(item)">编辑</el-button>
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
                </div>
            </el-col>
        </el-row>
        <el-dialog title="选择预约信息" width="25%" :visible.sync="dialogFormVisible">
            <el-form :rules="rules">
                <el-form-item label="开始时间">
                    <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="form.overTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="查看该时间段是否可用">
                    <el-button type="primary" @click="checkReserveUsable()">查询</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="save()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { pileDetail, pileResrvation, pileComment, checkUsable, addReservation, checkOrder } from '@/api/pile.js'
    import moment from 'moment';
    export default {
        name: 'ElectricPileFrontDetail',

        data() {
            return {
                pile: {
                    id: this.$route.query.id,
                },
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
                reservation_list: null,
                evaluate_list: null,
                dialogFormVisible: false,
                form: {},
                rules: {

                }

            };
        },
        created() {
            this.getPileDetail();
            this.getPileReservation();
            this.getPileComment();
        },

        mounted() {

        },

        methods: {
            getTimeDiff(date) {
                const duration = moment.duration(moment().diff(moment(date)));
                const days = Math.abs(duration.days());
                const hours = Math.abs(duration.hours());
                const minutes = Math.abs(duration.minutes());

                return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
            },
            getPileDetail() {
                pileDetail(this.pile.id).then(res => {
                    this.pile = res.data.data;
                })
            },
            getPileReservation() {
                pileResrvation(this.pile.id).then(res => {
                    this.reservation_list = res.data.data;
                })
            },
            getPileComment() {
                pileComment(this.pile.id).then(res => {
                    this.evaluate_list = res.data.data;

                })
            },
            checkReserveUsable() {
                this.form.pileId = this.pile.id;
                checkUsable(this.form).then(res => {
                    if (res.data.data == false) {
                        this.$message.error("该时间段不可用！")
                    } else {
                        this.$message.success("该时间段可用！")
                    }

                })
            },
            save() {
                this.form.userId = this.user.id;
                addReservation(this.form).then(res => {
                    if (res.data.data == true) {
                        this.$message.success("预约成功！")
                        this.dialogFormVisible = false;
                        this.getPileReservation();
                    }
                })
            },

            handleEdit(item) {
                this.form = item;
                this.dialogFormVisible = true;
            },
            handleAdd() {
                let userId = this.user.id
                checkOrder(userId).then(res => {
                    if (res.data.code == 200 && res.data.data == true) {
                        console.log(res);
                        this.dialogFormVisible = true;
                        this.form = {};//如果之前有填过值，可以置空 
                    }
                    else {
                        this.$message.error("您有订单尚未支付，请先完成未支付订单！")
                    }
                })
            }

        },
    };
</script>

<style scoped>
    .row-bg {
        background-color: #f9fafc;
        height: 600px !important;
    }
</style>