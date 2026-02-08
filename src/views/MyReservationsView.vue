<template>
  <div class="reservations-page">
    <h2 class="mb-4">Moje rezervacije</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Učitavanje...</span>
      </div>
    </div>

    <!-- Nema rezervacija -->
    <div v-else-if="rezervacije.length === 0" class="text-center py-5">
      <p class="text-muted">Nemate nijednu rezervaciju.</p>
      <router-link to="/schedule" class="btn btn-primary">Rezerviraj termin</router-link>
    </div>

    <!-- Lista rezervacija -->
    <div v-else class="reservations-list">
      <div class="reservation-card" v-for="rez in rezervacije" :key="rez.id">
        <div class="reservation-item">
          <span class="reservation-label">Datum</span>
          <span class="reservation-value">{{ formatDatum(rez.datum) }}</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Vrijeme</span>
          <span class="reservation-value">{{ rez.vrijeme }}</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Količina</span>
          <span class="reservation-value">{{ rez.kolicina }} tona</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Uljara</span>
          <span class="reservation-value">{{ getUljaraName(rez.uljara) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default {
  name: "MyReservationsView",
  data() {
    return {
      rezervacije: [],
      loading: true
    };
  },
  mounted() {
    this.dohvatiRezervacije();
  },
  methods: {
    async dohvatiRezervacije() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "rezervacije"),
          where("userId", "==", user.uid),
          orderBy("datum", "desc")
        );

        const snapshot = await getDocs(q);
        this.rezervacije = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Greška pri dohvaćanju rezervacija:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDatum(datum) {
      if (!datum) return "";
      const [year, month, day] = datum.split("-");
      return `${day}.${month}.${year}.`;
    },
    getUljaraName(uljara) {
      const uljare = {
        agrolaguna: "AGROLAGUNA",
        "oleum-maris": "OLEUM MARIS",
        vodnjan: "ULJARA VODNJAN",
        chiavalon: "CHIAVALON"
      };
      return uljare[uljara] || uljara.toUpperCase();
    }
  }
};
</script>

<style scoped>
.reservations-page {
  max-width: 500px;
  margin: 0 auto;
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reservation-card {
  background-color: #f5f5f0;
  border-radius: 12px;
  padding: 20px;
}

.reservation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.reservation-item:last-child {
  margin-bottom: 0;
}

.reservation-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.reservation-value {
  background-color: #334214;
  color: white;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 500;
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
