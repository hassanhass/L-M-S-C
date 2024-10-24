<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-teal-700">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل</h1>
      <form @submit.prevent="register">
        <input
          v-model="name"
          type="text"
          placeholder="الاسم"
          required
          class="border border-gray-300 p-2 mb-4 rounded w-full"
        />
        <input
          v-model="email"
          type="email"
          placeholder="البريد الإلكتروني"
          required
          class="border border-gray-300 p-2 mb-4 rounded w-full"
        />
        <input
          v-model="employee_number"
          type="number"
          placeholder="رقم الموظف"
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
          تسجيل
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
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
      body: { name: name.value, email: email.value, password: password.value, employee_number: employee_number.value },
    });
    navigateTo('/login');
    alert(response.message);
  } catch (err) {
    error.value = err.data.message;
  }
}
</script>

