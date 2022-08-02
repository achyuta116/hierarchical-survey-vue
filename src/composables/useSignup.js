import { createUserWithEmailAndPassword, updateProfile, signOut } from '@firebase/auth'
import { serverTimestamp } from '@firebase/firestore'
import { ref } from '@vue/reactivity'
import { secondaryAuth } from '../firebase/config'
import  useCollection  from './useCollection'
 
const error = ref(null)
const isPending = ref(false)

const signup = async (email, password, displayName, org, suborg, role) => {
    error.value = null
    isPending.value = true
    try{
        const res = await createUserWithEmailAndPassword(secondaryAuth, email, password)
        await signOut(secondaryAuth)
        const { addDocument, error: collectionError } = useCollection('users')
        await addDocument({ userID: res.user.uid, org, role, createdAt: serverTimestamp(), suborg, enabled: true, email }) // suborg functionality check, enabled check
        if (!res || collectionError.value) {
            throw new Error('Could not complete the signup')
        }
        await updateProfile(res.user, {
            displayName: displayName,
            photoURL: `${org}/default-image.png`
        })
        error.value = null
        isPending.value = false
        return res
    } catch(err) {
        console.log(err)
        error.value = err.message
        isPending.value = false
    }
}

const useSignup = () => {
    
    return {error, signup, isPending}
}

export default useSignup