const cat_products = Vue.component('cat-products', {
    template : `<div class="container">
                    <div v-if="this.token">
                        <div v-if="loading" class="row justify-content-center mt-5" >
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div v-else>
                            <h3 class="mt-3">All products of {{section}}</h3>
                            <div v-if="cat_products.length!=0">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Available Quantity</th>
                                            <th scope="col">unit</th>
                                            <th scope="col">price/unit</th>
                                            <th scope="col" style="text-align: center">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(prod, index) in cat_products">
                                            <th scope="row">{{index+1}}</th>
                                            <td>{{prod.p_name}}</td>
                                            <td>{{prod.quantity}}</td> 
                                            <td>{{prod.unit}}</td> 
                                            <td>{{prod.price}}</td> 
                                            <td style="text-align: right">
                                                <router-link class="btn btn-warning" :to="{ name: 'update', params: {}}"><i class="bi bi-pencil"></i></router-link>
                                                <button class="btn btn-danger m-2" @click="deleteCat()"><i class="bi bi-trash"></i></button>
                                                <router-link class="btn btn-info" :to="{ name: 'cat-products', params: { }}">Details</router-link>
                                            </td>
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="row justify-content-center mt-5">
                                No products found!
                            </div>
                            <router-link class="btn btn-info m-3" style="float: right;" to="/section">Create Product</router-link>
                        </div>
                    </div>
                    <div v-else class="container m-3">
                        <h3>{{message}}</h3>
                    </div>  
                </div>`,
    data (){
        return {
            token:"",
            section: "",
            cat_products: [],
            message: "",
            loading: true        
            }
        },
    beforeMount(){
        this.token = localStorage.getItem('auth_token')
        console.log("token loaded")
    },
    mounted(){
        this.getCatProd()
    },
    methods:{
        async getCatProd(){
            this.loading = true
            let response = await fetch(`/api/products/${this.$route.params.id}`, {
                                        headers:{
                                                 "Content-Type": "application/json",
                                                 "Authentication-Token": localStorage.getItem("auth_token")
                                                },
                                        method: 'GET'     
                                    })
            if (response.ok){
                let output = await response.json()
                console.log("products fetched!")
                console.log(output)
                this.section = output.section
                this.cat_products = output.products
                this.loading = false
            }
            else{
                let error = await response.json()
                console.log("error fecthing")
                this.message = error.response.errors[0]
                this.loading = false
            }
        }
    }
            })

export default cat_products