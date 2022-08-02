<template>
    <div class="container-sm">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <div v-if="user && userDoc">
                    <h1 class="my-3 text-center">User Profile</h1>
                    <div class="text-center mx-2">
                        <img :src="user.photoURL">
                    </div>
                    <p class="text-center text-secondary">{{ user.email }}</p>
                    <p class="text-center text-secondary">{{ user.uid }}</p>
                    <p class="text-center">
                        <span class="mx-2 text-secondary">{{ userDoc.role }}</span>
                        <span class="mx-2 text-secondary">{{ userDoc.org }}</span>
                        <span class="mx-2 text-secondary">{{ userDoc.suborg }}</span>
                    </p>
                    <div class="text-center my-2 row justify-content-center align-items-center">
                        <input type="file" class="col-4 my-2" ref="profile" accept="image/png">
                        <button v-if="!pending" class="col-3 btn btn-secondary" @click="updateProfilePic">Upload profile picture</button>
                        <button v-else class="col-3 btn btn-secondary" disabled>Changing...</button>
                    </div>
                    <div class="text-center my-2">
                        <button class="btn btn-secondary" @click="sendPwordResetEmail">Send Password Reset Email</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import { getDownloadURL, uploadBytes, ref as firebaseRef } from '@firebase/storage';
import { projectStorage, projectAuth } from "../firebase/config.js";
import { sendPasswordResetEmail, updateProfile } from '@firebase/auth';
import { useRouter } from 'vue-router';
import useLogout from '../composables/useLogout.js';
import { useStore } from 'vuex';

export default {
    setup(){
        const store = useStore()
        const user = store.getters.user
        const userDoc = store.getters.userDoc
        const profile = ref(null)
        const error = ref(null)
        const pending = ref(false)
        const router = useRouter()
        const updateProfilePic = async () => {
            console.log(profile.value.files[0])
            if(!profile.value.files) return;
            pending.value = true
            const storageRef = firebaseRef(projectStorage, 
            `${userDoc.org}/${userDoc.suborg}/${user.uid}/profilepic.png`)
            try {
                const res = await uploadBytes(storageRef, profile.value.files[0])
                const url = await getDownloadURL(storageRef)
                await updateProfile(user, {photoURL: url})
                router.go(0)
            } catch (e) {
                error.value = e.message
            }
        }
        const sendPwordResetEmail = async () => {
            try {
                await sendPasswordResetEmail(projectAuth, user.email)
                const { logout } = useLogout()
                await logout()
            } catch (e) {
                error.value = e.message
            }
        }

        return { user: computed(() => store.state.user), userDoc: computed(() => store.state.userDoc), updateProfilePic, profile, pending, sendPwordResetEmail, error }
    }
}
</script>

<style scoped>
img {
    object-fit: cover;
    box-sizing: border-box;
    width: 150px;
    height: 150px;
    margin: 10px;
    border-radius: 50%;
    border: solid 1px grey;
}

</style>