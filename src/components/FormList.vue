<template>
    <div class="list-group" v-if="templates">
        <div class="list-group-item list-group-item-action py-3" v-for="template in templates" :key="template.id">
            <div class="d-flex w-100 justify-content-between">
                <div class="mb-1 fw-bold">{{ template.name }}</div>
                <div>{{ format(template.createdAt.toDate(), 'dd/MM/yy') }}</div>
            </div>
            <div class="d-flex justify-content-center">
                <div class="btn-group mt-2">
                    <button v-if="userDoc.role === 'admin' || userDoc.role === 'super'" class="btn btn-secondary btn-sm" @click="handleDelete(template.id)">Delete Template</button>
                    <router-link role="button" :to="{name: 'SingleForm', params: {id: template.id}}" class="btn btn-secondary btn-sm" >View Template</router-link>
                    <router-link role="button" class="btn btn-secondary btn-sm" :to="{name: 'Response', params:{id: template.id}}">Submit Response</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import useDocument from '../composables/useDocument'
import { format } from 'date-fns/esm'
import { computed } from "vue";
import { useStore } from "vuex";
import getCollection from "../composables/getCollection";

export default {
    setup(){
        const store = useStore()
        const { documents: templates, error } = getCollection('templates', ['org', '==', store.getters.userDoc.org])
        // const templates = computed(() => {
        //     if(store.state.userDoc.role){
        //         console.log('sfsdfsdf')
        //         const { documents, error } =  getCollection('templates', ['org', '==', store.state.userDoc.org])
        //         return documents
        //     } else {
        //         return ref(null)
        //     }
        //     // console.log(userDoc.value.org)
        //     // if(userDoc.value.org){
        //     //     const q = query(collection(projectFirestore, 'templates'), where('org', '==', userDoc.value.org))
        //     //     console.log(q)
        //     //     const querySnapshot = await getDocs(q)
        //     //     console.log(querySnapshot)
        //     //     if(querySnapshot.empty) return []
        //     //     console.log(querySnapshot)
        //     //     if(userDoc.value.role != 'super') return querySnapshot.docs.filter((document) => {
        //     //         return document.data().org == userDoc.value.org
        //     //     }).map(document => {
        //     //         return {...document.data(), id: document.id}
        //     //     })
        //     // } else {
        //     //     console.log('sdflskf')
        //     //     return []
        //     // }
        // })
        // watchEffect(() => {
        //     console.log(refs)
        // })
        const handleDelete = (id) => {
            const { deleteDocument } = useDocument('templates', id)
            deleteDocument()
        }
        return { templates, handleDelete, format,
            user: computed(() => store.state.user),
            userDoc: computed(() => store.state.userDoc)
        }
    }
}
</script>