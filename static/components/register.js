const register_page = Vue.component('register-page', {
        template : `
                <div class="container min-vh-100 d-flex justify-content-center align-items-center">
                    <div class="p-3 border">
                        <form @submit.prevent="register_user">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" aria-describedby="emailHelp" v-model="formData.username">
                            <div id="emailHelp" class="form-text">choose a username that you can remember.</div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="formData.email">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="formData.password">
                            </div>
                            <button type="submit" class="btn btn-primary">Register</button>
                        </form>
                    </div>
                </div>`,
        data: function(){
            return {
                formData:{
                    username: "",
                    email: "",
                    password: ""
                }
            }
        },
        methods:{
            async register_user(){
                let response = await fetch("/user-register", {
                    headers:{"Content-Type": "application/json"},
                    method : "POST",
                    body : JSON.stringify(this.formData)});
                let output = await response.json()
                if (response.ok){ 
                    console.log(output.message)   
                    this.$router.push('/login')
                }
                else{
                    console.log(output.message)
                }
            }
        }
    })

export default register_page