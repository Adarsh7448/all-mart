const user_order = Vue.component('user-order',{
    template: `<div class="container">
                    <div v-if="this.token">
                        <div v-if="loading" class="row justify-content-center mt-5" >
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div v-else class="row justify-content-center mt-5">
                            <h3 class="mt-3">Complete your order</h3>
                            <div v-if="currentOrder.length!=0">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col" style="text-align:center;">Quantity Requested</th>
                                            <th scope="col" style="text-align:center;">price/unit</th>
                                            <th scope="col" style="text-align:center;">Item amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(prod, index) in currentOrder">
                                            <th scope="row">{{index+1}}</th>
                                            <td>{{prod.prod_name}}</td> 
                                            <td style="text-align:center;">{{prod.req_quant}}</td> 
                                            <td style="text-align:center;">{{prod.unit_price}}</td> 
                                            <td style="text-align:center;">{{totalPrice(prod.req_quant, prod.unit_price)}}</td> 
                                        </tr> 
                                        <tr class="table-secondary">
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><h5>Total: {{grand_total}}</h5></td>
                                        </tr> 
                                    </tbody>
                                </table>
                                <div class="d-flex justify-content-end m-3">
                                    <router-link class="btn btn-warning m-1" :to="{name:'user-cart', params: {id:user_id}}">Go back</router-link>
                                    <button class="btn btn-warning m-1" @click="createOrder(user_id, grand_total)">Place Order</button>
                                </div>
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
            token: "hello",
            message: "invalid user",
            currentOrder: [],
            loading: false
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
    computed:{
        grand_total: function(){
            let total = 0;
            for(let order of this.currentOrder){
                let order_price = parseInt(this.totalPrice(order.req_quant, order.unit_price))
                total += order_price;
            }
            return total;
        }
    },
    methods:{
        totalPrice(item, quant){
            return item*quant
        },
        async createOrder(id, amount){
            let response = await fetch(`/order/${id}/create`,{ 
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authentication-Token": this.token    
                                        },
                                        method: 'POST',
                                        body: JSON.stringify(
                                            {
                                                "amount": amount,
                                                "products": this.currentOrder 
                                            }
                                        )
                                    })
            if(response.ok){
                console.log("order placed")
                this.$router.push('/dashboard')
            }
            else{
                error = await response.json();
                this.message = error.response.errors[0];  
            }
            // console.log(`/order/${id}/create`, amount )
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
                this.currentOrder = output
                console.log("cart loaded")
                this.loading = false
            }
            else{
                let error = await response.json();
                this.message = error.response.errors[0]
                this.loading = false
            }
        }
    }
    
})

export default user_order