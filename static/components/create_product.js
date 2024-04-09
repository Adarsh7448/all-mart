const create_product = Vue.component("create-product", {
    template: `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <h3 class="mt-3">Add a new product for {{section}}</h3>
                        <form @submit.prevent="create_prod">
                            <div class="mb-3">
                                <label for="p_name" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="p_name" aria-describedby="cathelp" v-model="formData.p_name">
                                <div id="catHelp" class="form-text">Name should be unique</div>
                            </div>
                            <div class="mb-3">
                                <label for="quantity" class="form-label">Quantity to be added</label>
                                <input type="text" class="form-control" id="quantity" aria-describedby="cathelp" v-model="formData.quantity">
                                <div id="catHelp" class="form-text">Initial quantity of the product being added</div>
                            </div>
                            <div class="mb-3">
                                <label for="unit" class="form-label">Unit</label>
                                <select class="form-select" id="unit" aria-describedby="cathelp" v-model="formData.unit">
                                    <option>unit</option>
                                    <option>dozen</option>
                                    <option>gram</option>
                                    <option>Kilogram</option>
                                    <option>millilitre</option>
                                    <option>litre</option>
                                </select>
                                <div id="catHelp" class="form-text">unit of measurement</div>
                            </div>
                            <div class="mb-3">
                                <label for="price" class="form-label">Unit Price</label>
                                <input type="number" class="form-control" id="price" aria-describedby="cathelp" v-model="formData.price">
                                <div id="catHelp" class="form-text">price per unit of product</div>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-warning" style="float: right;">
                                    <span v-if="loading">
                                        <span class="spinner-border spinner-border-sm justify-content-center" role="status"></span>
                                    </span>
                                    <span v-else>
                                        Add
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>        
            </div>`,
    data(){
        return{
            formData:{
                p_name: "",
                quantity: 10,
                unit:"",
                price:""
            },
            loading:false,
            section:""
        }
    },
    async mounted(){
        let response = await fetch(`/get_category/${this.$route.params.cat_id}`,{
                                    headers:{"Content-Type": "application/json"},
                                    method : "GET"})
        if(response.ok){
            let output = await response.json()
            this.section = output.c_name
        }
        else{
            this.section = Anonymous
        }
    }
    ,
    methods:{
        async create_prod(){
            this.loading = true
            let response = await fetch(`/api/create_product/${this.$route.params.cat_id}`, {
                headers:{"Content-Type": "application/json",
                         "Authentication-Token": localStorage.getItem("auth_token")},
                method : "POST",
                body : JSON.stringify(this.formData)});
            let output = await response.json()
            if (response.ok){    
                console.log("Product Added", output)
                this.loading = false
                this.$router.push({name:'cat-products', params:{"id":this.$route.params.cat_id}}) 
            }
            else{
                console.log(output)
            }
        }
    }
})

export default create_product
