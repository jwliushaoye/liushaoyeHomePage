<template>
    <div id="myLogin" >
        <vue-particles
            style="width:100%;height:100%"
            color="#fff"
            :particleOpacity="0.7"
            :particlesNumber="50"
            shapeType="circle"
            :particleSize="4"
            linesColor="#fff"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
        >
        </vue-particles>
        <div class="content">
            <!-- 登录 -->
            <div class="user-login" v-if="show_login">
                <p><img src="@/assets/images/logo.png"/>welcome</p>
                <div>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="text" v-model="ipt_username" placeholder="用户名" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="password" v-model="ipt_passward" placeholder="密码" />
                    </el-tooltip>
                    <p>
                        <el-button type="primary" @click="loginBack">登录</el-button>
                        <span @click="change('reg')">立即注册</span>
                    </p>
                </div>
            </div>

            <!-- 注册 -->
            <div class="user-login" v-if="show_reg">
                <p><img src="@/assets/images/logo.png"/>welcome</p>
                <div>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="text" v-model="re_email" placeholder="email" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="text" v-model="re_username" placeholder="用户名" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="password" v-model="re_passward" placeholder="密码" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="8-16位由数字、字母、特殊符号组成" placement="right">
                        <input type="password" v-model="re_surePed" placeholder="确认密码" />
                    </el-tooltip>
                    
                    <p>
                        <el-button type="primary" @click="registerBack">注册</el-button>
                        <span @click="change('login')">去登录</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name : 'login' ,
        data () {
            return {
                ipt_username : '',
                ipt_passward : '',

                re_email : '',
                re_username : '',
                re_passward : '',
                re_surePed : '',

                show_login : true ,
                show_reg : false
            }
        },
        methods : {
            // 登录
            async loginBack () { 
                if(this.ipt_username == '' || this.ipt_passward == '') return this.$message.warning('用户名密码不得为空!');
                let rsp = await this.$http(
                    this.apiRoot + '/login' , 
                    {
                        username : this.ipt_username,
                        passward : this.ipt_passward
                    },
                    'post'
                );
                if(rsp.ret == 0){
                    this.$message.success(rsp.data);
                    this.$router.push({
                        name : '我的首页'
                    })
                }else {
                    this.$message.error(rsp.error_msg);
                }
            },
            // 注册  register
            async registerBack(){
                if(this.re_email == '' || this.re_username == '' || this.re_passward == '' || this.re_surePed != this.re_passward) return this.$message.warning('表单信息填写错误!')
                let rsp = await this.$http(
                    this.apiRoot + '/register',
                    {
                        email : this.re_email,
                        username : this.re_username,
                        passward : this.re_passward
                    },
                    'post'
                );
                if(rsp.ret == 0){
                    this.$message.success(rsp.data);
                    this.re_email = '';
                    this.re_username = '';
                    this.re_passward = '';
                    this.re_surePed = '';
                    this.show_login = true;
                    this.show_reg = false;
                }else {
                    this.$message.error(rsp.error_msg);
                }
            },
            change(type){
                if(type == 'login'){
                    this.show_login = true;
                    this.show_reg = false;
                }else {
                    this.show_login = false;
                    this.show_reg = true;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
 #myLogin{
     width: 100%;
     height: calc(100% + 60px);
     display: flex;
     align-items: center;
     justify-content: center;
     background:url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534328171433&di=19f28f21828a667a55a2d74219fc5dc1&imgtype=0&src=http%3A%2F%2Ff9.topitme.com%2F9%2F5a%2Fde%2F1129816182ccdde5a9o.jpg') center no-repeat;
     .content{
         width: 500px;
         position: fixed;
         background: hsla(214, 95%, 30%, 0.329);
         border: 1px solid #0a4c8f;
         border-radius: 3px;
         .user-login{
             display: flex;
             box-sizing: border-box;
             flex-direction: column;
             >p{
                 margin-bottom: 20px;
                 font-size: 16px;
                 padding: 15px 25px;
                 font-family: 'Source Sans Pro', sans-serif;
                 color : #fff;
                 border-bottom: 1px solid #0a4c8f;
                 background: rgba(0 , 0 , 0 , .6);
                 display: flex;
                 align-items: center;
                 >img{
                     height: 30px;
                     margin-right: 10px;
                 }
             }
             >div{
                 padding: 0 25px 25px;
                 >input{
                     width: 100%;
                     margin-bottom: 15px;
                     height: 40px;
                     background: rgba(100,100,100,0);
                     outline: none;
                     border: none;
                     box-sizing: border-box;
                     padding: 0 10px;
                     font-size: 16px;
                     color : #fff;
                     border-bottom: 1px solid #ddd;
                 }
                 >input::-webkit-input-placeholder{
                     color:#fff;
                     caret-color: #fff;
                 }
                 p{
                     color : #fff;
                     .el-button{
                        background: #0a4c8f;
                        margin-right: 10px;
                    }
                    >span{
                        cursor: pointer;
                    }
                 }
             }
         }
     }
 }
</style>
