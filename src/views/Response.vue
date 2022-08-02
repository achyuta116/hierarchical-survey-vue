<template>
    <div class="container-sm" v-if="template">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <h3 class="text-center my-3 text-secondary fw-bold">{{ template.name }}</h3>
                <div class="lead text-center text-muted">{{ format(template.createdAt.toDate(), 'dd/MM/yy') }}</div>        
                <form v-if="template" @submit.prevent class="my-3">
                    <div class="list-group list-group-numbered">
                        <div class="list-group-item py-3" v-for="(question, index) in template.questions" :key="index">
                            <div v-if="question.type === 'MCQ'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <div class="form-check" v-for="(option, index) in question.options" :key="index">
                                    <input :id="question.question+index" class="form-check-input" type="radio" :name="index" v-if="option" @change="() => updateResponse(index, option, question.type, question.options)" :value="option" :required="question.mandatory">
                                    <label :for="question.question+index" class="form-check-label" v-if="option">{{option}}</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'QA'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <div class="input-group">
                                    <span class="input-group-text text-secondary">
                                        <i class="bi bi-chat-fill"></i>
                                    </span>
                                    <input class="form-control" :id="index" type="text" placeholder="Enter answer" @change="(e) => updateResponse(index, e.target.value, question.type, [])" :required="question.mandatory">
                                </div>
                            </div>
                            <div v-else-if="question.type === 'EM'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <div class="input-group">
                                    <span class="input-group-text text-secondary">
                                        <i class="bi bi-chat-fill"></i>
                                    </span>
                                    <input class="form-control" :id="index" type="email" placeholder="Enter answer" @change="(e) => updateResponse(index, e.target.value, question.type, [])" :required="question.mandatory">
                                </div>
                            </div>
                            <div v-else-if="question.type === 'MUL'">
                                <div class="mb-4 mt-5 form-floating">
                                    <textarea class="form-control" :id="index" @change="(e) => updateResponse(index, e.target.value, question.type, [])" style="height: 20px" :required="question.mandatory"></textarea>
                                    <label :for="index">{{ question.question }}</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'CHK'" class="form-check">
                                <input type="checkbox" class="form-check-input" :id="question.question+index" @change="(e) => updateResponse(index, e.target.value, question.type, question.options)" :required="question.mandatory">
                                <label :for="question.question+index" class="form-check-label">{{ question.question }}</label>
                            </div>
                            <div v-else-if="question.type === 'SEL'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <select class="form-select" :id="index" @change="(e) => updateResponse(index, e.target.value, question.type, question.options)" :required="question.mandatory">
                                    <option v-for="option, index in question.options" :key="index">
                                        {{ option }}
                                    </option>
                                </select>
                            </div>
                            <div v-else-if="question.type === 'DAT'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <input type="date" :id="index" class="form-control" @change="(e) => {updateResponse(index, e.target.value, question.type, [])}" :required="question.mandatory">
                            </div>
                            <div v-else-if="question.type === 'TIM'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <input type="time" :id="index" class="form-control" @change="(e) => {updateResponse(index, e.target.value, question.type, [])}" :required="question.mandatory">
                            </div>
                            <div v-else-if="question.type === 'DTE'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <input type="datetime-local" :id="index" class="form-control" @change="(e) => {updateResponse(index, e.target.value, question.type, [])}" :required="question.mandatory">
                            </div>
                            <div v-else-if="question.type === 'FIL'">
                                <label class="form-label" :for="index">{{ question.question }}</label>
                                <input type="file" class="form-control" :id="index" @change="(e) => {updateResponse(index, e.target.files.length !== 0 ? e.target.files[0] : null, question.type, [])}" :required="question.mandatory">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center align-items-center my-3">
                        <button class="btn btn-secondary" @click="handleSubmit">Submit Response</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-else class="spinner"></div>    
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import getDocument from '../composables/getDocument'
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import useCollection from '../composables/useCollection'
import { serverTimestamp, Timestamp } from '@firebase/firestore'
import { format } from 'date-fns/esm'
import { watchEffect } from '@vue/runtime-core'
import { getDownloadURL, ref as firebaseRef, uploadBytes } from "firebase/storage";
import { projectStorage } from "../firebase/config";

export default {
    props: ['id'],
    setup(props){
        const { document: template } = getDocument('templates', props.id)
        const store = useStore()
        const user = store.getters.user
        const userDoc = store.getters.userDoc
        const { addDocument, error } = useCollection('responses')
        const fileError = ref(null)
        const response = reactive(new Map())

        // initial response map setup
        watchEffect(() => {
            if(template.value){
                template.value.questions.forEach((question, index) => {
                    if(question.type === 'MCQ' || question.type === 'SEL')
                        response.set(index, {answer: question.options[0], type: question.type, options: question.options})
                    else if(question.type === 'CHK')
                        response.set(index, {answer: 'off', type: question.type})
                    else if(question.type === 'DAT')
                        response.set(index, {answer: new Date().toLocaleDateString(), type: question.type})
                    else if(question.type === 'TIM')
                        response.set(index, {answer: new Date().toLocaleTimeString(), type: question.type})
                    else if(question.type === 'DTE')
                        response.set(index, {answer: new Date().toLocaleString(), type: question.type})
                    else 
                        response.set(index, {answer: '', type: question.type})
                })
            }
        })
        const router = useRouter()

        setTimeout(() => {
            if(!template.value)
                router.push('/404')
        }, 5000)
        const updateResponse = (index, answer, type, options) => {
            if(type === 'MCQ' || type === 'SEL')
                response.set(index, {answer, type, options})
            else 
                response.set(index, {answer, type})
        }
        const handleSubmit = async () => {
            const confirmation = confirm('Are you sure you want to submit?');
            if(!confirmation) return;
            let responseObject = []
            let fileAnswers = []
            let requiredFilled = true
            response.forEach((answer, index) => {
                if(!answer.answer && template.value.questions[index].mandatory) requiredFilled = false
                if(answer.type === 'MCQ' || answer.type === 'SEL')
                responseObject.push({question: template.value.questions[index].question, answer: answer.answer, type: answer.type, options: answer.options})
                else if(answer.type === 'DTE' || answer.type === 'DAT')
                responseObject.push({question: template.value.questions[index].question, answer: Timestamp.fromDate(new Date(answer.answer)), type: answer.type})
                else if(answer.type === 'TIM')
                    responseObject.push({question: template.value.questions[index].question, answer: Timestamp.fromDate(new Date(new Date().toDateString() + ' ' + answer.answer)), type: answer.type})
                else if(answer.type === 'FIL'){
                    fileAnswers.push({answer, index})
                }
                else
                responseObject.push({question: template.value.questions[index].question, answer: answer.answer, type: answer.type})
            })
            if(!requiredFilled) return;
            if(fileAnswers.length !== 0) {
                await Promise.all(fileAnswers.map(async ({answer, index}) => {
                    if(answer && userDoc.role){
                        console.log(answer)
                        const path = `${userDoc.org}/${userDoc.suborg}/${user.value.uid}/${template.value.id}/${index}/${answer.answer.name}`
                        console.log(path)
                        const storageRef = firebaseRef(projectStorage, path)
                        try {
                            const res = await uploadBytes(storageRef, answer.answer)
                            const url = await getDownloadURL(storageRef)
                            console.log(res)
                            responseObject.push({question: template.value.questions[index].question, answer: url, type: answer.type})
                        } catch(err) {
                            fileError.value = err.message + `Question number ${index + 1}`
                        }
                    } else {
                        responseObject.push({question: template.value.questions[index].question, answer: '', type: answer.type})
                    }
                }))
            }
            if(!error.value && !fileError.value){
                console.log(responseObject)
                await addDocument({
                    response: responseObject,
                    formID: template.value.id,
                    formCreatedAt: template.value.createdAt,
                    formName: template.value.name,
                    userId : user.uid,
                    userName: user.displayName,
                    createdAt: serverTimestamp(),
                    org: userDoc.org,
                    suborg: userDoc.suborg
                })
                router.push('/')
            }
        }
        return {template, response, handleSubmit, updateResponse, format, fileError}
    }
}
</script>

<style>

</style>