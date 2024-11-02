<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#3A5588] to-[#4D77B3]">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
     
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
          <div class="relative">
            <input v-model="email" type="email" id="email" placeholder="أدخل البريد الإلكتروني" required
              class="w-full px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring focus:ring-blue-400" />
            <div class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r bg-[#3A5588] text-white">
              <i class="fas fa-envelope"></i>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-2">كلمة المرور</label>
          <div class="relative">
            <input v-model="password" type="password" id="password" placeholder="أدخل كلمة المرور" required
              class="w-full px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring focus:ring-blue-400" />
            <div class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r bg-[#3A5588] text-white">
              <i class="fas fa-lock"></i>
            </div>
          </div>
        </div>
        <button type="submit"
          class="w-full bg-[#4D77B3] text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:ring-blue-400">
          تسجيل
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
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
    console.log(response);
    if (response && response.message) {
      token.value = response.token;
      employeeId.value = response.user.id;
      employeeName.value = response.user.name;
      role.value = response.user.role;

      if (role.value === 'admin') {
        return navigateTo('/dashboard');
      } else {
        return navigateTo('/attendance');
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