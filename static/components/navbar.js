const navbar = Vue.component('nav-bar', {
                template : `<nav class="navbar navbar-expand-lg navbar-light bg-light">
                                <div class="container-fluid">
                                    <a class="navbar-brand" href="/#/dashboard">All Mart</a>
                                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                        <span class="navbar-toggler-icon"></span>
                                    </button>
                                    <div class="collapse navbar-collapse" id="navbarNav">
                                        <ul class="navbar-nav">
                                            <li class="nav-item">
                                                <router-link class="nav-link active" aria-current="page" to="/login">Login</router-link>
                                            </li>
                                            <li class="nav-item">
                                                <router-link class="nav-link active" aria-current="page" to="/register">Register</router-link>
                                            </li>
                                            <li v-if="this.token" class="nav-item p-1">
                                                <button class="btn btn-danger" @click="logout"><i class="bi bi-box-arrow-right"></i> Logout</button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>`,
                data: function(){
                    return {
                        token:localStorage.getItem('auth_token')
                    }
                },
                methods: {
                    logout() {
                        localStorage.removeItem('auth_token')
                        this.$router.push('/')
                    }
                }
            })

export default navbar