<template>
  <div>
    <ul >
      <li v-for="(attendance, index) in attendances" :key="index">
        <p>Employee Name: {{ attendance.employee.name }}</p>
        <p>Employee Email: {{ attendance.employee.email }}</p>
        <p>Check-in Time: {{ attendance.check_in_time }}</p>
        <p>Check-out Time: {{ attendance.check_out_time || 'Not checked out yet' }}</p>
        <p>Date: {{ attendance.date }}</p>
        <hr />
      </li>
    </ul>
    <p v-if="pending">Loading...</p>
    <p v-if="error">Error loading attendances: {{ error.message }}</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
});


const {data:attendances} = await useFetch('/api/attendance');

</script>
