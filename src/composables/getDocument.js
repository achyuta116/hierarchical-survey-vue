import { doc, onSnapshot } from "@firebase/firestore"
import { projectFirestore } from "../firebase/config"
import { ref, watchEffect } from "vue"
const getDocument = (collectionName ,documentId) => {

    const document = ref(null)
    const error = ref(null)

    // register the firestore collection reference
    const unsub = onSnapshot(doc(projectFirestore, collectionName, documentId), (snap) => {
        if(snap.data()){
            document.value = {...snap.data(), id: snap.id}
            error.value = null     
        } else {
            error.value = 'that document does not exist'
        }
    },
    err => {
        console.log(err.message)
        document.value = null
        error.value = 'could not fetch the data'
    })

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, document }
}

export default getDocument