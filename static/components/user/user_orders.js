const user_orders = Vue.component('user-orders',{
    template: `
        <div class="container">
            <div v-if="token">
                <div v-if="loading" class="row justify-content-center mt-5" >
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else class="row d-flex justify-content-center">
                    <div class="col-10">
                        <h3 class="m-3">My Orders</h3>
                        <div class="accordion m-2">
                        <div v-for="order in user_orders" class="accordion-item">
                            <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Order ID - {{order.order_id}}
                            </button>
                            
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th style="text-align:center;" scope="col">Product</th>
                                            <th style="text-align:center;" scope="col">Quantity</th>
                                            <th style="text-align:center;" scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in order.items">
                                            <th scope="row">{{index+1}}</th>
                                            <td style="text-align:center;">{{item.product_name}}</td>
                                            <td style="text-align:center;">{{item.quantity}}</td>
                                            <td style="text-align:center;">{{item.price}}</td>
                                        </tr>
                                        <tr class="table-secondary">
                                            <td>Delivered</td>
                                            <td></td>
                                            <td></td>
                                            <td><h5 style="text-align:right;">Order amount: {{order.amount}}</h5></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="d-flex justify-content-end">  
                                    <button type="submit" class="btn btn-danger">Re-order</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else style="text-align:center;">
                {{message}}
            </div>
        </div>
`,
    data(){
        return {
            token:"",
            user_orders:[],
            message:"You should log in first!",
            user_id: null,
            loading: true
        }
    },
    beforeMount(){
        this.token = localStorage.getItem('auth_token')
        this.user_id = localStorage.getItem('id')
        console.log("token loaded")
    },
    mounted(){
        this.loadOrders()
    },
    methods:{
        async loadOrders(){
            this.loading = true
            let response = await fetch(`/orders/${this.user_id}`, {
                                        headers:{
                                            "Content-Type": "application/json",
                                            "Authentication-Token": this.token
                                        },
                                        method: 'GET'
                                        })
            if(response.ok){
                let output = await response.json();
                this.user_orders = output;
                this.loading = false;
            }
            else{
                let error = await response.json();
                this.message = error.message;
                this.loading = false;
            }
        }
    }
})

export default user_orders