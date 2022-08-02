<template>
    <div class="container-sm">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-7 col-md-9 col-11">
                <div v-if="template">
                    <h3 class="text-center my-3 text-secondary fw-bold">{{ template.name }}</h3>
                    <div class="lead text-center text-muted">{{ format(template.createdAt.toDate(), 'dd/MM/yy') }}</div>
                    <ol class="list-group list-group-numbered my-3">
                        <li class="list-group-item d-flex align-items-start justify-content-between" v-for="(question, index) in template.questions" :key="index">
                            <div class="ms-1 me-auto">
                                <div class="fw-bold">{{ question.question }}</div>
                                <ul class="mt-1" v-if="question.type === 'MCQ' || question.type === 'SEL'">
                                    <div v-for="(option, index) in question.options" :key="index">
                                        <li v-if="option !== ''">{{option}}</li>
                                    </div>
                                </ul>
                            </div>
                            <span class="badge bg-primary rounded-pill mt-1">{{ question.type }}</span>
                        </li>
                    </ol>
                </div>
                <div v-else class="spinner"></div>
            </div>
        </div>
    </div>
</template>

<script>
import getDocument from '../composables/getDocument'
import { format } from 'date-fns/esm'
import { useRouter } from 'vue-router'
export default {
    props: ['id'],
    setup(props){
        const { document: template } = getDocument('templates', props.id)
        const router = useRouter()
        setTimeout(() => {
            if(!template.value)
                router.push('/404')
        }, 5000)
        return { template, format }
    }
}
</script>

<style>

</style>