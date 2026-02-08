<template>
  <div class="schedule-page">
    <h2 class="mb-4">Rezerviraj termin</h2>

    <!-- Odabir uljare -->
    <div class="mb-3">
      <label class="form-label">Odaberi uljaru</label>
      <div class="input-group">
        <select class="form-select" v-model="uljara">
          <option value="" disabled selected>Odaberi uljaru...</option>
          <option value="agrolaguna">Agrolaguna (Poreč)</option>
          <option value="oleum-maris">Oleum Maris (Novigrad)</option>
          <option value="vodnjan">Uljara Vodnjan (Vodnjan)</option>
          <option value="chiavalon">Chiavalon</option>
        </select>
      </div>
    </div>

    <!-- Količina u kilogramima -->
    <div class="mb-3">
      <label class="form-label">Količina (kg)</label>
      <input
        type="number"
        class="form-control"
        v-model="kolicina"
        placeholder="Upiši količinu u kilogramima"
        min="0"
        step="1"
      />
      <small class="text-muted">Možete napisati približnu količinu ako ne znate točno</small>
    </div>

    <!-- Odabir datuma -->
    <div class="mb-4">
      <label class="form-label">Odaberi datum</label>
      <input
        type="date"
        class="form-control"
        v-model="datum"
      />
    </div>

    <!-- Error poruka -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Gumb Dalje -->
    <div class="d-grid">
      <button
        class="btn btn-primary btn-lg"
        @click="dalje"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? 'Spremam...' : 'Rezerviraj' }}
      </button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: "ScheduleView",
  data() {
    return {
      uljara: "",
      kolicina: "",
      datum: "",
      loading: false,
      errorMessage: ""
    };
  },
  methods: {
    async dalje() {
      // Validacija polja
      if (!this.uljara || !this.kolicina || !this.datum) {
        this.errorMessage = "Molimo popunite sva polja!";
        return;
      }

      // Provjera da li je korisnik ulogovan
      if (!auth.currentUser) {
        this.errorMessage = "Morate biti ulogovani da rezervišete termin!";
        this.$router.push('/login');
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      try {
        // Spremi rezervaciju u Firestore
        const docRef = await addDoc(collection(db, 'reservations'), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          uljara: this.uljara,
          kolicina: parseFloat(this.kolicina),
          datum: this.datum,
          status: 'pending', // pending, confirmed, cancelled
          createdAt: serverTimestamp()
        });

        console.log("Rezervacija uspješno kreirana:", docRef.id);

        // Resetuj formu
        this.uljara = "";
        this.kolicina = "";
        this.datum = "";

        // Preusmjeri na "Moje rezervacije"
        alert("Rezervacija uspješno kreirana!");
        this.$router.push('/my-reservations');

      } catch (error) {
        console.error("Greška prilikom kreiranja rezervacije:", error);
        this.errorMessage = "Došlo je do greške. Pokušajte ponovo.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.schedule-page {
  max-width: 500px;
  margin: 0 auto;
}

.btn-primary {
  background-color: #334214;
  border-color: #334214;
}

.btn-primary:hover {
  background-color: #2a360f;
  border-color: #2a360f;
}
</style>
