import Vue from 'vue'
import App from './App.vue'
import store from './store/'
import Toast from '@/plugins/toast/'

Vue.config.productionTip = false
Vue.use(Toast)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
