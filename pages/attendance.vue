<template>
  <div>
    <h1>Employee Attendance</h1>
    <p>Welcome, {{ employeeName }}</p>
    <Button class="bg-red-400" @click="checkIn" :disabled="hasCheckedIn">Check In</Button>
    <Button @click="checkOut" :disabled="!hasCheckedIn || hasCheckedOut">Check Out</Button>
    <Button @click="navigateTo('/login')">Logout</Button>
    <div v-if="attendanceRecord">
      <h2>Attendance Record:</h2>
      <pre>{{ attendanceRecord }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

definePageMeta({
  middleware: 'auth'
});

const employeeId = useStorage('employeeId', null);
const employeeName = useStorage('employeeName', null);
const hasCheckedIn = ref(false);
const hasCheckedOut = ref(false);
const token = useStorage('token', null);
const attendanceRecord = ref(null); // تعريف سجل الحضور

const fetchAttendanceRecord = async () => {
  const { data, error } = await useFetch(`/api/attendance/${employeeId.value}`, {
    method: 'GET',
    headers: { token: token.value },
  });

  if (error.value) {
    console.error("Error fetching attendance record:", error.value);
  } else {
    attendanceRecord.value = data.value; // تخزين سجل الحضور
  }
};

// استرجاع سجل الحضور عند تحميل الصفحة
fetchAttendanceRecord();

const checkIn = async () => {
  const { data, error } = await useFetch("/api/attendance/check-in", {
    method: 'POST',
    body: { employee_id: employeeId.value },
    headers: { token: token.value },
  });

  if (error.value) {
    console.error("Error during check-in:", error.value);
    return;
  }

  if (data.value) {
    hasCheckedIn.value = true;
    fetchAttendanceRecord(); // تحديث سجل الحضور
  }
};

const checkOut = async () => {
  const { data, error } = await useFetch("/api/attendance/check-out", {
    method: 'POST',
    body: { employee_id: employeeId.value },
    headers: { token: token.value },
  });

  if (error.value) {
    console.error("Error during check-out:", error.value);
    return;
  }

  if (data.value) {
    hasCheckedOut.value = true;
    fetchAttendanceRecord(); // تحديث سجل الحضور
  }
};
</script>
