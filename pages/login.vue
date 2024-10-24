<template>
  <div >
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <Button type="submit">Login</Button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>

import { useStorage } from '@vueuse/core';
const email = ref('');
const password = ref('');
const error = ref('');
const role = useStorage('role', null);
const token = useStorage('token', null);
const employeeId = useStorage('employeeId', null);
const employeeName = useStorage('employeeName', null);

async function login() {
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });

    if (response && response.message) {
      alert(response.message);
      token.value = response.token; 
      employeeId.value = response.employee.id; 
      employeeName.value = response.employee.name; 
      role.value = response.employee.role;
      if(role.value === 'admin'){
        navigateTo('/dashboard')
      }else{
      navigateTo('/attendance'); 
    }} else {
      error.value = 'Unexpected response structure';
    }
  } catch (err) {
   
    error.value = err.data?.message || 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.';
    console.error(err);
  }
}
</script>
