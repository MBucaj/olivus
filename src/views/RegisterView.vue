<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Registracija</h2>
      <p class="auth-subtitle">Kreiraj račun i rezerviraj termin u uljari.</p>

      <form class="auth-form">
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

        <button type="button" @click="register" class="auth-btn ol-btn ol-btn-primary w-100">
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

import { firebase } from '@/firebase';


  export default {
    name:'register',
    data() {
      return {
        imePrezime: "", 
        email: "", 
        lozinka: "", 
        potvrdiLozinku: "", 

      };
    },
    methods: {
      register() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.lozinka).then(
          function(){
            console.log("Uspješna registracija"); 
          
          }
        ).catch( function () {
          console.error ("Došlo je do greške", error); 
        }); 
      }
    }
  }; 

</script>