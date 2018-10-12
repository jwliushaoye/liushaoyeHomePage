import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/back',
  routes: [
    {path : '/' , redirect: '/login' },
    {
      path : '/home',
      name : '我的首页',
      component : resolve => require(['../pages/homePage'] , resolve)
    },
    {
      path : '/login' ,
      name : '登录' ,
      component : resolve => require(['../pages/login'] , resolve)
    },
    {
      path : '/map' ,
      name : '我的地图' ,
      component : resolve => require(['../pages/myMap'] , resolve)
    },
    {
      path : '/my-article' ,
      name : '文章列表' ,
      component : resolve => require(['../pages/articleList'] , resolve)
    },
    {
      path : '/editor',
      name : '语料对齐',
      component : resolve => require(['../pages/catEditor.vue'] , resolve)
    },
    {
      path : '/upload',
      name : '文件上传',
      component : resolve => require(['../pages/catUpload.vue'] , resolve)
    }
  ]
})
