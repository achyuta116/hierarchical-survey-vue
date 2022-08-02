<template>
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: { Navbar },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.spinner {
	display: block;
	width: 40px;
	height: 40px;
	margin: 30px auto;
	border: 3px solid transparent;
	border-radius: 50%;
	border-top-color: #ff8800;
	animation: spin 1s ease infinite;
}

@keyframes spin {
	to {
	transform: rotateZ(360deg);
	}
}
</style>
