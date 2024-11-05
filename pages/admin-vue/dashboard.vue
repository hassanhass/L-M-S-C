<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-foreground">لوحة تحكم المدير</h1>
          <Button variant="outline" @click="logout">تسجيل الخروج</Button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>إجمالي الموظفين</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ employees.length }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Employee Management -->
      <Card class="mb-6">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>إدارة الموظفين</CardTitle>
          <Button @click="openAddEmployeeModal">إضافة موظف جديد</Button>
        </CardHeader>
        <CardContent>
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <p class="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-destructive/10 text-destructive p-4 rounded-md">
            {{ error }}
          </div>

          <!-- Empty State -->
          <div v-else-if="employees.length === 0" class="text-center py-4">
            <p class="text-muted-foreground">لا يوجد موظفين حالياً</p>
          </div>

          <!-- Employees Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="px-4 py-2 text-right">الاسم</th>
                  <th class="px-4 py-2 text-right">البريد الإلكتروني</th>
                  <th class="px-4 py-2 text-right">المنصب</th>
                  <th class="px-4 py-2 text-right">الجنس</th>
                  <th class="px-4 py-2 text-right">تاريخ التعيين</th>
                  <th class="px-4 py-2 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in employees" 
                    :key="employee.id" 
                    class="border-b hover:bg-muted/50">
                  <td class="px-4 py-2">{{ employee.user.name }}</td>
                  <td class="px-4 py-2">{{ employee.user.email }}</td>
                  <td class="px-4 py-2">{{ employee.position }}</td>
                  <td class="px-4 py-2">{{ employee.user.gender === 'male' ? 'ذكر' : 'أنثى' }}</td>
                  <td class="px-4 py-2">{{ formatDate(employee.user.birth_date) }}</td>
                  <td class="px-4 py-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="openAttendanceDialog(employee)">
                      سجلات الحضور
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Attendance Records Dialog -->
      <div v-if="showDialog" 
           class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
           @click.self="closeDialog">
        <div class="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold">
                سجلات حضور: {{ currentEmployee?.user.name }}
              </h3>
              <Button variant="ghost" size="icon" @click="closeDialog">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b">
                    <th class="px-4 py-2 text-right">اليوم</th>
                    <th class="px-4 py-2 text-right">التاريخ</th>
                    <th class="px-4 py-2 text-right">وقت الحضور</th>
                    <th class="px-4 py-2 text-right">وقت الانصراف</th>
                    <th class="px-4 py-2 text-right">إجمالي الساعات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in currentEmployee?.attendanceRecords" 
                      :key="record.id"
                      class="border-b hover:bg-muted/50">
                    <td class="px-4 py-2">{{ formatDay(record.check_in_time) }}</td>
                    <td class="px-4 py-2">{{ formatDate(record.check_in_time) }}</td>
                    <td class="px-4 py-2">{{ formatTime(record.check_in_time) }}</td>
                    <td class="px-4 py-2">
                      {{ record.check_out_time ? formatTime(record.check_out_time) : 'لم يسجل الخروج' }}
                    </td>
                    <td class="px-4 py-2">
                      {{ calculateHours(record.check_in_time, record.check_out_time) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  middleware: ['admin']
})

const token = useStorage('token', null)
const employees = ref([])
const loading = ref(true)
const error = ref(null)
const showDialog = ref(false)
const currentEmployee = ref(null)

onMounted(() => {
  fetchEmployees()
})

async function fetchEmployees() {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/attendance/employees', {
      headers: {
        token: token.value
      }
    })
    if (response && response.employees) {
      employees.value = response.employees
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء جلب بيانات الموظفين'
    console.error('Error fetching employees:', err)
  } finally {
    loading.value = false
  }
}

function openAttendanceDialog(employee) {
  currentEmployee.value = employee
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  currentEmployee.value = null
}

function openAddEmployeeModal() {
  // يمكنك تنفيذ منطق فتح نافذة إضافة موظف جديد هنا
  console.log('Open add employee modal')
}

function logout() {
  // يمكنك تنفيذ منطق تسجيل الخروج هنا
  token.value = null
  navigateTo('/')
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function formatDay(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long'
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 'Not specified'
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end - start
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours} hour(s) and ${minutes} minute(s)`
}
</script>