import { signOut } from '@firebase/auth'
import { ref } from 'vue'
import { projectAuth } from '../firebase/config'

// refs
const error = ref(null)
const isPending = ref(false)
// logout function
const logout = async () => {
    error.value = null
    isPending.value = true
    try{
        await signOut(projectAuth)
        isPending.value = false
    } catch(err) {
        console.log(err.message)
        error.value = err.message
        isPending.value = false
    }

}

const useLogout = () => {
    return { error, logout, isPending }
}

export default useLogout