import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Electron from 'vue-electron'

Vue.use(ElementUI)
Vue.use(Electron)

Vue.config.debug = false

/* eslint-disable no-new */
new Vue({
  ...App
}).$mount('#app')
