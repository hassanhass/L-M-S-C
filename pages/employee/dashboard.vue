<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">سجلات الحضور</h1>
            <p class="text-gray-600">{{ employeeName }}</p>
          </div>
          <NuxtLink 
            to="/employee/attendance"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Home page
          </NuxtLink>
        </div>
      </div>

      <!-- Total Hours -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">إجمالي ساعات العمل هذا الشهر</h2>
        <p class="text-2xl font-bold text-blue-600">{{ totalHours.toFixed(2) }} ساعة</p>
      </div>

      <!-- Records Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-4">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وقت الحضور
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وقت الانصراف
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in attendanceRecords" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(record.check_in_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatTime(record.check_in_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ record.check_out_time ? formatTime(record.check_out_time) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
    // جلب سجلات الحضور
    const response = await $fetch(`/api/attendance/${employeeId.value}`, {
      headers: { 'token': token.value }
    })
    attendanceRecords.value = response

    // جلب إجمالي ساعات العمل
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
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// دالة لتنسيق الوقت
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>