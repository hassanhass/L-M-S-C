<template>
  <div>
    <h1>قائمة الموظفين</h1>
    <div v-if="loading">جارٍ التحميل...</div>
    <div v-else-if="employees.length === 0">لا توجد بيانات</div>
    <ul v-else>
      <li v-for="employee in employees" :key="employee.id" class="employee-card">
        <h2>{{ employee.user.name }}</h2>
        <p><strong>Email:</strong> {{ employee.user.email }}</p>
        <p><strong>Position:</strong> {{ employee.position }}</p>
        <p><strong>Gender:</strong> {{ employee.user.gender }}</p>
        <p><strong>Birth Date:</strong> {{ formatDate(employee.user.birth_date) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
const token = useStorage('token', null);
const employees = ref([]);
const loading = ref(true);

async function fetchEmployees() {
  try {
    const response = await $fetch('/api/admin/attendance/employees', {
      headers: {
        token: token.value, 
        
      }
    });
    
    console.log(response);
    employees.value = response.employees; 

  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ar-EG', options);
}

fetchEmployees();
</script>