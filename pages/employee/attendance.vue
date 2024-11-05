<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-xl sm:text-2xl font-bold text-indigo-800">TimeMatrix</h1>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ employeeName }}</p>
              <p class="text-xs text-gray-500">{{ currentDate }}</p>
            </div>
            <button
              @click="logout"
              class="p-2 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              <span class="material-icons text-base sm:text-lg">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto w-full">
      <!-- Clock Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="text-center">
          <div class="text-3xl sm:text-5xl font-bold text-indigo-800 mb-2">{{ currentTime }}</div>
          <div class="text-base sm:text-lg text-gray-600">{{ currentDay }}</div>
        </div>
      </div>

      <!-- Attendance Section -->
      <div class="flex flex-col items-center mb-8">
        <button
          @click="handleAttendance"
          :class="[
            'w-32 h-32 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg transition-all duration-300',
            isCheckedIn 
              ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
              : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
          ]"
        >
          {{ isCheckedIn ? 'Check Out' : 'Check In' }}
        </button>
        <p class="mt-4 text-base sm:text-lg font-medium text-center" :class="isCheckedIn ? 'text-red-600' : 'text-green-600'">
          {{ isCheckedIn ? 'You are currently checked in' : 'Ready to start your workday' }}
        </p>
      </div>

      <!-- Actions Section -->
      <div class="space-y-4">
        <button
          @click="viewAttendanceRecords"
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <span class="material-icons mr-2">
             View Attendance Records
          </span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

const employeeName = useStorage('employeeName', '')
const token = useStorage('token', null)
const isCheckedIn = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const currentDay = ref('')

function updateDateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  currentDate.value = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  currentDay.value = now.toLocaleDateString('en-US', { weekday: 'long' })
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})

async function handleAttendance() {
  try {
    const response = await $fetch('/api/attendance/check-in', {
      method: 'POST',
      headers: { 'token': token.value }
    })
    isCheckedIn.value = !isCheckedIn.value
    console.log('Attendance response:', response)
  } catch (error) {
    console.error('Error handling attendance:', error)
    // You might want to show an error message to the user here
  }
}

function viewAttendanceRecords() {
  navigateTo('/employee/dashboard')
}

function logout() {
  token.value = null
  employeeName.value = ''
  navigateTo('/')
}
</script>

<style scoped>
@media (max-width: 640px) {
  .material-icons {
    font-size: 1.25rem;
  }
}
</style>