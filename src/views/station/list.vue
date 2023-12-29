<template>
    <div>
        <el-container>
            <el-header>
                <div class="text-item">
                    <el-form :inline="true" :model="StationListQuery">
                        <el-form-item label="电站名称">
                            <el-input v-model="StationListQuery.name" placeholder="输入电站名称"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="StationListQuery.address" placeholder="输入地址"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="StationListQuery.sort" placeholder="排序方式">
                                <el-option label="默认排序" value="1"></el-option>
                                <el-option label="距我最近" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSearchList()">查询</el-button>
                            <el-button type="primary" @click="resetListForm()">重置</el-button>
                        </el-form-item>
                    </el-form>

                </div>
            </el-header>
            <el-main>
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="6"></el-col>
                    <el-col :span="14">
                        <h3>电站列表</h3>
                        <div style="margin: 20px;" v-for="item in stationList" :key="item.id" class="station">
                            <el-image style="width: 120px; height: 120px" :src="item.picture" :fit="fit">
                            </el-image>
                            <el-descriptions class="margin-top" :column="3" :size="size">
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
                                        <i class="el-icon-location-outline"></i>
                                        距离我
                                    </template>
                                    {{item.distance}}千米
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
                                        <i class="el-icon-office-building"></i>
                                        电站描述
                                    </template>
                                    {{item.description}}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        操作
                                    </template>
                                    <el-button type="primary" size="mini" v-if="item.status == 1"
                                        @click="handleDetail(item.id)">查看详情</el-button>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <i class="el-icon-location-outline"></i>
                                        地址
                                    </template>
                                    {{item.address}}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </el-col>
                    <el-col :span="4"></el-col>
                </el-row>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        layout="total, sizes, prev, pager, next, jumper" :page-size="StationListQuery.pageSize"
                        :page-sizes="[1,5,10]" :current-page.sync="StationListQuery.pageNum" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
        </el-container>

    </div>
</template>
<script>
    import { stationQueryList } from '@/api/station.js';
    const defaultStationListQuery = {
        id: null,
        name: null,
        address: null,
        sort: '1',
        longitude: null,
        latitude: null,
        pageNum: 1,
        pageSize: 10
    }
    export default {

        name: 'ElectricPileFrontList',

        data() {
            return {
                stationList: null,
                location: sessionStorage.getItem("location") ? JSON.parse(sessionStorage.getItem("location")) : {},
                StationListQuery: Object.assign({}, defaultStationListQuery),
                total: '',

            };
        },
        watch: {
            // location: {
            //     handler(val, oldVal) {
            //         console.log(val, oldVal);
            //         this.load();
            //     },
            //     deep: true
            // }
        },
        created() {
            this.setUserLocation();
            this.load();
        },


        mounted() {

        },

        methods: {
           
            resetListForm() {
                this.StationListQuery = Object.assign({}, defaultStationListQuery);

            },
            //传递坐标
            setUserLocation() {
                this.StationListQuery.latitude = this.location.lat;
                this.StationListQuery.longitude = this.location.lng;
            },
            //请求方法
            load() {
                stationQueryList(this.StationListQuery).then(res => {
                    if (res.data.code == 200) {
                        this.stationList = res.data.data.list;
                        this.total = res.data.data.total;
                    }

                })
            },
            handleSearchList() {
                this.load();
                this.$message.success("查找成功");
            },
            handleSizeChange(val) {/*传递过来当前是第几页*/
                console.log(`每页 ${val} 条`);
                this.StationListQuery.pageSize = val;  //获取当前每页显示条数
                this.load();
            },
            handleCurrentChange(val) {/*传递过来当前是第几页*/
                console.log(`当前页: ${val}`);
                this.StationListQuery.pageNum = val;   //获取当前第几页
                this.load();
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
    .station {
        display: flex;
        align-items: center;
    }

    .el-descriptions {
        width: 80%;
        margin-left: 20px;
    }
</style>