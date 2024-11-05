<template>
  <div class="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-y-auto">
    <div class="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <Card class="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <!-- Enhanced Logo Area -->
        <CardHeader>
          <div class="flex flex-col items-center space-y-8">
            <!-- Logo Container -->
            <div class="relative group transition-all duration-300 hover:-translate-y-1">
              <!-- Background Glow -->
              <div class="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>

              <!-- Main Logo Circle -->
              <div class="relative w-24 h-24">
                <!-- Primary Background -->
                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white to-blue-50 shadow-lg"></div>
                
                <!-- Animated Rings -->
                <div class="absolute inset-0 rounded-full border-2 border-blue-200/50 animate-[spin_8s_linear_infinite]"></div>
                <div class="absolute inset-0 rounded-full border-2 border-indigo-200/50 animate-[spin_10s_linear_infinite]"></div>
                
                <!-- Center Icon Container -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="relative transform transition-transform duration-300 group-hover:scale-110">
                    <!-- Main Icon -->
                    <div class="relative">
                      <svg 
                        class="w-10 h-10 text-blue-600 animate-[pulse_3s_ease-in-out_infinite]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="1.5" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <!-- Decorative Dots -->
                      <div class="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
                      <div class="absolute -left-1 -bottom-1 w-2 h-2 bg-indigo-400 rounded-full animate-[ping_2s_ease-in-out_infinite_200ms]"></div>
                    </div>
                  </div>
                </div>

                <!-- Decorative Elements -->
                <div class="absolute -right-2 top-0 w-4 h-4 text-yellow-400 animate-[bounce_3s_ease-in-out_infinite]">
                  ✦
                </div>
                <div class="absolute -left-1 -bottom-1 w-4 h-4 text-blue-400 animate-[bounce_3s_ease-in-out_infinite_300ms]">
                  ✦
                </div>
              </div>
            </div>

            <!-- Brand Text -->
            <div class="space-y-2 text-center">
              <h2 class="relative text-4xl font-bold">
                <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Time
                </span>
                <span class="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Matrix
                </span>
              </h2>
              <p class="text-sm font-medium text-gray-600 tracking-wider">
                Smart Attendance, Smarter Management
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="login" class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="email">Email address</Label>
                <Input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  class="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div class="space-y-2">
                <Label for="password">Password</Label>
                <Input 
                  id="password" 
                  v-model="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  class="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
            </div>

            <Button class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg 
                  class="h-5 w-5 text-blue-100 group-hover:text-blue-200" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                    clip-rule="evenodd" 
                  />
                </svg>
              </span>
              Access TimeMatrix
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="mt-8 text-center space-y-2">
        <p class="text-sm text-gray-600">
          TimeMatrix - Where Time Meets Technology
        </p>
        <p class="text-xs text-gray-500">
          &copy; {{ new Date().getFullYear() }} Team.c All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const email = ref('');
const password = ref('');
const error = ref('');
const role = useStorage('role', null);
const token = useStorage('token', null);
const employeeId = useStorage('employeeId', null);
const employeeName = useStorage('employeeName', null);

const router = useRouter();

async function login() {
  try {
    error.value = '';
    console.log('Submitting:', { email: email.value, password: password.value });

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    
    console.log('Login response:', response);

    if (response && response.token) {
      token.value = response.token;
      employeeId.value = response.user.id;
      employeeName.value = response.user.name;
      role.value = response.user.role;

      console.log('Stored user data:', { token: token.value, role: role.value });

      if (role.value === 'admin') {
        await router.push('/admin-vue/dashboard');
      } else {
        await router.push('/employee/attendance');
      }
    } else {
      error.value = 'Invalid response from server';
      console.error('Invalid response structure:', response);
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.data?.message || 'An error occurred during login. Please try again.';
  }
}
</script>