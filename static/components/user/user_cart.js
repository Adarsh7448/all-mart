const user_cart = Vue.component('user-cart', {
    template : `<div class="container">
                    <div v-if="this.token">
                        <div v-if="loading" class="row justify-content-center mt-5" >
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div v-else>
                            <h3 class="mt-3">Your cart</h3>
                            <div v-if="userCart.length!=0">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Quantity Available</th>
                                            <th scope="col">Quantity Requested</th>
                                            <th scope="col">price/unit</th>
                                            <th scope="col">Item amount</th>
                                            <th scope="col" style="text-align: center">Handle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(prod, index) in userCart">
                                            <th scope="row">{{index+1}}</th>
                                            <td>{{prod.prod_name}}</td>
                                            <td>{{prod.ava_quant}}</td> 
                                            <td>{{prod.req_quant}}</td> 
                                            <td>{{prod.unit_price}}</td> 
                                            <td>{{total_price(prod.req_quant, prod.unit_price)}}</td> 
                                            <td class="d-flex justify-content-center">
                                                <button class="btn btn-danger m-2" @click="deleteProd(prod.cart_id)"><i class="bi bi-trash"></i></button>
                                            </td
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="row justify-content-center mt-5">
                                Your cart is empty!
                            </div>
                        </div>
                    </div>
                    <div v-else class="container m-3">
                        <h3>{{message}}</h3>
                    </div>  
                </div>`,
    data(){
        return{
            message: "Invalid User",
            user_id: null,
            loading: true,
            userCart: [],
            token: null
        }
    },
    beforeMount(){
        this.token = localStorage.getItem('auth_token')
        this.user_id = localStorage.getItem('id')
        console.log("token loaded")
    },
    mounted(){
        this.loadCart()
    },
    methods:{
        total_price(item, quant){
            return item*quant
        },
        async loadCart(){
            this.loading = true
            let response = await fetch(`/user/${this.user_id}/cart`, {
                                        headers: {
                                                    "Content-Type": "application/json",
                                                    "Authentication-Token": this.token    
                                                },
                                        method: 'GET'
                                    })
            if (response.ok){
                let output = await response.json();
                this.userCart = output
                console.log("cart loaded")
                this.loading = false
            }
            else{
                let error = await response.json();
                this.message = error.response.errors[0]
                this.loading = false
            }
        },
        async deleteProd(prod_id){
            let response = await fetch(`/delete/cart/${prod_id}`, {
                                        headers: {
                                                    "Content-Type": "application/json",
                                                    "Authentication-Token": this.token    
                                                },
                                        method: 'GET'
                                    })
            if (response.ok){
                let output = await response.json();
                console.log(output.message)
                this.loadCart();
            }
            else{
                let error = await response.json();
                console.log(error.message)
            }                            
        }
    }
})

export default user_cart