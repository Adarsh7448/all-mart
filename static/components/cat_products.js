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
                                            <td v-if="role=='admin'" style="text-align: right">
                                                <router-link class="btn btn-warning" :to="{ name: 'update-product', params: {id: prod.id}}"><i class="bi bi-pencil"></i></router-link>
                                                <button class="btn btn-danger m-2" @click="deleteProd(prod.id)"><i class="bi bi-trash"></i></button>
                                            </td>
                                            <td v-else class="d-flex justify-content-center">
                                                <div class="input-group mb-3" style="width:140px">
                                                    <input type="number" class="form-control" v-model="quant">
                                                    <button class="btn btn-warning" type="button" @click="addToCart(prod.id)"><i class="bi bi-cart"></i></button>
                                                </div>
                                            </td
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="row justify-content-center mt-5">
                                No products found!
                            </div>
                            <router-link v-if="role=='admin'" class="btn btn-info m-3" style="float: right;" :to="{ name: 'create-product', params: { cat_id: section_id }}">Create Product</router-link>
                        </div>
                    </div>
                    <div v-else class="container m-3">
                        <h3>{{message}}</h3>
                    </div>  
                </div>`,
    data (){
        return {
            token:"",
            role:"",
            section:"",
            section_id: null,
            user_id: null,
            cat_products: [],
            message: "",
            loading: true,
            quant: 0        
            }
        },
    beforeMount(){
        this.token = localStorage.getItem('auth_token')
        this.role = localStorage.getItem('role')
        this.user_id = localStorage.getItem('id')
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
                this.section_id = output.cat_id
                this.section = output.section
                this.cat_products = output.products
                this.loading = false
            }
            else{
                let error = await response.json()
                console.log("error fetching")
                this.message = error.response.errors[0]
                this.loading = false
            }
        },
        async deleteProd(prod_id){
            let response = await fetch(`/api/delete_product/${prod_id}`,{
                                        headers:{"Content-Type": "application/json",
                                                 "Authentication-Token": localStorage.getItem("auth_token")},
                                        method:'DELETE'
                                    })
            if (response.ok){
                let output = await response.json()
                console.log(output);
                this.getCatProd();
            }
            else{
                let error = await response.json()
                console.log(error.message)
                this.message = error.message;
            }
        },
        async addToCart(prod_id){
            let response = await fetch(`/user/${this.user_id}/cart`, {
                                        headers:{
                                                 "Content-Type": "application/json",
                                                 "Authentication-Token": this.token
                                                },
                                        method: 'POST',
                                        body: JSON.stringify({"prod_id": prod_id, "quant": this.quant})                      
                                    })
            if(response.ok){
                let output = await response.json()
                console.log(output.message)
            }
            else{
                let error = await response.json()
                console.log(error)
            }                        
        }
    }
})

export default cat_products