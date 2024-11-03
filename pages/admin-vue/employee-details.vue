<template>
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">تفاصيل الموظف</h1>
            <NuxtLink 
              to="/admin-vue/dashboard"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              العودة للداشبورد
            </NuxtLink>
          </div>
        </div>
  
        <!-- Employee Details Card -->
        <div v-if="employee" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <h3 class="text-gray-600 text-sm">الاسم</h3>
                  <p class="text-gray-900 font-medium">{{ employee.user.name }}</p>
                </div>
                <div>
                  <h3 class="text-gray-600 text-sm">البريد الإلكتروني</h3>
                  <p class="text-gray-900 font-medium">{{ employee.user.email }}</p>
                </div>
                <div>
                  <h3 class="text-gray-600 text-sm">المنصب</h3>
                  <p class="text-gray-900 font-medium">{{ employee.position }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <h3 class="text-gray-600 text-sm">الجنس</h3>
                  <p class="text-gray-900 font-medium">{{ employee.user.gender }}</p>
                </div>
                <div>
                  <h3 class="text-gray-600 text-sm">تاريخ الميلاد</h3>
                  <p class="text-gray-900 font-medium">{{ formatDate(employee.user.birth_date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Attendance Records -->
        <div class="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-4">سجلات الحضور</h2>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وقت الحضور</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وقت الانصراف</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="record in employee.attendanceRecords" :key="record.id">
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
    middleware: ['admin']
  })
  
  const route = useRoute()
  const employee = ref(null)
  const token = useStorage('token', null)
  
  onMounted(async () => {
    try {
      const response = await $fetch(`/api/attendance/1${route.params.id}`, {
        headers: {
          'token': token.value
        }
      })
      employee.value = response.employee
    } catch (error) {
      console.error('Error fetching employee details:', error)
    }
  })
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA')
  }
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  </script>