import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.min.css'

import {projectAuth} from './firebase/config'
import {onAuthStateChanged} from '@firebase/auth'
let app

onAuthStateChanged(projectAuth, async user => {
    store.commit('setAuthIsReady', true)
    store.commit('setUser', user)
    if(user)
        await store.dispatch('fetchUserDoc', user.uid)
    if(!app){
        app = createApp(App)
        .use(store)
        .use(router)
        .mount('#app')
    }
})