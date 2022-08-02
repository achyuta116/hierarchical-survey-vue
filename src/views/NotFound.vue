<template>
  <div class="container not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <router-link to="/">Click to head back to home page</router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
  .not-found h1{
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    color: grey;
    margin: -10px 0 -30px;
    font-size: calc(17vw + 40px);
    opacity: 0.8;
    letter-spacing: -17px;
  }

  .not-found p {
    opacity: 0.8;
    font-size: 20px;
    margin: 8px 0 38px 0;
    font-weight: bold;
  }

  .not-found a {
    font-size: 35px;
    color: grey;
    text-decoration: underline;
  }
</style>