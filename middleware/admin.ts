import { useStorage } from '@vueuse/core';
export default defineNuxtRouteMiddleware((to, from) => {
    const role = useStorage('role', null);
  
    if (role.value !== 'admin') {
      return navigateTo('/login'); 
    }
  });