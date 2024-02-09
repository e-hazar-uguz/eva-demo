<template>
<nav class="navbar navbar-expand-lg  bg-body-tertiary-darkened">
  <div class="container">
    <a class="navbar-brand" href="#">Demo Project</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
       <router-link :to="{ name : 'Home' }" tag="li" class="nav-item" active-class="active">
        <a class="nav-link" aria-current="page" href="#" >Home</a>
      </router-link>
      <router-link :to="{name:'HiddenPage1'}" tag="li" class="nav-item" active-class="active" >
        <a class="nav-link"  href="#">Hidden Page 1</a>
      </router-link>
    </ul>
    <div class="row authenticated" v-show="!authShow">
        <div class="col-6">
          <router-link :to="{ name : 'Login' }" tag="li" class="btn btn-info btn-block" >
            Login
          </router-link>
         
        </div>
    </div>
    <div class="row authenticated mx-" v-show="authShow">
      <div class="col-8">
         <!-- <div class="navbar-brand "><strong>{{ getUserInfo.firstName +" "+ getUserInfo.lastName }}</strong></div> -->
        </div>
        <div class="col-4">
          <button class="btn btn-danger btn-block" @click="logout">Logout</button>
        </div>
    </div>
    </div>
  </div>
</nav>
  </template>
  
  <script>
// computed vue.js bileşenlerinde veri işleme, hesaplama ve bağımlılıkları otomatik olarak yönetme amacıyla kullanılır
  import store from '../../store'
  export default {
    name: 'Navbar',
    computed:{
      authShow(){
        return store.getters.isAuthenticated
      },
      getUserInfo(){
        return store.getters.getUserInfo
      }
    },
    methods:{
      logout() {
      this.$store.dispatch('logout');
      window.location.reload();
    }
    }
  }
  </script>
  
 
  <style scoped>
.navbar-nav .nav-item {
    text-decoration: none;
}
.navbar-nav .nav-item.active .nav-link {
    color: blue;
}
.bg-body-tertiary-darkened {
    background-color: #e3f2fd;
}
  </style>
  