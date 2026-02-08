<template>
  <div class="success-page">
    <div class="success-card">
      <img
        src="@/assets/logo.png"
        alt="Olivus logo"
        class="success-logo"
      />

      <h2 class="success-title">Uspješno ste rezervirali termin!</h2>

      <p class="success-text">
        Vaša rezervacija je spremljena. Možete je pregledati u svojim rezervacijama.
      </p>

      <div class="d-grid gap-2 mt-4">
        <router-link to="/my-reservations" class="btn btn-primary">
          Moje rezervacije
        </router-link>
        <router-link to="/dashboard" class="btn btn-outline-secondary">
          Povratak na početnu
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleSuccessView"
};
</script>

<style scoped>
.success-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}

.success-card {
  background-color: #f5f5f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.success-logo {
  width: 120px;
  margin-bottom: 24px;
}

.success-title {
  color: #334214;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.success-text {
  color: #666;
  margin-bottom: 0;
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
