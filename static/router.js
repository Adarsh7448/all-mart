import home_page from "./components/home.js"; 
import login_page from "./components/login.js";
import register_page from "./components/register.js";
import dashboard from "./components/dashboard.js";
import create_section from "./components/create_section.js";
import update_section from "./components/updte_section.js";
import cat_products from "./components/cat_products.js"

const routes = [
    {path: '/', component: home_page},
    {path: '/login', component: login_page},
    {path: '/register', component: register_page},
    {path: '/dashboard', component: dashboard},
    {path: '/section', component: create_section},
    {path: '/update/:id', component: update_section, name: "update"},
    {path: '/cat_prod/:id', component: cat_products, name: "cat-products"},
]

const router = new VueRouter({
    routes,
})

export default router