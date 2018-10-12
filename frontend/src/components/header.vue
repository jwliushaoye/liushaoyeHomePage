<template>
    <div id="myHeader">
        <div class="header-left">
            <i :class="show_aside ? 'fa fa-navicon' : 'fa fa-navicon fa-rotate-90'" @click="isCollapse"></i>
        </div>

        <div class="header-right">
            <div v-if="!is_fullScreen">
                <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
                    <i class="fa fa-arrows-alt" @click="fullScreen"></i>
                </el-tooltip>
            </div>

            <div v-if="is_fullScreen">
                <el-tooltip class="item" effect="dark" content="退出全屏" placement="bottom">
                    <i class="fa fa-compress" @click="exit_fullScreen"></i>
                </el-tooltip>
            </div>
            
            <!-- 切换语言 -->
            <div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="fa fa-language"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><p @click="changeLanguage('zh')">中文</p></el-dropdown-item>
                        <el-dropdown-item divided><p @click="changeLanguage('en')">英文</p></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <el-tooltip class="item" effect="dark" content="更换皮肤" placement="bottom">
                <el-color-picker v-model="default_color"></el-color-picker>
            </el-tooltip>

            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user_default" src="@/assets/images/user-default.gif" />
                </span>
                <el-dropdown-menu slot="dropdown" size="small">
                    <el-dropdown-item><p @click="toHome">首页</p></el-dropdown-item>
                    <el-dropdown-item>项目地址</el-dropdown-item>
                    <el-dropdown-item divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        name : 'myHeader',
        data(){
            return {
                default_color: '#409EFF',
                is_fullScreen : false
            }
        },
        computed : {
            show_aside(){
                return this.$store.state.isCollapse;
            }
        },
        methods : {
            // 显示隐藏侧边栏
            isCollapse(){
                this.$store.dispatch('isCollapse');
            },
            // 全屏
            fullScreen(){
                this.is_fullScreen = true;
                let el = document.documentElement;
                let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if(typeof rfs && rfs) {
                    rfs.call(el);
                }else if(typeof window.ActiveXObject != 'undefined'){
                    // ie  
                    var wscript = new ActiveXObject("WScript.Shell");
                    if(wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            // 退出全屏
            exit_fullScreen(){
                this.is_fullScreen = false;
                let exitMethod = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitExitFullscreen;
                if(exitMethod){
                    exitMethod.call(document);
                }else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            //去到首页
            toHome(){
                this.$router.push({
                    name : '我的首页'
                })
            },
            // 切换语言
            changeLanguage (language) {
                this.$i18n.i18next.changeLanguage(language)
                localStorage.lan = language
            }
        }
    }
</script>

<style lang="scss" scoped>
    #myHeader{
        height:60px;
        box-sizing: border-box;
        border-bottom: 1px solid #dedede;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 15px;
        justify-content: space-between;
        .header-left{
           .fa-navicon {
               font-size: 16px;
               color : #333;
               cursor: pointer;
               transition: .5s;
           }
        }
        .header-right{
            display: flex;
            align-items: center;
            .fa{
                font-size: 18px; 
                color : #666;
                margin-right: 20px;
                cursor: pointer;
            }
            .user_default{
                width: 40px;
                height: 40px;
                border-radius: 5px;
                margin-left: 20px;
                margin-right: 5px;
                cursor: pointer;
            }
            
        }
    }
</style>
