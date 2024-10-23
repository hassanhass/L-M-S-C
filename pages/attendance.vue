<template>
  <div>
    <h1>Employee Attendance</h1>
    <p>Welcome, {{ employeeName }}</p>
    <Button class="bg-red-400" @click="checkIn" :disabled="hasCheckedIn">Check In</Button>
    <Button @click="checkOut" :disabled="!hasCheckedIn || hasCheckedOut">Check Out</Button>
    <Button @click="navigateTo('/login')">Logout</Button>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core';

definePageMeta({
  middleware: 'auth'
});
const employeeId = useStorage('employeeId',null);
const employeeName = useStorage('employeeName',null);
const hasCheckedIn = ref(false);
const hasCheckedOut = ref(false);



const checkIn = async () => {
  const { data } = await useFetch("/api/attendance/checkIn", {
    method: 'POST',
    body: { employee_id: employeeId },
  });

  if (data.value) {
    hasCheckedIn.value = true;
  }
};

const checkOut = async () => {
  const { data } = await useFetch("/api/attendance/checkOut", {
    method: 'POST',
    body: { employee_id: employeeId },
  });

  if (data.value) {
    hasCheckedOut.value = true;
  }
};
</script>
