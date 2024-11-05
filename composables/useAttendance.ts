// composables/useAttendance.ts
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

export const useAttendance = () => {
  const isCheckedIn = ref(false);
  const employeeId = useStorage('employeeId', '');
  const employeeName = useStorage('employeeName', '');
  const token = useStorage('token', '');
  const router = useRouter();

  const buttonText = computed(() => 
    isCheckedIn.value ? 'Check Out' : 'Check In'
  );

  const handleAttendance = async () => {
    try {
      const response = await useFetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });

      if (response.error) {
        console.error('Error handling attendance:', response.error);
        // Optionally show an error message to the user
        return;
      }

      if (response.data) {
        isCheckedIn.value = !isCheckedIn.value;
        // Optionally show a success message to the user
      }
    } catch (error) {
      console.error('Error handling attendance:', error);
      // Optionally show an error message to the user
    }
  };

  const logout = () => {
    token.value = '';
    employeeId.value = '';
    employeeName.value = '';
    router.push('/');
  };

  const viewAttendanceRecords = () => {
    router.push('/employee/dashboard');
  };

  return {
    isCheckedIn,
    employeeName,
    buttonText,
    handleAttendance,
    logout,
    viewAttendanceRecords
  };
};