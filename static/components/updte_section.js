const update_section = Vue.component("update-section", {
    template: `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <h3 class="mt-3">Create a new categories</h3>
                        <form @submit.prevent="update_cat">
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
                                <button type="submit" class="btn btn-warning" style="float: right;">Save</button>
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
            },  
        }
    },
    async mounted(){
        let response = await fetch(`/get_category/${this.$route.params.id}`, {
                                                headers:{"Content-Type": "application/json"},
                                                method : "GET",})
        let output = await response.json()
        if(response.ok){
            this.formData = output
        }
        else{
            console.log(output.message)
        }
    },
    methods:{
        async update_cat(){
            let response = await fetch(`/api/update_category/${this.$route.params.id}`, {
                headers:{"Content-Type": "application/json",
                         "Authentication-Token": localStorage.getItem("auth_token")},
                method : "PUT",
                body : JSON.stringify(this.formData)});
            let output = await response.json()
            if (response.ok){    
                console.log("category updated")
                // this.$router.push({path:'/dashboard', query:{"role":"admin"}})
                window.location.replace('/#/dashboard?role=admin')
            }
            else{
                console.log(output)
            }
        }
    }
})

export default update_section
