import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useAttendance = () => {
  const isCheckedIn = ref(false)
  const employeeId = useStorage('employeeId', null)
  const employeeName = useStorage('employeeName', null)
  const token = useStorage('token', null)

  const buttonText = computed(() => 
    isCheckedIn.value ? 'تسجيل الانصراف' : 'تسجيل الحضور'
  )

  const buttonClass = computed(() => 
    isCheckedIn.value ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
  )

  const handleAttendance = async () => {
    try {
      const { data } = await useFetch("/api/attendance/check-in", {
        method: 'POST',
        body: { employee_id: employeeId.value },
        headers: { 'token': token.value! },
      })

      if (data.value) {
        isCheckedIn.value = !isCheckedIn.value
      }
    } catch (error) {
      console.error('Error handling attendance:', error)
    }
  }

  const logout = () => {
    token.value = null
    employeeId.value = null
    employeeName.value = null
    navigateTo('/')
  }

  return {
    isCheckedIn,
    employeeId,
    employeeName,
    token,
    buttonText,
    buttonClass,
    handleAttendance,
    logout
  }
}