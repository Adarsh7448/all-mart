const create_section = Vue.component("create-section", {
    template: `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <h3 class="mt-3">Create a new categories</h3>
                        <form @submit.prevent="create_cat">
                            <div class="mb-3">
                                <label for="c_name" class="form-label">Category Name</label>
                                <input type="text" class="form-control" id="c_name" aria-describedby="cathelp" v-model="formData.c_name">
                                <div id="catHelp" class="form-text">Name should be unique</div>
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Describe your section</label>
                                <textarea class="form-control" id="description" v-model="formData.c_description"></textarea>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-warning" style="float: right;">Create</button>
                            </div>
                        </form>
                    </div>
                </div>        
            </div>`,
    data(){
        return{
            formData:{
                c_name: "",
                c_description: ""
            }
        }
    },
    methods:{
        async create_cat(){
            let response = await fetch("/api/create_category", {
                headers:{"Content-Type": "application/json",
                         "Authentication-Token": localStorage.getItem("auth_token")},
                method : "POST",
                body : JSON.stringify(this.formData)});
            let output = await response.json()
            if (response.ok){    
                console.log("category Added")
                this.$router.push({path:'/dashboard', query:{"role":"admin"}})
            }
            else{
                console.log(output)
            }
        }
    }
})

export default create_section
