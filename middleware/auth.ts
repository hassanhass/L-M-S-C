import { useStorage } from '@vueuse/core';

export default defineNuxtRouteMiddleware((to, from) => {
    const token = useStorage('token', null); 

    if (!token.value) {
        return navigateTo('/login');
    }
});
