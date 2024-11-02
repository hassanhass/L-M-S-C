import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useAttendance = () => {
  // State Management
  const state = ref(0)
  const employeeId = useStorage('employeeId', null)
  const employeeName = useStorage('employeeName', null)
  const token = useStorage('token', null)

  
  // Computed Properties
  const buttonText = computed(() => {
    switch (state.value) {
      case 0:
        return 'انطلق للنجاح'
      case 1:
        return 'أنت هنا'
      case 2:
        return 'أراك لاحقًا'
      default:
        return 'انطلق للنجاح'
    }
  })

  const buttonClass = computed(() => {
    switch (state.value) {
      case 0:
        return 'bg-blue-500 text-white'
      case 1:
        return 'bg-green-500 text-white'
      case 2:
        return 'bg-red-500 text-white'
      default:
        return 'bg-blue-500 text-white'
    }
  })

  const overlayClass = computed(() => {
    switch (state.value) {
      case 0:
        return 'bg-blue-400'
      case 1:
        return 'bg-green-400'
      case 2:
        return 'bg-red-400'
      default:
        return 'bg-blue-400'
    }
  })

  // Methods
  const handleAttendance = async () => {
    try {
      if (state.value === 0) {
        const {data} = await useFetch("/api/attendance/check-in", {
          method: 'POST',
          body: { employee_id: employeeId.value },
          headers: {'token':token.value!},
        })

        if (data.value) {
          state.value = 1
        }
      } else {
        state.value = 0
      }
    } catch (error) {
      console.error('Error handling attendance:', error)
    }
  }
  const logout = () => {
    token.value = null
    employeeId.value = null
    employeeName.value = null
    navigateTo('/login')
  }

  return {
    // State
    state,
    employeeId,
    employeeName,
    token,

    // Computed
    buttonText,
    buttonClass,
    overlayClass,

    // Methods
    handleAttendance,
    logout
  }
}