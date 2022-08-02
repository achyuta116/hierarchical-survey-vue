import { ref, computed, watchEffect, watch } from "vue"
import { projectAuth, projectFirestore } from "../firebase/config"
import { getDocs, query, where, collection } from "firebase/firestore"
import getUser from "./getUser.js";
// TODO fix it
// check when unsub must be called
let error = ref(null)
let { user } = getUser()

const userDoc = computed(async () => {
    if(user.value){
        console.log(user.value)
        try {
            const q = query(collection(projectFirestore, 'users'), where('userID', '==', user.value.uid))
            const querySnapshot = await getDocs(q) 
            console.log(querySnapshot)
            if(querySnapshot.empty) return { role: null, org: null, suborg: null }
            const document = querySnapshot.docs.at(0).data();
            console.log(document.org, document.role, document.suborg)
            return {
                role: document.role,
                org: document.org,
                suborg: document, suborg
            }
        } catch (err) {
            error.value = err.message
            return { role: null, org: null, suborg: null }
        }
    } else {
        return { role: null, org: null, suborg: null }
    }
})

watch(userDoc, (userDoc, prevUserDoc) => {
    console.log(userDoc)
})

const getUserDoc = () => {
    return { userDoc } 
}

export default getUserDoc