import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import { Quasar } from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import './styles/index.css'


// 创建vue实例
const app = createApp(App);

app.use(Quasar, {
plugins: {}, // import Quasar plugins and add here
})
app.use(store);
app.use(router);

// 挂载实例
app.mount('#app');
