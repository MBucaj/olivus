<template>
  <div class="reservations-page">
    <h2 class="mb-4">Moje rezervacije</h2>

    <div v-if="!loading && rezervacije.length > 0" class="sort-bar mb-4">
      <div class="sort-group">
        <label class="sort-label">Sortiraj po:</label>
        <div class="sort-buttons">
          <button
            class="sort-btn"
            :class="{ active: sortBy === 'datum' }"
            @click="setSortBy('datum')"
          >Datumu</button>
          <button
            class="sort-btn"
            :class="{ active: sortBy === 'status' }"
            @click="setSortBy('status')"
          >Statusu</button>
          <button
            class="sort-btn"
            :class="{ active: sortBy === 'kolicina' }"
            @click="setSortBy('kolicina')"
          >Količini</button>
        </div>
      </div>
      <button class="sort-dir-btn" @click="toggleDir">
        {{ sortDir === 'asc' ? '↑ Uzlazno' : '↓ Silazno' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Učitavanje...</span>
      </div>
    </div>

    <div v-else-if="rezervacije.length === 0" class="text-center py-5">
      <p class="text-muted">Nemate nijednu rezervaciju.</p>
      <router-link to="/schedule" class="btn btn-primary">Rezerviraj termin</router-link>
    </div>

    <div v-else class="reservations-list">
      <div class="reservation-card" v-for="rez in sortiraneRezervacije" :key="rez.id">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">{{ getUljaraName(rez.uljara) }}</h5>
          <span :class="getStatusClass(rez.status)">{{ getStatusText(rez.status) }}</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Datum</span>
          <span class="reservation-value">{{ formatDatum(rez.datum) }}</span>
        </div>

        <div class="reservation-item" v-if="rez.timeSlot">
          <span class="reservation-label">Vrijeme</span>
          <span class="reservation-value">{{ rez.timeSlot }}</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Količina</span>
          <span class="reservation-value">{{ rez.kolicina }} kg</span>
        </div>

        <div class="reservation-item">
          <span class="reservation-label">Kreirano</span>
          <span class="reservation-value-small">{{ formatTimestamp(rez.createdAt) }}</span>
        </div>

        <div class="mt-3" v-if="rez.status === 'pending'">
          <button
            class="btn btn-sm btn-danger w-100"
            @click="otkaziRezervaciju(rez.id)"
            :disabled="loading"
          >
            Otkaži rezervaciju
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';

export default {
  name: "MyReservationsView",
  data() {
    return {
      rezervacije: [],
      loading: true,
      sortBy: 'datum',
      sortDir: 'desc'
    };
  },
  computed: {
    sortiraneRezervacije() {
      return [...this.rezervacije].sort((a, b) => {
        let valA, valB;

        if (this.sortBy === 'datum') {
          valA = a.datum || '';
          valB = b.datum || '';
        } else if (this.sortBy === 'status') {
          const redoslijed = { pending: 1, confirmed: 2, cancelled: 3 };
          valA = redoslijed[a.status] || 9;
          valB = redoslijed[b.status] || 9;
        } else if (this.sortBy === 'kolicina') {
          valA = a.kolicina || 0;
          valB = b.kolicina || 0;
        }

        if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  },
  mounted() {
    this.dohvatiRezervacije();
  },
  methods: {
    setSortBy(kriterij) {
      if (this.sortBy === kriterij) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = kriterij;
        this.sortDir = 'asc';
      }
    },

    toggleDir() {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    },

    async dohvatiRezervacije() {
      this.loading = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          this.$router.push('/login');
          return;
        }

        const q = query(
          collection(db, "reservations"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        this.rezervacije = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Greška pri dohvaćanju rezervacija:", error);

        if (error.code === 'failed-precondition') {
          await this.dohvatiRezervacijeBezSortiranja();
        }
      } finally {
        this.loading = false;
      }
    },

    async dohvatiRezervacijeBezSortiranja() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "reservations"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        this.rezervacije = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        this.rezervacije.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        });
      } catch (error) {
        console.error("Greška:", error);
      }
    },

    async otkaziRezervaciju(rezervacijaId) {
      if (!confirm("Jeste li sigurni da želite otkazati ovu rezervaciju?")) {
        return;
      }

      try {
        await updateDoc(doc(db, "reservations", rezervacijaId), {
          status: 'cancelled'
        });

        const rez = this.rezervacije.find(r => r.id === rezervacijaId);
        if (rez) rez.status = 'cancelled';

        alert("Rezervacija je otkazana.");
      } catch (error) {
        console.error("Greška pri otkazivanju:", error);
        alert("Došlo je do greške.");
      }
    },

    formatDatum(datum) {
      if (!datum) return "";
      const [year, month, day] = datum.split("-");
      return `${day}.${month}.${year}.`;
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = timestamp.toDate();
      return date.toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getUljaraName(uljara) {
      const uljare = {
        agrolaguna: "Agrolaguna (Poreč)",
        "oleum-maris": "Oleum Maris (Novigrad)",
        vodnjan: "Uljara Vodnjan",
        chiavalon: "Chiavalon"
      };
      return uljare[uljara] || uljara.toUpperCase();
    },

    getStatusText(status) {
      const statusi = {
        pending: 'Na čekanju',
        confirmed: 'Potvrđeno',
        cancelled: 'Otkazano'
      };
      return statusi[status] || status;
    },

    getStatusClass(status) {
      const klase = {
        pending: 'badge bg-warning text-dark',
        confirmed: 'badge bg-success',
        cancelled: 'badge bg-secondary'
      };
      return klase[status] || 'badge bg-secondary';
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

.reservation-value-small {
  font-size: 12px;
  color: #666;
}

.btn-primary {
  background-color: #334214;
  border-color: #334214;
}

.btn-primary:hover {
  background-color: #2a360f;
  border-color: #2a360f;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #bb2d3b;
}

.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.sort-buttons {
  display: flex;
  gap: 6px;
}

.sort-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn.active {
  background-color: #334214;
  color: white;
  border-color: #334214;
}

.sort-dir-btn {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid #334214;
  background: white;
  color: #334214;
  font-size: 13px;
  cursor: pointer;
}
</style>
