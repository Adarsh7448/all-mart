import home_page from "./components/home.js"; 
import login_page from "./components/login.js";
import register_page from "./components/register.js";
import dashboard from "./components/dashboard.js";
import create_section from "./components/create_section.js";
import update_section from "./components/update_section.js";
import cat_products from "./components/cat_products.js"
import create_product from "./components/create_product.js"
import update_product from "./components/update_product.js"
import user_cart from "./components/user/user_cart.js"

const routes = [
    {path: '/', component: home_page},
    {path: '/login', component: login_page},
    {path: '/register', component: register_page},
    {path: '/dashboard', component: dashboard},
    {path: '/section', component: create_section},
    {path: '/update/category/:id', component: update_section, name: "update-section"},
    {path: '/update/product/:id', component: update_product, name: "update-product"},
    {path: '/category/:id/products', component: cat_products, name: "cat-products"},
    {path: '/product/:cat_id', component: create_product, name: "create-product"},
    {path: '/cart/:id', component: user_cart, name: "user-cart"},
]

const router = new VueRouter({
    routes,
})

export default router