import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ptbr from 'element-plus/dist/locale/pt-br.mjs';
import ElementPlus from 'element-plus';

const app = createApp(App);

app.use(ElementPlus, { locale: ptbr });

app.mount('#app')
