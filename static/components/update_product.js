const update_product = Vue.component("update-product", {
    template: `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <h3 class="mt-3">Update {{formData.p_name}}</h3>
                        <form @submit.prevent="update_prod">
                            <div class="mb-3">
                                <label for="p_name" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="p_name" aria-describedby="cathelp" v-model="formData.p_name" disabled>
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
                                        Save
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
                price:"",
                section:""
            },
            loading:false,
        }
    },
    async mounted(){
        let response = await fetch(`/get_product/${this.$route.params.id}`,{
                                    headers:{"Content-Type": "application/json"},
                                    method : "GET"})
        if(response.ok){
            let output = await response.json()
            this.formData = output
        }
        else{
            console.log("old info fetched")
        }
    }
    ,
    methods:{
        async update_prod(){
            this.loading = true
            let response = await fetch(`/api/update_product/${this.$route.params.id}`, {
                headers:{"Content-Type": "application/json",
                         "Authentication-Token": localStorage.getItem("auth_token")},
                method : "PUT",
                body : JSON.stringify(this.formData)});
            let output = await response.json()
            if (response.ok){    
                console.log("Product Added", output)
                this.loading = false
                this.$router.push({name:'cat-products', params:{"id":this.formData.section}}) 
            }
            else{
                console.log(output)
            }
        }
    }
})

export default update_product
