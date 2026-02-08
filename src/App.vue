<template>
  <NavBar />
  <div class="container" style="margin-top: 80px;">
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import store from '@/stores/store';

export default {
  components: {
    NavBar
  },
  mounted() {
    onAuthStateChanged(auth, (currentUser) => {
      store.currentUser = currentUser; // Spremi cijeli user objekt, ne samo email
    });
  }
}
</script>
