<template>
    <div>
        <div style="width: 100%; height: 600px;">
            <amap cache-key="map" ref="map" view-mode='2D' :zoom="zoom" :center="center">
                <amap-marker v-for="(item,index) in station_list" :key="index"
                    :position="[item.longitude,item.latitude]" @click="showInfo(item)">
                </amap-marker>
            </amap>
        </div>
        <el-dialog title="电站信息" :visible.sync="dialogFormVisible" width="28%">
            <el-form label-width="90px" size="small">
                <el-form-item label="状态">
                    <el-tag type="success" effect="plain" v-if="form.status==1">营业中</el-tag>
                    <el-tag type="info" effect="plain" v-if="form.status==2">休息中</el-tag>
                    <el-tag type="danger" effect="plain" v-if="form.status==3">停业中</el-tag>
                </el-form-item>
                <el-form-item label="电站名">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <span>是否前往详情页查看</span>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="j2Detail(form.id)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { stationQueryList, stationLocationMap } from '@/api/station.js';
    const defaultStationListQuery = {
        id: null,
        name: null,
        address: null,
        sort: null,
        longitude: null,
        latitude: null,
        pageNum: 1,
        pageSize: 10
    }
    export default {
        data() {
            return {
                StationListQuery: Object.assign({}, defaultStationListQuery),
                location: sessionStorage.getItem("location") ? JSON.parse(sessionStorage.getItem("location")) : {},
                center: [],
                station_list: null,
                zoom: 14,
                form:{},
                dialogFormVisible:false
            };
        },
        created() {
            this.setAmapCenter();
            this.load();
        },

        methods: {
            j2Detail(station_id){
                this.$router.push({ path: '/station/detail', query: { id: station_id } });
            },
            showInfo(item){
                this.form = item;
                this.dialogFormVisible=true;
            },
            //设置地图中心坐标
            setAmapCenter(){
                this.center.push(this.location.lng,this.location.lat);
            },
            //请求方法
            load() {
                stationQueryList(this.StationListQuery).then(res => {
                    if (res.data.code == 200) {
                        this.station_list = res.data.data.list;
                    }
                    console.log(this.station_list)

                })
            },
        },
    };
</script>
<style scoped>

</style>