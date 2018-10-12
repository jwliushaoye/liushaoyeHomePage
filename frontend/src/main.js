// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import {api} from '@/assets/javascript/api.js'
Vue.prototype.$http = api


Vue.prototype.apiRoot = '/api'

import '../theme/index.css'
import ElementUI from 'element-ui'
import language_ele_en from 'element-ui/lib/locale/lang/en';
import language_ele_zh from 'element-ui/lib/locale/lang/zh-CN';
const language = localStorage.language;
if (language == 'en') {
  Vue.use(ElementUI, { locale : language_ele_en })
} else {
  Vue.use(ElementUI, { locale : language_ele_zh })
}
Vue.use(ElementUI)

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

//引入animate动画
import 'animate.css'

//Vuex
import store from './store'

// i18next  国际化
import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'
import {localLanguage} from './assets/javascript/locales'
Vue.use(VueI18Next)
i18next.init({
  lng: 'zh',
  resources: {
    zh: {
      translation: localLanguage.zh
    },
    en: {
      translation: localLanguage.en
    }
  }
})
const i18n = new VueI18Next(i18next)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
