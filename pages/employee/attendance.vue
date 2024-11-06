<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- App Logo -->
          <div class="flex items-center">
            <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TimeMatrix
            </span>
          </div>
          
          <!-- User Info and Menu -->
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div class="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-full">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                <span class="text-white font-semibold text-sm sm:text-lg">
                  {{ employeeName.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs sm:text-sm font-semibold text-gray-700">
                  {{ employeeName }}
                </span>
                <span class="text-xs text-gray-500">Employee</span>
              </div>
            </div>

            <!-- Menu Button -->
            <div class="relative" ref="menuRef">
              <button 
                @click="toggleMenu"
                class="group relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div class="flex flex-col space-y-1.5 w-5">
                  <span class="w-full h-0.5 bg-white rounded-full transform transition-all duration-300"
                    :class="{ 'rotate-45 translate-y-2': isMenuOpen }"></span>
                  <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300"
                    :class="{ 'opacity-0': isMenuOpen }"></span>
                  <span class="w-full h-0.5 bg-white rounded-full transform transition-all duration-300"
                    :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"></span>
                </div>
              </button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isMenuOpen" 
                    class="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div class="py-1">
                    <button
                      @click="viewAttendanceRecords"
                      class="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <svg class="mr-3 h-5 w-5 text-indigo-400 group-hover:text-indigo-500" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Attendance Records
                    </button>
                    
                    <button
                      @click="logout"
                      class="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                    >
                      <svg class="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="max-w-md w-full mx-auto">
        <!-- Clock Display -->
        <div class="bg-white overflow-hidden shadow-lg rounded-2xl mb-8">
          <div class="p-6 sm:p-8">
            <div class="text-center">
              <div class="text-3xl sm:text-5xl md:text-5xl font-semibold text-indigo-600 mb-4 font-mono tracking-wider">
                {{ currentTime }}
              </div>
              <div class="text-lg sm:text-xl text-gray-600 font-medium">
                {{ currentDay }}
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Button -->
        <div class="flex justify-center mb-8">
          <button
  @click="hussam"
  :class="[
    'attendance-button w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95',
    lastAttendance?.check_in_time && !lastAttendance?.check_out_time
      ? 'bg-red-500 hover:bg-red-600'
      : 'bg-green-500 hover:bg-green-600'
      
  ]"
>
  {{ buttonText }}
</button>
        </div>

        <!-- Status Message -->
        <div class="text-center text-lg text-gray-700">
          {{ statusMessage }}
        </div>
      </div>
    </main>

    <!-- Notification Toast -->
    <div
      v-if="showNotification"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-lg font-medium z-50"
      :class="[
        notificationType === 'success'
         ? 'bg-green-500' 
         : 'bg-red-500',
      ]"
    >
      {{ notificationMessage }}

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { definePageMeta } from '#imports'
import { useAttendance } from '@/composables/useAttendance'
import { useStorage } from '@vueuse/core'

definePageMeta({
  middleware: ['auth']
})

const token = useStorage('token', null)

onMounted(() => {
  updateDateTime()
  const timer = setInterval(updateDateTime, 1000)
  updateStatusMessage()

  
  onUnmounted(() => {
    clearInterval(timer)

  })
})

const {data:lastAttendance,execute}= await useFetch('/api/attendance/last',{

  headers: {
    'token':token.value
  }
})
const hussam =()=>{

  handleAttendance()
  execute()

}


const {
  isCheckedIn,
  isMenuOpen,
  employeeName,
  currentTime,
  currentDay,
  statusMessage,
  showNotification,
  notificationType,
  notificationMessage,
  buttonText,
  toggleMenu,
  handleAttendance,
  viewAttendanceRecords,
  logout,
  updateStatusMessage,
  updateDateTime
} = useAttendance()

</script>

<style scoped>
.attendance-button {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.attendance-button:hover {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

/* Mobile Optimization */
@media (max-width: 640px) {
  .attendance-button {
    font-size: 1.25rem;
  }
}
</style>