// import main_content from './main_content.js'
// im

const dashboard = Vue.component('user-dash', {
    template:  `<div class="container">
                    <div v-if="token && role == 'admin'">
                        <div class="row justify-content-center mt-5" v-if="loading">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div v-else>
                            <h3 class="mt-3">Your major categories</h3>
                            <div v-if="cat_data.length!=0">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Section Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col" style="text-align: center">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cat, index) in cat_data">
                                            <th scope="row">{{index+1}}</th>
                                            <td>{{cat.category}}</td>
                                            <td>
                                                <p>{{cat.description}}</p> 
                                            </td>
                                            <td style="text-align: right">
                                                <router-link class="btn btn-warning" :to="{ name: 'update-section', params: { id: cat.id }}"><i class="bi bi-pencil"></i></router-link>
                                                <button class="btn btn-danger m-2" @click="deleteCat(cat.id)"><i class="bi bi-trash"></i></button>
                                                <router-link class="btn btn-info" :to="{ name: 'cat-products', params: { id: cat.id }}">Details</router-link>
                                            </td>
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="row justify-content-center mt-5">
                                {{message}}
                            </div>
                            <router-link class="btn btn-info m-3" style="float: right;" to="/section">Create Section</router-link>
                        </div>
                    </div>
                    <div v-else-if="token && role == 'user'">
                        <div class="row justify-content-center mt-5" v-if="loading">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div v-else>
                            <div class="d-flex justify-content-between mt-3">
                                <h3>Your major categories</h3>
                                <div>
                                    <router-link class="btn btn-warning" :to="{name:'user-cart', params: {id:id}}"><i class="bi bi-cart3"></i> My Cart</router-link>
                                    <router-link class="btn btn-info" :to="{name:'user-orders', params: {id:id}}">My Orders</router-link>
                                </div>
                            </div>
                            <div v-if="cat_data.length!=0">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Section Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col" style="text-align: center">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cat, index) in cat_data">
                                            <th scope="row">{{index+1}}</th>
                                            <td>{{cat.category}}</td>
                                            <td>{{cat.description}}</td>
                                            <td style="text-align: right">
                                            <router-link class="btn btn-info" :to="{ name: 'cat-products', params: { id: cat.id }}">View</router-link>
                                            </td>
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="row justify-content-center mt-5">
                                {{message}}
                            </div>
                        </div>
                    </div>
                    <div v-else class="container m-3">
                        <h3>{{message}}</h3>
                    </div>  
                </div>
                `,
    data(){
        return{
            token: "",
            role: "",
            id:"",
            cat_data: [],
            message: "Invalid user",
            loading: true
        }
    },
    beforeMount(){
        this.token = localStorage.getItem('auth_token')
        this.role = localStorage.getItem('role')
        this.id = localStorage.getItem('id')
        console.log("token loaded")
    },
    async mounted(){
        // this.token = localStorage.getItem('auth_token')
        console.log("now mounted")
        this.updateContent()        
    },
    methods:{
        async deleteCat(cat_id){
            let response = await fetch(`/api/delete_category/${cat_id}`,{
                                        headers:{"Content-Type": "application/json",
                                                 "Authentication-Token": localStorage.getItem("auth_token")},
                                        method:'DELETE'
                                    })
            if (response.ok){
                let output = await response.json()
                console.log(output);
                this.updateContent();
            }
            else{
                let error = await response.json()
                console.log(error.message)
                this.message = error.message;
            }
        },
        async updateContent(){
            this.loading = true
            let response = await fetch('/api/categories',{
                                        headers:{"Content-Type": "application/json",
                                                 "Authentication-Token": localStorage.getItem("auth_token")},
                                        method:'GET'
                                })
            if (response.ok){
                console.log("categories loaded after delete successfully")
                let output = await response.json()
                this.cat_data = output
                this.loading = false
            }
            else{
                let error = await response.json()
                console.log(error.response.errors[0])
                this.message = error.response.errors[0];
                this.loading = false
            }   
        }
    }
}
)

export default dashboard