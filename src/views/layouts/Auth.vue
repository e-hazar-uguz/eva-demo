<template>
    <!-- slot kullanım amacı içerisine ne gelecekse onun yer alması -->
 <div class="content text-center">
<slot></slot>
 </div>
</template>

<script>
export default {
  name: 'Auth'
}
</script>


<style scoped>
.content {
    width: 100%;
    height: 100vh;
    display: flex;
}
</style>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
  border-color: unset !important;
  box-shadow: unset !important;
}

.form-signin input[type="email"] {
  margin-bottom: 10px;

}

.form-signin input[type="password"] {
  margin-bottom: 10px;

}
</style>
