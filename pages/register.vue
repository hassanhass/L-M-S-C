<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="name" type="text" placeholder="Name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="employee_number" type="number" placeholder="Employee Number" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <Button type="submit">Register</Button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const employee_number = ref('');
  const error = ref('');
  
  async function register() {
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name: name.value, email: email.value, password: password.value , employee_number:employee_number.value },
      });
      navigateTo('/login');
      alert(response.message);
    } catch (err) {
      error.value = err.data.message;
    }
  }
  </script>
  