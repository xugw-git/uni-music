
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.filter('formatTime', function (value) {

  var date = new Date(value);

  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';

});

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif