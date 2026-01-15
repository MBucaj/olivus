<template>
  <NavBar />
  <div class="container" style="margin-top: 80px;">
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar
  }
}
</script>
