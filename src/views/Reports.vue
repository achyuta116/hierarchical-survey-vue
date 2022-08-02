<template>
    <div class="container-md">
        <div class="row justify-content-center align-items center">
            <div class="col-lg-7 col-md-9 col-11">
                <div v-if="uniqueFormIds">
                    <select class="form-select my-4" v-model="selection" required>
                        <option value="select-form">Select a form</option>
                        <option :value="id.id" v-for="id in uniqueFormIds" :key="id.id">{{ id.name }}</option>
                    </select>
                    <div class="text-center">
                        <button class="btn btn-secondary my-2" v-if="selection !== 'select-form'" @click="handleDownload">Download Excel</button>
                    </div>
                    <div class="list-group" v-if="filteredResults">
                        <router-link class="list-group-item list-group-item-action py-3" :to="{name: 'SingleResponse', params: {id: response.id}}" v-for="response in filteredResults" :key="response.id">
                            <div class="d-flex justify-content-between">
                                <div class="mb-1 fw-bold">{{ response.userName }}</div>
                                <div>{{ format(response.createdAt.toDate(), 'dd/MM/yy hh:mm:ss') }}</div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <router-link role="button" :to="{name: 'SingleResponse', params: {id: response.id}}" class="btn btn-secondary" >View Response</router-link>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from '@vue/reactivity'
import { format } from 'date-fns/esm'
import { useStore } from 'vuex'
import * as XLSX from "xlsx";
import getCollection from '../composables/getCollection'
export default {
    setup(){
        const store = useStore()
        const userDoc = store.getters.userDoc
        const { documents: responses, error } = getCollection('responses', ['org', '==', userDoc.org])
        const selection = ref('select-form')
        const filteredResults = computed(() => {
            if(selection.value === 'select-form') return []
            return responses.value.filter((response) => {
                return response.formID === selection.value
            }).map(response => {
                return {...response, ...response.response}
            })
        });
        const handleDownload = () => {
            const formattedResponses = filteredResults.value.map((response) => {
                response.createdAt = response.createdAt.toDate()
                response.formCreatedAt = response.formCreatedAt.toDate()

                return response
            }).map(response => {
                let obj = {}
                obj['createdAt'] = response.createdAt
                obj['formCreatedAt'] = response.formCreatedAt
                obj['responsee'] = response.userName
                response.response.forEach((element, index) => {
                    if(element.type === 'DAT'){
                        obj[`${index}>` + element.question] = element.answer.toDate().toLocaleDateString()
                    } else if(element.type === 'DTE'){
                        obj[`${index}>` + element.question] = element.answer.toDate()
                    } else if(element.type === 'TIM'){
                        obj[`${index}>` + element.question] = element.answer.toDate().toLocaleTimeString()
                    }
                    else obj[`${index}>` + element.question] = element.answer
                })
                return obj
            })
            let ws = XLSX.utils.json_to_sheet(formattedResponses)
            let wb = XLSX.utils.book_new()
            const name = responses.value.filter((response) => {
                return response.formID === selection.value
            })[0].formName
            XLSX.utils.book_append_sheet(wb, ws, name)
            XLSX.writeFile(wb, 'reports.xlsx')
        }
        const uniqueFormIds = computed(() => {
            let ids = new Set();
            if(!responses.value) return []
            responses.value.map((element) => {
                ids.add(JSON.stringify({id: element.formID, name: element.formName}))
            })
            return [...ids].map(element => JSON.parse(element))
        })
        return { filteredResults, selection, format, uniqueFormIds, handleDownload }
    }
}
</script>

<style>

</style>