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

    <!-- Količina u tonama -->
    <div class="mb-3">
      <label class="form-label">Količina</label>
      <input
        type="number"
        class="form-control"
        v-model="kolicina"
        placeholder="Upiši količinu (u tonama)"
        min="0"
        step="0.1"
      />
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

    <!-- Gumb Dalje -->
    <div class="d-grid">
      <button class="btn btn-primary btn-lg" @click="dalje">Dalje</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleView",
  data() {
    return {
      uljara: "",
      kolicina: "",
      datum: ""
    };
  },
  methods: {
    dalje() {
      if (!this.uljara || !this.kolicina || !this.datum) {
        alert("Molimo popunite sva polja!");
        return;
      }

      this.$router.push({
        name: "scheduleConfirm",
        query: {
          uljara: this.uljara,
          kolicina: this.kolicina,
          datum: this.datum
        }
      });
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
