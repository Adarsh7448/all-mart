import router from './router.js'
import navbar from './components/navbar.js'

const app = new Vue({
    el: '#app',
    template: `<div>
                    <nav-bar></nav-bar>
                    <router-view></router-view>
               </div>`,
    router
})