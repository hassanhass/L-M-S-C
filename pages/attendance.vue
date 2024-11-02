<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-r from-blue-800 to-teal-700 p-6">

    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center mx-auto mt-4">
      <h1 class="text-2xl font-bold mb-4">تسجيل الحضور</h1>
      <p class="mb-6"> ,مرحبًا {{ employeeName }}</p>
      
      <button
        @click="handleAttendance"
        :class="buttonClass"
        class="rounded-full w-40 h-40 flex items-center justify-center transition-transform duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden mx-auto"
      >
        <span class="absolute inset-0 bg-opacity-30 transition duration-300" :class="overlayClass"></span>
        <span class="relative z-10">{{ buttonText }}</span>
      </button>

      <button
        @click="logout"
        class="mt-4 text-white bg-gray-600 rounded p-2"
      >
        تسجيل الخروج
      </button>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth'
});

const {
  employeeName,
   buttonText,
   buttonClass,
   overlayClass,
   handleAttendance,
   logout}=useAttendance()
   
</script>