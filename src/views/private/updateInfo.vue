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
                <div class="selfInformation">
                    <el-descriptions :column="1">
                        <el-descriptions-item label="头像">
                            <el-image style="width: 60px;height: 60px;" :src="userInformation.avatar"></el-image>
                        </el-descriptions-item>
                        <el-descriptions-item label="用户编号">{{userInformation.id}}</el-descriptions-item>
                        <el-descriptions-item label="用户名">{{userInformation.username}}</el-descriptions-item>
                        <el-descriptions-item label="昵称">{{userInformation.nickname}}</el-descriptions-item>
                        <el-descriptions-item label="电话">{{userInformation.phone}}</el-descriptions-item>
                        <el-descriptions-item label="账户余额">{{userInformation.balance}}</el-descriptions-item>
                        <el-descriptions-item label="注册时间">{{userInformation.creatTime |
                            dateTimeFormat}}</el-descriptions-item>
                        <el-descriptions-item label="车辆电量">{{userInformation.battery}}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <el-divider><i class="el-icon-edit"></i></el-divider>
                <div style="display: flex;flex-direction: column; width: 200px;">
                    <el-button type="primary" plain style="margin-bottom: 10px;" @click="handleEdit()">编辑信息</el-button>
                    <span></span>
                    <el-button type="primary" plain @click="handleCharge()">余额充值</el-button>
                </div>
            </el-main>
        </el-container>

        <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="25%">
            <el-form label-width="80px" size="small">
                <el-form-item label="头像">
                    <single-upload v-model="form.avatar"></single-upload>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="form.nickname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="车辆电量">
                    <el-input v-model="form.battery" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="余额充值" :visible.sync="dialogRechargeVisible" width="25%">
            <el-input placeholder="请输入你想充值的金额" v-model="recharge.money">

            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRechargeVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRecharge()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import { getUserById, addUser,addRecharge } from '@/api/login.js';
    import SingleUpload from '@/components/upload/singleUpload';
    export default {

        name: 'ElectricPileFrontIndex',
        components:{SingleUpload},
        data() {
            return {
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
                userInformation: null,
                dialogFormVisible: false,
                dialogRechargeVisible:false,
                form: {},
                recharge:{},

            };
        },
        created() {
            this.getUser();
        },

        mounted() {

        },
        methods: {
            handleCharge(){
                this.dialogRechargeVisible=true;
            },
            getUser() {
                let id = this.user.id;
                getUserById(id).then(res => {
                    if (res.data.code == 200) {
                        this.userInformation = res.data.data;
                    }
                })
            },
            handleEdit() {
                this.dialogFormVisible = true;
                this.form = this.userInformation;
            },
            save() {
                addUser(this.form).then(res => {
                    if (res.data.code == '200') {
                        this.$message.success("保存成功");
                        this.dialogFormVisible = false;
                    } else {
                        this.$message.error("保存失败");
                    }
                })
            },
            saveRecharge(){
                this.recharge.userId=this.user.id;
                this.recharge.status=1;
                addRecharge(this.recharge).then(res => {
                    if(res.data.code == 200 & res.data.data == true){
                        this.$message.success("新增充值记录成功，快去充值记录页支付吧！")
                    }
                })
                this.dialogRechargeVisible = false;
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

    .selfInformation {
        margin-left: 50px;
    }
</style>