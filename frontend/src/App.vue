<template>
    <div id="app">
        <MyAside v-if="show_border" />

        <div class="container">
            <MyHeader v-if="show_border" />
            <Switch_tab v-if="show_border" />

            <router-view/>
            <!-- <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
            >
                <router-view/>
            </transition> -->
        </div>

    </div>
</template>

<script>
    import MyHeader from './components/header';
    import MyAside from './components/aside.vue';
    import Switch_tab from './components/switch_tab.vue'
    export default {
        name: 'App',
        components : {
            MyHeader , MyAside , Switch_tab
        },
        data(){
            return {
                show_border : false
            }
        },
        async created(){
            this.initLogin()

            // 语言
            let localLanguage = localStorage.lan
            if (localLanguage == undefined) {
                this.$i18n.i18next.changeLanguage('zh')
                localStorage.lan = 'zh'
            } else {
                this.$i18n.i18next.changeLanguage(localLanguage)
            }
        },
        watch : {
            $route (to , from) {
                // from : 从哪里来  to : 往哪里去
                this.judge_router(to.path);

                // 往 tab中添加路由
                if (this.show_border) {
                    this.$store.dispatch('switchTabAdd' , to)
                }

            }
        },
        methods : {
            judge_router (path) {
                switch (path) {
                case '/login' :
                    this.show_border = false ;
                    break;
                default :
                    this.show_border = true;
                    break;
                }
            },
            async initLogin () {
                let rsp = await this.$http(
                    this.apiRoot + '/is-login',
                    {},
                    'post'
                );
                if(rsp.ret == 0) {
                    if(window.location.pathname == '/' || window.location.pathname == '/back/login'){
                        this.$message.info("您已登录 ， 即将跳转至首页!");
                        setTimeout(() => {
                            this.$router.push({
                                name : '我的首页'
                            })
                        }, 1000)
                    }
                }else {
                    this.$message.info("登录过期 , 请重新登录");
                    this.$router.push({
                        name : '登录'
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
  @import "./assets/css/index.css";
  #app {
    width: 100%;
    height: 100%;
    display: flex;
    .container{
        flex : 1;
        height: 100%;
    }
    .animated{
        transition: .2s;
    }
  }
</style>
