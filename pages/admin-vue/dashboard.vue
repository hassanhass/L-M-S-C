<template>
  <div class="min-h-screen bg-background">
    <header class="bg-card shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-foreground">لوحة تحكم المدير</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- إحصائيات سريعة -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card class="col-span-1">
          <CardHeader>
            <CardTitle>إجمالي الموظفين</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-2xl font-semibold">{{ employees.length }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- قائمة الموظفين -->
      <Card class="mt-8">
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="loading">جارٍ التحميل...</div>
          <div v-else-if="employees.length === 0">لا توجد بيانات</div>
          <table v-else class="w-full">
            <thead>
              <tr>
                <th class="text-right py-2 px-4">الاسم</th>
                <th class="text-right py-2 px-4">البريد الإلكتروني</th>
                <th class="text-right py-2 px-4">المنصب</th>
                <th class="text-right py-2 px-4">الجنس</th>
                <th class="text-right py-2 px-4">تاريخ الميلاد</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee.id" class="border-t hover:bg-muted/50">
                <td class="py-2 px-4">{{ employee.user.name }}</td>
                <td class="py-2 px-4">{{ employee.user.email }}</td>
                <td class="py-2 px-4">{{ employee.position }}</td>
                <td class="py-2 px-4">{{ employee.user.gender === 'male' ? 'ذكر' : 'أنثى' }}</td>
                <td class="py-2 px-4">{{ formatDate(employee.user.birth_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <NuxtLink :to="`/admin-vue/employee-details/${employee.id}`"
                    class="text-blue-600 hover:text-blue-900">
                    عرض التفاصيل
                  </NuxtLink>
                </td>
              </tr>

            </tbody>
          </table>
        </CardContent>
      </Card>

      <!-- إضافة موظف جديد -->
      <Button class="mt-4" @click="openAddEmployeeModal">
        إضافة موظف جديد
      </Button>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';

// استيراد المكونات بشكل صحيح
import { Card } from '~/components/ui/card'
import { CardHeader } from '~/components/ui/card'
import { CardTitle } from '~/components/ui/card'
import { CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

definePageMeta({
  middleware: ['admin']
});

const token = useStorage('token', null);
const employees = ref([]);
const loading = ref(true);

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ar-SA');
}

async function fetchEmployees() {
  try {
    const response = await $fetch('/api/admin/attendance/employees', {
      headers: {
        token: token.value,
      }
    });

    if (response && response.employees) {
      employees.value = response.employees;
      console.log('Fetched employees:', employees.value);

    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    loading.value = false;
  }
}

function openAddEmployeeModal() {
  console.log('Open add employee modal');
}
// function viewEmployeeDetails(employeeId) {

// }
onMounted(() => {
  fetchEmployees();
});
</script>