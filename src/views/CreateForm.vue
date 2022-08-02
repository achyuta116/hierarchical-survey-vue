<template>
    <div class="container-sm">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <h3 class="text-center my-2 text-secondary">Create Form</h3>
                <form @submit.prevent="handleSubmit">
                    <div class="row justify-content-center">
                        <div>
                            <input class="form-control mb-2" type="text" placeholder="Form Name" v-model="name" required>
                        </div>
                        <div v-for="(question, index) in questions" :key="index">
                            <span v-if="question.type == 'QA'">
                                <div class="input-group">
                                    <input class="form-control mt-1 mb-2" type="text" placeholder="Enter Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </span>
                            <span v-if="question.type == 'EM'">
                                <div class="input-group">
                                    <span class="input-group-text my-1">
                                            <span class="fw-bold">@</span>
                                    </span>
                                    <input class="form-control mt-1 mb-2" type="email" placeholder="Enter Email Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </span>
                            <span v-else-if="question.type == 'MCQ'">
                                <div class="input-group">
                                    <input class="form-control my-1" type="text" placeholder="Enter Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                                <div>
                                    <div class="input-group">
                                        <span class="input-group-text my-1">
                                            <span class="fw-bold">A</span>
                                        </span>
                                        <input class="form-control my-1 col" type="text" placeholder="Option 1" v-model="question.options[0]" requried>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-text my-1">
                                            <span class="fw-bold">B</span>
                                        </span>
                                        <input class="form-control my-1 col" type="text" placeholder="Option 2" v-model="question.options[1]" required>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-text my-1">
                                            <span class="fw-bold">C</span>
                                        </span>
                                        <input class="form-control my-1 col" type="text" placeholder="Option 3" v-model="question.options[2]">
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-text my-1">
                                            <span class="fw-bold">D</span>
                                        </span>
                                        <input class="form-control my-1 col" type="text" placeholder="Option 4" v-model="question.options[3]">
                                    </div>
                                </div>
                            </span>
                            <div v-else-if="question.type === 'MUL'">
                                <div class="input-group">
                                    <span class="input-group-text my-1">
                                        <i class="bi bi-body-text fw-bold text-secondary"></i>
                                    </span>
                                    <input class="form-control my-1 col" type="text" placeholder="Enter Multiline Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'CHK'">
                                <div class="input-group">
                                    <span class="input-group-text my-1">
                                        <i class="bi bi-check-square fw-bold text-secondary"></i>
                                    </span>
                                    <input class="form-control my-1 col" type="text" placeholder="Enter Checkbox Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'SEL'">
                                <div class="input-group">
                                    <input class="form-control my-1 col" type="text" placeholder="Enter Dropdown Question" v-model="question.question" required>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                                <div v-for="option, index in question.options" :key="index" class="row justify-content-center align-items-center">
                                    <div class="col-8">
                                        <input class="form-control" type="text" placeholder="Option" v-model="question.options[index]" requried>
                                    </div>
                                    <div class="col-4">
                                        <button class="btn btn-secondary my-1" @click.prevent="question.options.splice(index, 1)">Delete Option</button>
                                    </div>
                                </div>
                                <div class="mt-1 d-flex justify-content-center">
                                    <button class="btn btn-secondary" @click.prevent="question.options.push('')">Add Option</button>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'DAT'">
                                <input class="form-control my-1" type="text" placeholder="Enter Date Question" v-model="question.question" required>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'TIM'">
                                <input class="form-control my-1" type="text" placeholder="Enter Date Question" v-model="question.question" required>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'DTE'">
                                <input class="form-control my-1" type="text" placeholder="Enter Date Question" v-model="question.question" required>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div v-else-if="question.type === 'FIL'">
                                <input class="form-control my-1" type="text" placeholder="Enter File Question" v-model="question.question" required>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" v-model="question.mandatory">
                                    <label class="form-check-label">Mandatory</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center my-2">
                                <button @click.prevent="deleteQuestion(index)" class="btn btn-secondary">Delete Question</button>
                            </div>
                        </div>
                        <div>
                            <label>Type:</label>
                            <select v-model="type" class="form-select my-2">
                                <option value="QA">Q & A</option>
                                <option value="MCQ">MCQ</option>
                                <option value="MUL">Multiline</option>
                                <option value="CHK">Checkbox</option>
                                <option value="EM">Email</option>
                                <option value="SEL">Select Dropdown</option>
                                <option value="DAT">Date Input</option>
                                <option value="TIM">Time Input</option>
                                <option value="DTE">DateTime Input</option>
                                <option value="FIL">File Input</option>
                            </select>
                            <div class="d-flex justify-content-center mb-3">
                                <button @click.prevent="addQuestion" class="btn btn-secondary">Add new question</button>
                            </div>
                        </div>
                        <div class="text-danger d-flex justify-content-center">{{ error }}</div>
                        <div class="text-danger d-flex justify-content-center">{{ validationError }}</div>
                        <div class="d-flex justify-content-center"><button class="btn btn-secondary w-100">Submit Template</button></div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import useCollection from '../composables/useCollection'
import { useRouter } from 'vue-router'
import { serverTimestamp } from '@firebase/firestore'
import { useStore } from "vuex";

export default {
    setup(){
        const {addDocument, error} = useCollection('templates')
        const store = useStore()
        const userDoc = store.getters.userDoc
        const questions = ref([])
        const type = ref('QA')
        const name = ref('')
        const validationError = ref(null)
        const router = useRouter()

        const addQuestion = () => {
            if(type.value === "QA"){
                questions.value.push({
                    type: 'QA',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === "MCQ"){
                questions.value.push({
                    type: 'MCQ',
                    question: '',
                    options: ['', '', '', ''],
                    mandatory: true
                })
            } else if(type.value === "MUL"){
                questions.value.push({
                    type: 'MUL',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === "CHK"){
                questions.value.push({
                    type: 'CHK',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === 'EM'){
                questions.value.push({
                    type: 'EM',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === 'SEL'){
                questions.value.push({
                    type: 'SEL',
                    question: '',
                    options: [],
                    mandatory: true
                })
            } else if(type.value === 'DAT'){
                questions.value.push({
                    type: 'DAT',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === 'TIM'){
                questions.value.push({
                    type: 'TIM',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === 'DTE'){
                questions.value.push({
                    type: 'DTE',
                    question: '',
                    mandatory: true
                })
            } else if(type.value === 'FIL'){
                questions.value.push({
                    type: 'FIL',
                    question: '',
                    mandatory: true
                })
            }
        }
        const deleteQuestion = (index) => {
            questions.value.splice(index, 1);
        }

        const handleSubmit = () => {
            validationError.value = null
            if(questions.value.length === 0){
                validationError.value = 'Add at least one question'
            }
            questions.value.forEach((element, index) => {
                if(element.type === 'MCQ'){
                    if(element.options[3] && !element.options[2] && !validationError.value){
                        validationError.value = `Enter the third option for question ${index + 1}`
                    }
                } else if(element.type === 'SEL'){
                    element.options.forEach((option, oindex) => {
                        if(!option) validationError.value = `Enter an option for option ${oindex + 1} question ${index + 1}`
                    })
                }
            })
            if(!validationError.value){
                addDocument({name: name.value, questions: questions.value, createdAt: serverTimestamp(), org: userDoc.org, subord: userDoc.suborg})
                if(!error.value){
                    router.push('/')
                }
            }
        }
        return { questions, type, deleteQuestion, addQuestion, name, handleSubmit, validationError, error }
    }
}
</script>

<style>

</style>