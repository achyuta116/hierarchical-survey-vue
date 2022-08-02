<template>
  <div class="container-sm">
    <div class="row justify-content-center align-items-center">
      <div class="col-lg-7 col-md-9 col-11">
        <h1 class="text-center my-3">Home Page</h1>
        <FormList/>
      </div>
    </div>
  </div>
</template>

<script>
import FormList from '../components/FormList.vue'
export default {
  name: 'Home',
  components: {FormList}
}
</script>
