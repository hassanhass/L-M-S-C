<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TimeMatrix
          </h1>
          
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 space-y-6 overflow-y-auto">
      <!-- Employee Info -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex items-center space-x-4">
         
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ employeeName }}</h2>
            <p class="text-gray-600">Employee</p>
          </div>
        </div>
      </div>

      <!-- Total Hours -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Total Hours This Month</h2>
        <p class="text-3xl font-bold text-indigo-600">{{ totalHours.toFixed(2) }} hours</p>
      </div>

      <!-- Attendance Records -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Attendance Records</h2>
        <div class="space-y-4">
          <div v-for="record in attendanceRecords" :key="record.id" class="border-b border-gray-200 pb-2">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">{{ formatDate(record.check_in_time) }}</p>
                <p class="font-medium">
                  {{ formatTime(record.check_in_time) }} - 
                  {{ record.check_out_time ? formatTime(record.check_out_time) : 'Ongoing' }}
                </p>
              </div>
              <span class="text-indigo-600 font-medium">
                {{ calculateDuration(record.check_in_time, record.check_out_time) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Back to Home Button -->
    <div class="fixed bottom-6 right-6">
      <NuxtLink 
        to="/employee/attendance"
        class="bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

definePageMeta({
  middleware: ['auth']
})

const employeeId = useStorage('employeeId', null)
const employeeName = useStorage('employeeName', null)
const token = useStorage('token', null)
const attendanceRecords = ref([])
const totalHours = ref(0)

onMounted(async () => {
  if (!token.value || !employeeId.value) {
    return navigateTo('/login')
  }
  
  try {
    // Fetch attendance records
    const response = await $fetch(`/api/attendance/${employeeId.value}`, {
      headers: { 'token': token.value }
    })
    attendanceRecords.value = response

    // Fetch total hours
    const totalHoursResponse = await $fetch(`/api/attendance/${employeeId.value}/total-hours`, {
      method: 'POST',
      body: { employee_id: employeeId.value },
      headers: { 'token': token.value }
    })
    totalHours.value = totalHoursResponse.totalHours
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const calculateDuration = (checkIn, checkOut) => {
  if (!checkOut) return 'Ongoing'
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end - start
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}


</script>

<style scoped>
/* Add any additional styles here if needed */
</style>