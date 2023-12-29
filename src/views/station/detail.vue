<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="8">
                <div>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{station.name}}</span>
                            <el-descriptions title="电站信息" :column="1">
                                <el-descriptions-item label="联系电话">{{station.phone}}</el-descriptions-item>
                                <el-descriptions-item
                                    label="坐标">{{station.longitude}},{{station.latitude}}</el-descriptions-item>
                                <el-descriptions-item label="建站时间">{{station.creatTime |
                                    dateFormat}}</el-descriptions-item>
                                <el-descriptions-item label="状态">
                                    <el-tag type="success" effect="plain" v-if="station.status==1">营业中</el-tag>
                                    <el-tag type="info" effect="plain" v-if="station.status==2">休息中</el-tag>
                                    <el-tag type="danger" effect="plain" v-if="station.status==3">停业中</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item label="地址">{{station.address}}</el-descriptions-item>
                                <el-descriptions-item label="描述">{{station.description}}</el-descriptions-item>
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
            <el-col :span="16">
                <h3>充电桩列表</h3>
                <div style="margin: 20px;" v-for="item in pile_list" :key="item.id" class="pile">
                    <el-image style="width: 100px; height: 100px" :src="item.picture" :fit="fit">
                    </el-image>
                    <el-descriptions class="margin-top" :column="5">
                        <el-descriptions-item>
                            <template slot="label">
                                充电桩编号
                            </template>
                            {{item.id}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                价格
                            </template>
                            {{item.price}}/小时
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                功率
                            </template>
                            {{item.power}}瓦
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                状态
                            </template>
                            <el-tag type="success" effect="plain" v-if="item.status==1">空闲中</el-tag>
                            <el-tag type="info" effect="plain" v-if="item.status==2">充电中</el-tag>
                            <el-tag type="danger" effect="plain" v-if="item.status==3">有故障</el-tag>
                            <el-tag type="danger" effect="plain" v-if="item.status==4">不可用</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                操作
                            </template>
                            <el-button type="primary" v-if="item.status == 1 || item.status == 2" size="mini"
                                @click="handleDetail(item.id)">查看</el-button>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                电桩信息
                            </template>
                            {{item.information}}
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { stationDetail, stationPileDetail, stationComment } from '@/api/station.js'
    export default {
        name: 'ElectricPileFrontDetail',

        data() {
            return {
                station: {
                    id: this.$route.query.id
                },
                pile_list: null,
                evaluate_list: null,
            };
        },
        created() {
            this.getStationDetail();
            this.getStationPile();
            this.getStationComment();
        },

        mounted() {

        },

        methods: {
            getStationDetail() {
                stationDetail(this.station.id).then(res => {
                    this.station = res.data.data;
                })
            },
            getStationPile() {
                stationPileDetail(this.station.id).then(res => {
                    this.pile_list = res.data.data;
                })
            },
            getStationComment() {
                stationComment(this.station.id).then(res => {
                    this.evaluate_list = res.data.data;
                })
            },
            //跳转到指定充电桩详情页
            handleDetail(pile_id) {
                console.log(pile_id);
                this.$router.push({ path: '/pile/detail', query: { id: pile_id } });
            },

        },
    };
</script>

<style scoped>
    .row-bg {
        background-color: #f9fafc;
        height: 600px !important;
    }
    .pile{
        display: flex;
        align-items: center;
    }
    .el-descriptions {
        width: 80%;
        margin-left: 20px;
    }
</style>