import { ref } from 'vue'
import { deleteObject, getDownloadURL, ref as firebaseRef, uploadBytes } from '@firebase/storage';
import { projectStorage } from "../firebase/config";
import getUser from './getUser'

const { user } = getUser()

const useStorage = () => {
    const error = ref(null)
    const url = ref(null)
    const filePath = ref(null)

    const uploadFile = async (file, org, suborg) => {
        filePath.value = `${org}/${suborg}/${user.value.uid}/${file.name}`
        const storageRef = firebaseRef(projectStorage, filePath.value)
        try {
            await uploadBytes(storageRef, file)
            url.value = await getDownloadURL(storageRef)
            error.value = null
        } catch(err) {
            console.log(err.message)
            error.value = err.message
        }
    }

    const deleteImage = async (path) => {
        const imageRef = firebaseRef(projectStorage, path)
        try {
            await deleteObject(imageRef)
        } catch (err) {
            console.log(err.message)
            error.value = err.message
        }
    }

    return {
        url, filePath, error, uploadFile, deleteImage
    }
}

export default useStorage