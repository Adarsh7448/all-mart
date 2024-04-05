import home_page from "./components/home.js"; 
import login_page from "./components/login.js";

const routes = [
    {path: '/', component: home_page},
    {path: '/login', component: login_page}
]

const router = new VueRouter({
    routes,
})

export default router