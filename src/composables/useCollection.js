import { addDoc, collection } from '@firebase/firestore'
import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'

const useCollection = (collectionName) => {

  const error = ref(null)
  const isPending = ref(false)
  // add a new document
  const addDocument = async (doc) => {
    error.value = null
    isPending.value = true
    try {
        const res = await addDoc(collection(projectFirestore, collectionName), doc)
        isPending.value = false
        return res
    } catch(err) {
        console.log(err)
        error.value = 'Could not send message'
        isPending.value = false
    }
  }

  return { error, addDocument, isPending }

}

export default useCollection