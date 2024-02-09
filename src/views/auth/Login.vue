<template>
 <Auth>
    <form class="form-signin" @submit.prevent="handleSubmit">
    <div style="position: relative;">
        <img src="../../assets/eva.jpg" alt="Welcome Image" style="width: 100%;" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;">
        </div>
    </div>
    <h1 class="h3 mb-3 fw-normal">Welcome </h1>
    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
       v-model="v$.user.email.$model" :class="{'is-invalid':v$.user.email.$error}">
      <label for="floatingInput">Email address</label>
      <small v-if="v$.user.email.required.$invalid && v$.user.email.$error">Lütfen bir e mail adresi yazınız</small>
      <small v-if="v$.user.email.email.$invalid && v$.user.email.$error">Lütfen geçerli bir e mail adresi yazınız</small>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
      v-model="v$.user.password.$model" :class="{'is-invalid':v$.user.password.$error}">
      <label for="floatingPassword">Password</label>
      <small v-if="v$.user.password.required.$invalid && v$.user.password.$error">Lütfen bir e parola  yazınız</small>
    </div>

    <div class="checkbox mb-3">
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Login</button>
  </form>
 </Auth>
</template>

<script>

import Auth from "../layouts/Auth.vue"
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  name: 'Login',
  components:{
    Auth
  },
  setup(){
    return{
        v$ :useVuelidate()
    } 
  },
data () {
return {
    user:{
        email: '',
        password: '',
    }
}
},
validations () {
return {
    user:{
        email: { required, email} ,
        password: { required },  
    }
    
}
  },
  methods:{
   async handleSubmit() {
    this.$store.commit('setEmail', this.user.email); 
    this.$store.commit('setPassword', this.user.password); 
    await this.$store.dispatch('login');

   if (this.user.email === 'homework@eva.guru' && this.user.password === 'Homeworkeva1**') {     
    await this.$store.dispatch('getUserInformation'); 
    await  this.$store.dispatch('fetchDataFromAPI');
    this.$router.push('/') 
   }
    else {

    }
    console.log('tetiklendi handlee')

    }
  }
}

</script>


<style scoped>

</style>
