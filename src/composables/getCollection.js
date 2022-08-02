import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'
import { onSnapshot, collection, orderBy, query, where } from "firebase/firestore";


const getCollection = (collectionName, queryQ) => {

  const documents = ref(null)
  const error = ref(null)
  let collectionRef = collection(projectFirestore, collectionName)
  if(queryQ){
    collectionRef = query(collectionRef, where(...queryQ))
  }
  // register the firestore collection reference
  const unsub = onSnapshot(collectionRef, orderBy('createdAt'), (snap) => {
    let results = []
    snap.docs.forEach(doc => {
      // must wait for the server to create the timestamp & send it back
      doc.data().createdAt && results.push({...doc.data(), id: doc.id})
    })
      documents.value = results
      error.value = null 
  },
  err => {
    console.log(err.message)
    documents.value = null
    error.value = 'could not fetch the data'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, documents }
}

export default getCollection