// composables/useAttendance.ts
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useAttendance = () => {
  const router = useRouter()
  const token = useStorage('token', '')
  const employeeId = useStorage('employeeId', '')
  const employeeName = useStorage('employeeName', '')
  
  const isCheckedIn = ref(false)
  const isMenuOpen = ref(false)
  const currentTime = ref('')
  const currentDay = ref('')
  const statusMessage = ref('')
  const showNotification = ref(false)
  const notificationType = ref('success')
  const notificationMessage = ref('')

  const buttonText = computed(() => isCheckedIn.value ? 'Check Out' : 'Check In')

  function updateDateTime() {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    })
    currentDay.value = now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }

  async function handleAttendance() {
    try {
        const response = await $fetch('/api/attendance/check-in', {
            method: 'POST',
            headers: { 
                'token': token.value,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 'success') {
            isCheckedIn.value = !isCheckedIn.value;
            showToast(response.message, 'success');
            updateStatusMessage();
        } else {
            throw new Error(response.message || 'Failed to process attendance');
        }
    } catch (error) {
        console.error('Error handling attendance:', error);
        showToast(error.message || 'Failed to process attendance', 'error');
    }
}

  function updateStatusMessage() {
    statusMessage.value = isCheckedIn.value 
      ? 'Currently checked in'
      : 'Ready to start your day'
  }

  function viewAttendanceRecords() {
    router.push('/employee/dashboard')
  }

  function logout() {
    token.value = ''
    employeeId.value = ''
    employeeName.value = ''
    router.push('/')
  }

  return {
    isCheckedIn,
    isMenuOpen,
    employeeName,
    currentTime,
    currentDay,
    statusMessage,
    showNotification,
    notificationType,
    notificationMessage,
    buttonText,
    toggleMenu,
    handleAttendance,
    viewAttendanceRecords,
    logout,
    updateStatusMessage,
    updateDateTime
  }
}