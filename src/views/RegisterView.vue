<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Registracija</h2>
      <p class="auth-subtitle">Kreiraj račun i rezerviraj termin u uljari.</p>

      <form class="auth-form" @submit.prevent="register">
        <div class="auth-field">
          <label class="auth-label">Ime i prezime</label>
          <input
            class="auth-input"
            v-model="imePrezime"
            type="text"
            placeholder="npr. Ana Anić"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">Email</label>
          <input
            class="auth-input"
            v-model="email"
            type="email"
            placeholder="npr. ana@mail.com"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">Lozinka</label>
          <input
            class="auth-input"
            v-model="lozinka"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">Potvrdi lozinku</label>
          <input
            class="auth-input"
            v-model="potvrdiLozinku"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="auth-btn ol-btn ol-btn-primary w-100">
          Registriraj se
        </button>

        <div class="auth-footer">
          <span>Već imaš račun?</span>
          <router-link to="/login">Prijava</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'register',
  data() {
    return {
      imePrezime: "",
      email: "",
      lozinka: "",
      potvrdiLozinku: "",
    };
  },
  methods: {
    async register() {
      if (this.lozinka !== this.potvrdiLozinku) {
        alert("Lozinke se ne podudaraju!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.lozinka);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: this.email,
          displayName: this.imePrezime,
          role: 'user',
          uljaraId: null,
          createdAt: serverTimestamp()
        });

        alert("Uspješna registracija!");
        this.$router.push('/dashboard');

      } catch (error) {
        console.error("Došlo je do greške:", error);
        alert("Greška: " + error.message);
      }
    }
  }
};
</script>
