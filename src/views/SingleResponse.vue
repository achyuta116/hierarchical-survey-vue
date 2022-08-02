<template>
    <div class="container-sm">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <div v-if="response">
                    <h3 class="text-center my-3 text-secondary fw-bold">{{ response.userName }} - {{ format(response.createdAt.toDate(),'dd/MM/yy hh:mm') }}</h3>
                    <div class="lead text-center text-muted">{{ response.formName }} - {{ format(response.formCreatedAt.toDate(), 'dd/MM/yy') }}</div>
                    <ul class="list-group my-3">
                        <li class="list-group-item" v-for="(questionAnswer,index) in response.response" :key="index">
                            <div>
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="fw-bold">
                                        <input type="checkbox" v-if="questionAnswer.type === 'CHK'" class="form-check-input mx-1" :id="questionAnswer.question+index" :checked="questionAnswer.answer === 'on'" disabled>
                                        {{ index + 1 }}. {{ questionAnswer.question }}
                                    </div>
                                    <span class="badge bg-primary rounded-pill mt-1">{{ questionAnswer.type }}</span>
                                </div>
                                <div v-if="questionAnswer.type === 'MCQ' || questionAnswer.type === 'SEL'">
                                    <div class="form-check mt-1" v-for="(option, index) in questionAnswer.options" :key="index">
                                        <div v-if="option !== ''"> 
                                            <input class="form-check-input" :id="questionAnswer.question+index" type="radio" :checked="option === questionAnswer.answer" disabled>
                                            <label class="form-check-label" :for="questionAnswer.question+index">{{ option }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div style="overflow-x: hidden; overflow-y: scroll;" v-else-if="questionAnswer.type === 'QA' || questionAnswer.type === 'EM'">
                                    {{ questionAnswer.answer }}
                                </div>
                                <div style="overflow-x: hidden; overflow-y: scroll;" v-else-if="questionAnswer.type === 'FIL'">
                                    <a :href="questionAnswer.answer" target="_blank">
                                        {{ questionAnswer.answer }}
                                    </a>
                                </div>
                                <div v-else-if="questionAnswer.type === 'DAT'">
                                    {{ questionAnswer.answer.toDate().toLocaleDateString() }}
                                </div>
                                <div v-else-if="questionAnswer.type === 'TIM'">
                                    {{ questionAnswer.answer.toDate().toLocaleTimeString() }}
                                </div>
                                <div v-else-if="questionAnswer.type === 'DTE'">
                                    {{ questionAnswer.answer.toDate().toLocaleString() }}
                                </div>
                                <div v-else-if="questionAnswer.type === 'MUL'">
                                    {{ questionAnswer.answer }}
                                </div>
                            </div>
                        </li>
                    </ul> 
                </div>
                <div v-else class="spinner"></div>     
            </div>
        </div>
    </div>
</template>

<script>
import getDocument from "../composables/getDocument";
import { format } from 'date-fns/esm'
import { useRouter } from 'vue-router';
export default {
    props:['id'],
    setup(props){
        const { document:response, error } = getDocument('responses', props.id)
        const router = useRouter()
        setTimeout(() => {
            if(!response.value)
                router.push('/404')
        }, 5000)
        return { response, error, format }
    }
}
</script>

<style>

</style>