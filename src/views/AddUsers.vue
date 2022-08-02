<template>
    <div class="container-sm">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <!-- Change from admin to super later -->
                <form v-if="userDoc.role === 'super'" @submit.prevent="handleAdminCreate" class="my-3"> 
                    <h2 class="text-center text-secondary">Create Admin</h2>
                    <div class="row justify-content-center">
                        <input class="form-control mb-2" type="text" v-model="newAdminDetails.displayName" placeholder="Display Name">
                        <input class="form-control mb-2" type="email" placeholder="Email" v-model="newAdminDetails.email">
                        <input type="text" class="form-control mb-2" placeholder="Sub Org" v-model="newAdminDetails.suborg">
                        <input class="form-control mb-2" type="password" placeholder="Password" v-model="newAdminDetails.password">
                    </div> 
                    <div v-if="error" class="error">{{ error }}</div>
                    <div class="d-flex justify-content-center my-2">
                        <button class="btn btn-secondary" v-if="!isPending">Add User</button>
                        <button class="btn btn-secondary" v-if="isPending" disabled>Loading</button>
                    </div>
                </form>
                <form v-if="userDoc.role === 'super'" class="my-3 text-center">
                    <input type="file" class="form-control mb-2" accept="image/png">
                    <button v-if="!pending" class="btn btn-secondary" @click="updateOrgPicture">Upload Org picture</button>
                    <button v-else class="btn btn-secondary" disabled>Changing...</button>
                </form>
                <form v-if="userDoc.role === 'admin' || userDoc.role === 'super'" @submit.prevent="handleSubmit" class="my-3">
                    <h2 class="text-center text-secondary">Add User</h2>
                    <div class="row justify-content-center">
                        <input class="form-control mb-2" type="text" v-model="newUserDetails.displayName" placeholder="Display Name">
                        <input class="form-control mb-2" type="email" placeholder="Email" v-model="newUserDetails.email">
                        <input class="form-control mb-2" type="password" placeholder="Password" v-model="newUserDetails.password">
                    </div>
                    <div v-if="error" class="error">{{ error }}</div>
                    <div class="d-flex justify-content-center my-2">
                        <button class="btn btn-secondary" v-if="!isPending">Add User</button>
                        <button class="btn btn-secondary" v-if="isPending" disabled>Loading</button>
                    </div>
                </form>
                <form v-if="user" @submit.prevent="changeUsername" class="my-2">
                    <h2 class="text-center text-secondary">Change Username</h2>
                    <div class="row justify-content-center">
                        <input class="form-control mb-2" type="text" v-model="changedDisplayName" placeholder="New Username">
                    </div>
                    <div class="d-flex justify-content-center my-2">
                        <button class="btn btn-secondary">Change Username</button>
                    </div>
                </form>
                
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref } from '@vue/reactivity'
import useSignup from '../composables/useSignup'
import { updateProfile } from "firebase/auth";
import { useStore } from 'vuex';
import { uploadBytes, ref as firebaseRef, getDownloadURL } from '@firebase/storage';
import { projectStorage } from '../firebase/config';
import { useRouter } from 'vue-router';

export default {
    setup(){
        const newAdminDetails = reactive({email: '', password: '', displayName: '', suborg: ''})
        const newUserDetails = reactive({email: '', password: '', displayName: ''})
        const changedDisplayName = ref('')
        const store = useStore()
        const router = useRouter()
        const suborg = ref('')
        const profile = ref(null)
        const pending = ref(false)
        const errorPfp = ref(null)
        const user = store.getters.user
        const userDoc = store.getters.userDoc
        const { error, signup, isPending } = useSignup()
        const handleSubmit = async () => {
            await signup(email.value, password.value, displayName.value, userDoc.org, userDoc.suborg, 'user') // update userDoc
        }
        const handleAdminCreate = async () => {
            await signup(email.value, password.value, displayName.value, userDoc.org, suborg.value, 'admin')
        }
        const changeUsername = () => {
            updateProfile(user, {
                displayName: changedDisplayName.value
            })
        }
        const updateOrgPicture = async () => {
            console.log(profile.value.files[0])
            if(!profile.value.files) return;
            pending.value = true
            const storageRef = firebaseRef(projectStorage, 
            `${userDoc.org}/default-profile.png`)
            try {
                const res = await uploadBytes(storageRef, profile.value.files[0])
                const url = await getDownloadURL(storageRef)
                await updateProfile(user, {photoURL: url})
                router.go(0)
            } catch (e) {
                errorPfp.value = e.message
            }
        }
        return { user: computed(() => store.state.user), userDoc: computed(() => store.state.userDoc), updateOrgPicture,  handleSubmit, error, isPending, newAdminDetails, newUserDetails, changeUsername, changedDisplayName, handleAdminCreate, errorPfp, profile, pending }
    }
}
</script>

<style>

</style>