<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
      <div class="container-xxl">
        <span>
            <router-link class="navbar-brand" to="/">
                <span class="fw-bold text-secondary">Forms</span>
            </router-link>
            <router-link to="/profile">
                <img v-if="user" :src="user.photoURL">
            </router-link>
        </span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse align-center justify-content-end" id="main-nav">
            <ul class="navbar-nav">
                <li v-if="user" class="nav-item"><router-link to="/" class="nav-link my-1">View Forms</router-link></li>
                <li v-if="user && (userDoc.role == 'admin' || userDoc.role == 'super')" class="nav-item my-1"><router-link to="/reports" class="nav-link">View Responses</router-link></li>
                <li v-if="user && (userDoc.role == 'admin' || userDoc.role == 'super')" class="nav-item my-1"><router-link to="/create" class="nav-link">New Form</router-link></li>
                <li v-if="user && (userDoc.role == 'admin' || userDoc.role == 'super')" class="nav-item my-1"><router-link to="/add-user" class="nav-link">Add User</router-link></li>
                <li v-if="!user" class="nav-item"><router-link to="/login"><button class="btn btn-secondary">Login</button></router-link></li>
                <li v-if="user" class="nav-item"><button class="btn btn-secondary my-1 mx-1" @click="handleLogout">Logout</button></li>
                <li v-if="isPending" class="nav-item"><button class="btn btn-secondary my-1 mx-1" disabled>Logging out...</button></li>
                <li v-if="user" class="nav-item">
                    <span>
                        <img v-if="orgPicture" :src="orgPicture">
                    </span>
                </li>
            </ul>
        </div>
      </div>
  </nav>
</template>

<script>
import useLogout from '../composables/useLogout'
import { useRouter } from 'vue-router'
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { getDownloadURL, listAll, ref as firebaseRef } from "firebase/storage";
import { projectStorage } from '../firebase/config'

export default {
    setup(){
        const store = useStore()
        const router = useRouter() 
        const orgPicture = ref('')
        listAll(firebaseRef(projectStorage, `${store.getters.userDoc.org}`)).then(async res => {
            const filePath = res.items[0].fullPath
            const storageRef = firebaseRef(projectStorage, filePath)
            try {
                const url = await getDownloadURL(storageRef)
                orgPicture.value = url
                console.log(url)
            } catch (e) {
                console.log('some error occurred when loading the org profile picture')
            }
        })
        const { logout, isPending, error } = useLogout()
        const handleLogout = async () => {
            await logout()
            if(!error.value){
                router.push('/login')
            }
        }
        return { user : computed(() => store.state.user), 
        userDoc : computed(() => store.state.userDoc), 
        handleLogout, isPending, orgPicture }
    }
}
</script>

<style scoped>
 img {
    object-fit: cover;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    margin: 10px;
    border-radius: 50%;
    border: solid 1px grey;
}
</style>