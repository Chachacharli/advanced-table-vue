// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import VueFeather from 'vue-feather'

const instance = createApp(App)
instance.component('vue-feather', VueFeather)

instance.mount('#app')
