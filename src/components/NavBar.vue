<template>
  <nav class="navbar fixed-top olivus-navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Olivus</router-link>

      <ul v-if="currentUser" class="navbar-nav flex-row gap-3 align-items-center">
        <li class="nav-item">
          <router-link class="nav-link" to="/dashboard">Početna</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/schedule">Rezerviraj termin</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/my-reservations">Moje rezervacije</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/admin">Admin</router-link>
        </li>

        <li class="nav-item">
          <button class="btn btn-outline-light btn-sm" @click="logout">Odjava</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import store from '@/stores/store';

export default {
  name: "NavBar",
  computed: {
    currentUser() {
      return store.currentUser;
    }
  },
  methods: {
    logout() {
      signOut(auth)
        .then(() => {
          this.$router.push('/');
        })
        .catch((error) => {
          alert('Greška: ' + error.message);
        });
    }
  }
};
</script>

<style scoped>
.olivus-navbar {
  background-color: #334214;
}

.olivus-navbar .navbar-brand,
.olivus-navbar .nav-link {
  color: white;
}

.olivus-navbar .nav-link:hover {
  color: #e6e6e6;
}
</style>
