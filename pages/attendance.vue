<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-r from-blue-800 to-teal-700 p-6">
    <Header /> <!-- استخدام مكون الهيدر هنا -->

    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center mx-auto mt-4">
      <h1 class="text-2xl font-bold mb-4">تسجيل الحضور</h1>
      <p class="mb-6">مرحبًا، {{ employeeName }}</p>
      
      <button
        @click="handleAttendance"
        :class="buttonClass"
        class="rounded-full w-40 h-40 flex items-center justify-center transition-transform duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden mx-auto"
      >
        <span class="absolute inset-0 bg-opacity-30 transition duration-300" :class="overlayClass"></span>
        <span class="relative z-10">{{ buttonText }}</span>
      </button>

      <button
        @click="logout"
        class="mt-4 text-white bg-gray-600 rounded p-2"
      >
        تسجيل الخروج
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core';
import { ref, computed } from 'vue';
import Header from './components/Header.vue'; // تأكد من المسار الصحيح

definePageMeta({
  middleware: 'auth'
});

const employeeId = useStorage('employeeId', null);
const employeeName = useStorage('employeeName', null);
const token = useStorage('token', null);
const state = ref(0); // 0: سجل الحضور, 1: تم تسجيل الحضور, 2: تم تسجيل الخروج

const buttonText = computed(() => {
  switch (state.value) {
    case 0:
      return 'انطلق للنجاح'; // حالة تسجيل الدخول
    case 1:
      return 'أنت هنا'; // حالة تسجيل الحضور
    case 2:
      return 'أراك لاحقًا'; // حالة تسجيل الخروج
  }
});

const buttonClass = computed(() => {
  switch (state.value) {
    case 0:
      return 'bg-blue-500 text-white'; // لون زر تسجيل الدخول
    case 1:
      return 'bg-green-500 text-white'; // لون زر تسجيل الحضور
    case 2:
      return 'bg-red-500 text-white'; // لون زر تسجيل الخروج
  }
});

const overlayClass = computed(() => {
  switch (state.value) {
    case 0:
      return 'bg-blue-400'; // تدرج أزرق
    case 1:
      return 'bg-green-400'; // تدرج أخضر
    case 2:
      return 'bg-red-400'; // تدرج أحمر
  }
});

const handleAttendance = async () => {
  if (state.value === 0) {
    // تسجيل دخول
    const { data } = await useFetch("/api/attendance/checkIn", {
      method: 'POST',
      body: { employee_id: employeeId },
      headers: { token: token.value },
    });

    if (data.value) {
      state.value = 1; // الانتقال إلى "تم تسجيل الحضور"
    }
  } else if (state.value === 1) {
    // تسجيل خروج
    const { data } = await useFetch("/api/attendance/checkOut", {
      method: 'POST',
      body: { employee_id: employeeId },
      headers: { token: token.value },
    });

    if (data.value) {
      state.value = 2; // الانتقال إلى "تم تسجيل الخروج"
    }
  } else {
    // إعادة تعيين الحالة بعد تسجيل الخروج
    state.value = 0; // العودة إلى البداية
  }
};

const logout = async () => {
  // هنا يمكنك إضافة أي منطق إضافي لتسجيل الخروج
  token.value = null;
  employeeId.value = null;
  employeeName.value = null;

  // يمكنك إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد تسجيل الخروج
  navigateTo('/login');
};

</script>