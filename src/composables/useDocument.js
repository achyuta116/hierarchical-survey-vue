import { projectFirestore } from "../firebase/config";
import { ref } from 'vue'
import { doc, deleteDoc, updateDoc } from '@firebase/firestore'

const useDocument = (collectionName, documentId) => {
    const error = ref(null)
    const isPending = ref(false)
    let docRef = doc(projectFirestore, collectionName, documentId)

    const deleteDocument = async () => {
        error.value = null
        isPending.value = true

        try {
            const res = await deleteDoc(docRef)
            isPending.value = false
            return res
        } catch (err) {
            console.log(err.message)
            error.value = 'Could not delete the document'
            isPending.value = false
        }
    }

    const updateDocument = async (updates) => {
        error.value = null
        isPending.value = true

        try {
            const res = await updateDoc(docRef, updates)
            isPending.value = false
            return res
        } catch (err) {
            console.log(err.message)
            error.value = 'Could not update the document'
            isPending.value = false
        }
    }

    return { error, isPending, deleteDocument, updateDocument }
}

export default useDocument