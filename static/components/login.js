const login_page = Vue.component('login-page', {
                template : `<div class="container min-vh-100 d-flex justify-content-center align-items-center">
                    <div class="p-3 border">
                        <form>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="formData.email">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="formData.password">
                            </div>
                            <button type="submit" v-on:click="login_user" class="btn btn-primary">Submit</button>
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
                        let output = await response.text()
                        console.log("clicked")
                        console.log(output)
                        // console.log(this.password)
                    }
                }
            })

export default login_page