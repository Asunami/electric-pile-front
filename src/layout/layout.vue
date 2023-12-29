<template>
    <div class="box">
        <el-container class="container">
            <!-- 顶栏区域、中间展示部分、底栏区域 -->
            <el-header class="header" height="60px" width="100%">
                <Header></Header>
            </el-header>
            <!-- 中间、底栏区域 -->
            <el-main class="main">
                <Main></Main>
            </el-main>
            <el-footer class="footer" height="40px">
                <Footer></Footer>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import { Header, Main, Footer } from './components';
    export default {
        name: 'ElectricPileFrontLayout',
        components: {
            Header,
            Main,
            Footer
        },

        data() {
            return {

            };
        },

        mounted() {

        },

        methods: {

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
        height: 100%;
    }

    .header {
        padding-left: 10px;
        padding-right: 10px;
    }

    .main {
        position: absolute;
        top: 60px;
        left: 0px;
        right: 0px;
        bottom: 40px;
        height: calc(100% - 100px);
        padding: 10px;
    }

    .footer {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 10px;
    }
</style>