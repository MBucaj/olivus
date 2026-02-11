<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Prijava</h2>
      <p class="auth-subtitle">Prijavi se da rezerviraš termin u uljari.</p>

      <form class="auth-form" @submit.prevent="login">
        <div class="auth-field">
          <label class="auth-label">Email</label>
          <input
            v-model="email"
            class="auth-input"
            type="email"
            placeholder="npr. ana@mail.com"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">Lozinka</label>
          <input
            v-model="lozinka"
            class="auth-input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="auth-btn ol-btn ol-btn-primary w-100">
          Prijava
        </button>

        <div class="auth-footer">
          <span>Nemaš račun?</span>
          <router-link to="/register">Registracija</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      lozinka: '',
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.lozinka);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.role === 'admin') {
            this.$router.replace('/admin');
          } else {
            this.$router.replace('/dashboard');
          }
        } else {
          this.$router.replace('/dashboard');
        }

      } catch (error) {
        alert('Greška: ' + error.message);
      }
    },
  },
};
</script>
