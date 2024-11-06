<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="bg-white shadow-md w-64 hidden md:block">
      <div class="p-6">
        <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <nav class="mt-8">
          <div v-for="link in navLinks" :key="link.title" class="mb-4">
            <button
              @click="link.action"
              class="flex items-center w-full p-3 text-gray-600 hover:bg-blue-100 rounded-lg transition duration-200"
            >
              <component :is="link.icon" class="w-5 h-5 mr-2" />
              {{ link.title }}
            </button>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Employees</h2>
        <button @click="toggleMobileMenu" class="md:hidden text-gray-600">
          <MenuIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Add/Edit Employee Form -->
      <div v-if="showForm" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-lg font-semibold mb-4">
          {{ selectedEmployee ? 'Edit Employee' : 'Add New Employee' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input 
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="formData.email"
              type="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div v-if="!selectedEmployee">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              v-model="formData.password"
              type="password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Position</label>
            <input 
              v-model="formData.position"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select 
              v-model="formData.gender"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              @click="closeForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {{ selectedEmployee ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Employee List -->
      <div v-if="pending" class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error.message }}
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr class="bg-gray-200">
                <th class="py-2 px-4 border-b text-left">Name</th>
                <th class="py-2 px-4 border-b text-left">Email</th>
                <th class="py-2 px-4 border-b text-left">Position</th>
                <th class="py-2 px-4 border-b text-left">Gender</th>
                <th class="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50 transition duration-200">
                <td class="py-2 px-4 border-b">{{ employee.user.name }}</td>
                <td class="py-2 px-4 border-b">{{ employee.user.email }}</td>
                <td class="py-2 px-4 border-b">{{ employee.position }}</td>
                <td class="py-2 px-4 border-b">{{ employee.user.gender }}</td>
                <td class="py-2 px-4 border-b">
                  <button @click="editEmployee(employee)" class="text-blue-600 hover:underline">Edit</button>
                  <button @click="deleteEmployee(employee.id)" class="text-red-600 hover:underline ml-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useStorage } from '@vueuse/core'

// State
const isMobileMenuOpen = ref(false)
const showForm = ref(false)
const selectedEmployee = ref(null)
const token = useStorage('token', '')

const formData = ref({
  name: '',
  email: '',
  password: '',
  gender: 'male',
  position: '',
  office_id: 1 // تأكد من تعيين office_id المناسب
})

// Fetch employees data
const { data: employeesData, pending, error, refresh } = await useFetch('/api/admin/attendance/employees', {
  headers: {
    'token': token.value
  },
  transform: (response) => response.employees
})

// Computed property for employees
const employees = computed(() => employeesData.value || [])

// Navigation Links
const navLinks = [
  { 
    title: 'Add Employee', 
    icon: UserPlusIcon, 
    action: () => {
      selectedEmployee.value = null
      formData.value = {
        name: '',
        email: '',
        password: '',
        gender: 'male',
        position: '',
        office_id: 1
      }
      showForm.value = true
    }
  },
  { 
    title: 'Logout', 
    icon: ArrowRightOnRectangleIcon, 
    action: async () => {
      token.value = ''
      await navigateTo('/')
    }
  }
]

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const editEmployee = (employee) => {
  selectedEmployee.value = employee
  formData.value = {
    name: employee.user.name,
    email: employee.user.email,
    gender: employee.user.gender,
    position: employee.position,
    office_id: employee.office_id,
    password: null // لا نرسل كلمة المرور عند التعديل إلا إذا أراد المستخدم تغييرها
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedEmployee.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    gender: 'male',
    position: '',
    office_id: 1
  }
}

const handleSubmit = async () => {
  try {
    if (selectedEmployee.value) {
      // Update employee
      await $fetch(`/api/emploeey/${selectedEmployee.value.user.id}`, {
        method: 'PUT',
        body: formData.value,
        headers: {
          'token': token.value
        }
      })
    } else {
      // Add new employee
      await $fetch('/api/emploeey/add', {
        method: 'POST',
        body: formData.value,
        headers: {
          'token': token.value
        }
      })
    }
    
    await refresh() // Refresh the employees list
    closeForm()
  } catch (error) {
    console.error('Error:', error)
    alert(error.data?.message || 'An error occurred')
  }
}

const deleteEmployee = async (id) => {
  if (!confirm('Are you sure you want to delete this employee?')) return
  
  try {
    await $fetch(`/api/emploeey/${id}`, {
      method: 'DELETE',
      headers: {
        'token': token.value
      }
    })
    await refresh() // Refresh the employees list
  } catch (error) {
    console.error('Error:', error)
    alert(error.data?.message || 'An error occurred')
  }
}

// Add navigation guard
definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped>
/* Styles for responsiveness */
@media (max-width: 768px) {
  aside {
    display: none; /* Hide sidebar on small screens */
  }
  .flex {
    flex-direction: column;
  }
}
</style>