<template>
    <div class="box">
        <el-container class="container">
            <el-header class="head">
                <h2 style="font-size:260%; color: #ffffff;">欢迎使用预约充电系统</h2>
            </el-header>
            <el-main class="main">
                <el-row class="el-row" justify="space-around">
                    <el-col :span="6"></el-col>
                    <el-col :span="8" class="el-col">
                        <div class="login">
                            <el-form ref="form" label-width="100px" :model="form" :rules="rules" align="center">
                                <el-form-item prop="username">
                                    <el-input v-model="form.username" placeholder="输入用户名"></el-input>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model="form.password" show-password placeholder="输入密码"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="login('form')">登录</el-button>
                                    <el-button type="danger" @click="resetForm('form')">取消</el-button>

                                </el-form-item>
                                <el-form-item>
                                    <span>没有账号？前往</span>
                                    <el-button type="info" plain @click="jumpToRegister()">注册</el-button>
                                </el-form-item>

                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="6"></el-col>
                </el-row>
            </el-main>
            <el-footer>
                <div class="footer">
                    <div class="footerfont">
                        <a href="http://00.00.00.00/" target="_blank" class="no-decoration">用户体验实验室</a>
                        "2023 | 版权所有 ©"
                        <a href="http://www.xxxx.com/" target="_blank">贵州大学</a>
                    </div>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import { userLogin } from '@/api/login.js'
    import { usernameRule, passwordRule } from '@/utils/vaildate.js'
    export default {
        name: 'ElectricPileFrontLogin',

        data() {
            return {
                form: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [{ validator: usernameRule, trigger: 'blur' }],
                    password: [{ validator: passwordRule, trigger: 'blur' }]
                },

            };
        },

        mounted() {

        },
        created() {
        },

        methods: {
            login(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        userLogin(this.form).then(res => {
                            if (res.data.code === 200) {
                                //存储用户信息到浏览器
                                sessionStorage.setItem('user', JSON.stringify(res.data.data));
                                this.$message({ message: '登录成功', type: 'success' });
                                this.$router.replace('/home');
                            }
                        }).catch((err) => {
                            console.error(err);
                            this.$message.error("用户名或密码错误！")
                        });
                    } else {
                    }
                });
            },
            resetForm(form) {
                this.$refs[form].resetFields();
            },
            jumpToRegister() {
                this.$router.push('/register');
            }


        },
    };
</script>

<style scoped>
    .box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .container {
        width: 100%;
        height: 100%;
        background-image: url("../../assets/image/login.jpg");
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .login {
        /* display: flex;
        justify-content: center;
        align-items: center; */
        width: 300px;
    }

    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 180px);
        width: 100%;
    }

    .footer {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-radius: 2px;
    }

    .footer-font {
        color: #76838f;
        font-size: smaller;
    }
</style>