<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-teal-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل الدخول</h1>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="البريد الإلكتروني"
          required
          class="border border-gray-300 p-2 mb-4 rounded w-full"
        />
        <input
          v-model="password"
          type="password"
          placeholder="كلمة المرور"
          required
          class="border border-gray-300 p-2 mb-4 rounded w-full"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          تسجيل الدخول
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
      if (role.value === 'admin') {
        navigateTo('/dashboard');
      } else {
        navigateTo('/attendance'); 
      }
    } else {
      error.value = 'Unexpected response structure';
    }
  } catch (err) {
    error.value = err.data?.message || 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.';
    console.error(err);
  }
}
</script>

