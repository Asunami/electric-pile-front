<template>
    <!-- 底部栏 -->
    <div class="footer">
        <div class="footer_right">
            当前日期：{{nowTime}}
        </div>
        <div class="footerfont">
            <a href="http://00.00.00.00/" target="_blank" class="no-decoration">用户体验实验室</a>
            "2023 | 版权所有 ©"
            <a href="http://www.xxxx.com/" target="_blank">贵州大学</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ElectricPileFrontFooter',

        data() {
            return {
                nowTime: '',

            }
        },

        mounted() {
            setInterval(() => {
                this.getNowDate();
            }, 1000);
        },

        methods: {
            getNowDate() {
                var date = new Date();
                var sign2 = ":";
                var year = date.getFullYear() // 年
                var month = date.getMonth() + 1; // 月
                var day = date.getDate(); // 日
                var hour = date.getHours(); // 时
                var minutes = date.getMinutes(); // 分
                var seconds = date.getSeconds();
                this.nowTime = year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
            }

        },
    };
</script>

<style scoped>
    .footer {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2px;
    }

    .footer_right {
        color: #76838f;
        font-size: smaller;
        margin-left: 20px;

    }

    .footerfont {
        color: #76838f;
        font-size: smaller;
        margin-right: 20px;
    }
</style>