<template>
    <div>
        <el-row class="header_all" :gutter="20" type="flex" align="middle">
            <el-col :span="6" class="header_right">
                <div>
                    <h3 @click="j2home()">充电桩预约系统</h3>
                </div>
                <div><i class="el-icon-lightning"></i></div>
            </el-col>
            <el-col :span="10" class="header_main">
                <el-menu mode="horizontal" background-color="#24292f" text-color="#fff"
                    active-text-color="#ffd04b" router>
                    <el-menu-item index="/home">首页</el-menu-item>
                    <el-submenu index="">
                        <template slot="title">电站列表</template>
                        <el-menu-item index="/station/list">列表展示</el-menu-item>
                        <el-menu-item index="/station/map">地图展示</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/pile/charge">充电详情</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="8" class="header_left">
                <div class="header_self">
                    <el-dropdown>
                        <span class="el-dropdown-link" style="color: #fff;">
                            当前用户 : {{user.nickname}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="j2private()">个人中心</el-dropdown-item>
                            <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-avatar :src=user.avatar style="margin-right: 10px; margin-left: 10px;"></el-avatar>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { userLogout } from '@/api/login.js'
    export default {
        name: 'ElectricPileFrontHeader',

        data() {
            return {
                user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},

            };
        },

        mounted() {

        },

        methods: {
            logout() {
                let id = this.user.id;
                console.log(id);
                userLogout(id).then(res => {
                    if (res.data.code == 200) {
                        sessionStorage.removeItem("user");
                        this.$message.success("退出成功");
                        this.$router.push("/login");
                    }
                })
            },
            j2private() {
                this.$router.push("/private/updateInfo")
            },
            j2home() {
                this.$router.push("/home")
            }

        },
    };
</script>

<style scoped>
    .el-menu {
        text-align: center;
        width: 100%;
    }

    .el-menu-item {
        width: 240px;
    }

    .header_all {
        background-color: #24292f;
    }

    .header_right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        color: #fff
    }

    .header_main {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #24292f;
    }

    .header_self {
        display: flex;
        align-items: center;
        justify-content: flex-end;

    }

    .header_left {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>