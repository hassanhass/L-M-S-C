<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" @click="logout">Logout</Button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ employees.length }}</p>
          </CardContent>
        </Card>
        
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ todayAttendance }}</p>
          </CardContent>
        </Card>
        
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>Average Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ averageWorkHours }} hours</p>
          </CardContent>
        </Card>
      </div>

      <!-- Employee Management -->
      <Card class="mb-6">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>Employee Management</CardTitle>
          <Button @click="openAddEmployeeModal">Add New Employee</Button>
        </CardHeader>
        <CardContent>
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-4">
            <p class="text-muted-foreground">Loading data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-destructive/10 text-destructive p-4 rounded-md">
            {{ error }}
          </div>

          <!-- Empty State -->
          <div v-else-if="employees.length === 0" class="text-center py-4">
            <p class="text-muted-foreground">No employees currently</p>
          </div>

          <!-- Employees Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="px-4 py-2 text-right">Name</th>
                  <th class="px-4 py-2 text-right">Email</th>
                  <th class="px-4 py-2 text-right">Position</th>
                  <th class="px-4 py-2 text-right">Gender</th>
                  <th class="px-4 py-2 text-right">Hire Date</th>
                  <th class="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in employees" 
                    :key="employee.id" 
                    class="border-b hover:bg-muted/50">
                  <td class="px-4 py-2">{{ employee.user.name }}</td>
                  <td class="px-4 py-2">{{ employee.user.email }}</td>
                  <td class="px-4 py-2">{{ employee.position }}</td>
                  <td class="px-4 py-2">{{ employee.user.gender === 'male' ? 'Male' : 'Female' }}</td>
                  <td class="px-4 py-2">{{ formatDate(employee.user.birth_date) }}</td>
                  <td class="px-4 py-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="openAttendanceDialog(employee)">
                      Attendance Records
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="openEditEmployeeModal(employee)">
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      @click="deleteEmployee(employee.id)">
                      Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Add/Edit Employee Modal -->
      <div v-if="showEmployeeModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" @click.self="closeEmployeeModal">
        <div class="bg-background rounded-lg shadow-lg p-6 max-w-md w-full">
          <h3 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h3>
          <form @submit.prevent="isEditing ? updateEmployee() : addEmployee()">
            <div class="mb-4">
              <label class="block mb-2" for="name">Name</label>
              <input v-model="newEmployee.name" type="text" id="name" class="w-full border px-3 py-2 rounded" required />
            </div>
            <div class="mb-4">
              <label class="block mb-2" for="email">Email</label>
              <input v-model="newEmployee.email" type="email" id="email" class="w-full border px-3 py-2 rounded" required />
            </div>
            <div class="mb-4">
              <label class="block mb-2" for="position">Position</label>
              <input v-model="newEmployee.position" type="text" id="position" class="w-full border px-3 py-2 rounded" required />
            </div>
            <div class="mb-4">
              <label class="block mb-2" for="gender">Gender</label>
              <select v-model="newEmployee.gender" id="gender" class="w-full border px-3 py-2 rounded" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="flex justify-end">
              <Button type="submit" class="bg-blue-600 text-white">{{ isEditing ? 'Update Employee' : 'Add Employee' }}</Button>
            </div>
            <div v-if="addEmployeeError" class="text-red-500 mt-4">{{ addEmployeeError }}</div>
          </form>
        </div>
      </div>

      <!-- Attendance Records Dialog -->
      <div v-if="showDialog" 
           class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
           @click.self="closeDialog">
        <div class="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold">
                Attendance Records: {{ currentEmployee?.user.name }}
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
                    <th class="px-4 py-2 text-right">Day</th>
                    <th class="px-4 py-2 text-right">Date</th>
                    <th class="px-4 py-2 text-right">Check In Time</th>
                    <th class="px-4 py-2 text-right">Check Out Time</th>
                    <th class="px-4 py-2 text-right">Total Hours</th>
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
                      {{ record.check_out_time ? formatTime(record.check_out_time) : 'Not Checked Out' }}
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

const todayAttendance = ref(0)
const averageWorkHours = ref(0)
const showEmployeeModal = ref(false)
const isEditing = ref(false)
const newEmployee = ref({
  name: '',
  email: '',
  position: '',
  gender: 'male'
})
const addEmployeeError = ref(null)

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
      calculateStats()
    }
  } catch (err) {
    error.value = 'An error occurred while fetching employee data'
    console.error('Error fetching employees:', err)
  } finally {
    loading.value = false
  }
}

function calculateStats() {
  const today = new Date().toDateString()
  todayAttendance.value = employees.value.filter(emp => 
    emp.attendanceRecords.some(record => 
      new Date(record.check_in_time).toDateString() === today
    )
  ).length

  let totalHours = 0
  let recordCount = 0
  employees.value.forEach(emp => {
    emp.attendanceRecords.forEach(record => {
      if (record.check_out_time) {
        totalHours += calculateHoursDifference(record.check_in_time, record.check_out_time)
        recordCount++
      }
    })
  })
  averageWorkHours.value = recordCount > 0 ? (totalHours / recordCount).toFixed(2) : 0
}

function openAttendanceDialog(employee) {
  currentEmployee.value = employee
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  currentEmployee.value = null
}

function logout() {
  token.value = null
  navigateTo('/')
}

function openAddEmployeeModal() {
  isEditing.value = false
  showEmployeeModal.value = true
  addEmployeeError.value = null // Reset error message
  newEmployee.value = { name: '', email: '', position: '', gender: 'male' } // Reset form
}

function closeEmployeeModal() {
  showEmployeeModal.value = false
  newEmployee.value = { name: '', email: '', position: '', gender: 'male' }
}

function openEditEmployeeModal(employee) {
  isEditing.value = true
  newEmployee.value = { ...employee.user, gender: employee.user.gender }; // Fill form with current employee data
  showEmployeeModal.value = true
}

async function updateEmployee() {
  try {
    const response = await $fetch(`/api/admin/attendance/employees/${newEmployee.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: token.value
      },
      body: JSON.stringify(newEmployee.value)
    });

    if (response && response.success) {
      const index = employees.value.findIndex(emp => emp.id === newEmployee.value.id);
      if (index !== -1) {
        employees.value[index] = response.updatedEmployee; // Update the local employee array
      }
      closeEmployeeModal();
    } else {
      throw new Error(response.message || 'Failed to update employee');
    }
  } catch (error) {
    addEmployeeError.value = error.message; // عرض رسالة الخطأ
    console.error('Error updating employee:', error);
  }
}

async function deleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      const response = await $fetch(`/api/admin/attendance/employees/${id}`, {
        method: 'DELETE',
        headers: {
          token: token.value
        }
      });

      if (response && response.success) {
        employees.value = employees.value.filter(emp => emp.id !== id); // Remove the employee from local state
      } else {
        throw new Error(response.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert(error.message || 'An error occurred while deleting employee');
    }
  }
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
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 'Not Specified'
  const hours = calculateHoursDifference(checkIn, checkOut)
  return `${hours.toFixed(2)} hours`
}

function calculateHoursDifference(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate - startDate
  return diff / (1000 * 60 * 60)
}
</script>