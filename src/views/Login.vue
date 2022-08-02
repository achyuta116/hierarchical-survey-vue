<template>
    <div class="container-sm" style="height:90vh; display:flex; flex-direction: column; justify-content:center;">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-6 col-md-7 col-11">
                <h3 class="text-center my-2 text-secondary">Login</h3>
                <form @submit.prevent="handleSubmit" class="my-4">
                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-at text-secondary"></i>
                        </span>
                        <input type="email" class="form-control" placeholder="Email" v-model="email">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-key-fill text-secondary"></i>
                        </span>
                        <input type="password" class="form-control" placeholder="Password" v-model="password">
                    </div>
                    <div class="text-muted text-decoration-underline mb-3" style="cursor:pointer;" @click="handleSendPasswordResetEmail">click here to send password reset email</div>
                    <div v-if="emailError" class="text-danger">{{ emailError }}</div>
                    <div v-if="error" class="text-danger">{{ error }}</div>
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="btn btn-secondary" v-if="!isPending">Login</button>
                        <button class="btn btn-secondary" v-if="isPending" disabled>Loading</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import useLogin from "@/composables/useLogin";
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { sendPasswordResetEmail } from '@firebase/auth';
import { projectAuth } from '../firebase/config';

export default {
    setup(){
        const {error, login, isPending} = useLogin()
        const router = useRouter()
        const email = ref('')
        const password = ref('')
        const emailError = ref('')
        const handleSubmit = async () => {
            const res = await login(email.value, password.value)
            if(!error.value){
                console.log('user logged in')
                router.push('/')
            }
        }
        const handleSendPasswordResetEmail = async () => {
            if(email.value){
                try {
                    await sendPasswordResetEmail(projectAuth, email.value)
                } catch (err) {
                    emailError.value = err.code
                }
            } else {
                emailError.value = 'Enter a valid email'
            }
        }
        return {email, password, handleSubmit, error, isPending, emailError, handleSendPasswordResetEmail}
    }
}
</script>

<style>
</style>