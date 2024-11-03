<!-- pages/employee/attendance.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#3A5588] to-[#4D77B3]">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">مرحبًا، {{ employeeName }}</h1>
      
      <div class="flex flex-col items-center mb-8">
        <button @click="handleAttendance" 
                :class="[buttonClass, 'w-40 h-40 rounded-full text-white font-bold text-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50', 
                         isCheckedIn ? 'focus:ring-red-300' : 'focus:ring-green-300']">
          {{ buttonText }}
        </button>
      </div>

      <div class="space-y-4">
        <NuxtLink 
          to="/employee/dashboard"
          class="block bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-300 w-full text-center"
        >
          عرض سجلات الحضور
        </NuxtLink>

        <button @click="logout" 
                class="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 w-full">
          تسجيل الخروج
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAttendance } from '~/composables/useAttendance'

definePageMeta({
  middleware: 'auth'
})

const { 
  isCheckedIn, 
  employeeName, 
  buttonText, 
  buttonClass, 
  handleAttendance, 
  logout 
} = useAttendance()
</script>