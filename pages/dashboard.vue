<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-teal-700 p-6">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <h1 class="text-3xl font-bold mb-4 text-center">تسجيل الحضور</h1>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left text-gray-700">اسم الموظف</th>
            <th class="py-3 px-4 text-left text-gray-700">البريد الإلكتروني</th>
            <th class="py-3 px-4 text-left text-gray-700">وقت الدخول</th>
            <th class="py-3 px-4 text-left text-gray-700">وقت الخروج</th>
            <th class="py-3 px-4 text-left text-gray-700">التاريخ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(attendance, index) in attendances" :key="index" class="hover:bg-gray-50">
            <td class="py-3 px-4">{{ attendance.employee.name }}</td>
            <td class="py-3 px-4">{{ attendance.employee.email }}</td>
            <td class="py-3 px-4">{{ attendance.check_in_time }}</td>
            <td class="py-3 px-4">{{ attendance.check_out_time || 'لم يغادر بعد' }}</td>
            <td class="py-3 px-4">{{ attendance.date }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="pending" class="text-center text-gray-500 mt-4">جاري التحميل...</p>
      <p v-if="error" class="text-red-500 text-center mt-4">خطأ في تحميل البيانات: {{ error.message }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
});

const { data: attendances, pending, error } = await useFetch('/api/attendance');
</script>

