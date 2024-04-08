const login_page = Vue.component('login-page', {
                template : `
                        <div class="container min-vh-100 d-flex justify-content-center align-items-center">
                            <div class="p-3 border">
                                <form @submit.prevent="login_user">
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email address</label>
                                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="formData.email">
                                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="password" v-model="formData.password">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Login</button>
                                </form>
                            </div>
                        </div>`,
                data: function(){
                    return {
                        formData:{
                            email: "",
                            password: ""
                        }
                    }
                },
                methods:{
                    async login_user(){
                        let response = await fetch("/user-login", {
                            headers:{"Content-Type": "application/json"},
                            method : "POST",
                            body : JSON.stringify(this.formData)});
                        let output = await response.json()
                        if (response.ok){    
                            localStorage.setItem("auth_token", output.auth_token)
                            this.$router.push({path: '/dashboard', query: {'role': output.role}})
                        }
                        else{
                            console.log(output)
                        }
                    }
                }
            })

export default login_page