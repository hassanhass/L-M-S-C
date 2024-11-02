<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
    <div class="max-w-md w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white border-opacity-30">
      <div class="text-center space-y-6 mb-10">
        <h1 class="text-4xl font-extrabold text-white">
          نظام إدارة الحضور
        </h1>
        <p class="text-xl text-white text-opacity-80">
          سجل دخولك للبدء في رحلتك معنا
        </p>
      </div>
      <div class="space-y-6">
        <nuxt-link 
          to="/login" 
          class="w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full transition duration-300 ease-in-out transform hover:scale-105 font-semibold text-lg shadow-lg flex items-center justify-center"
        >
          <span>تسجيل الدخول</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<script setup>
</script>