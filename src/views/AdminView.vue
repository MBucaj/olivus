<template>
  <div class="admin-page">
    <div class="admin-header mb-4">
      <h2 v-if="uljaraName">{{ uljaraName }}</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Učitavanje...</span>
      </div>
    </div>

    <div v-else class="filter-section mb-4">
      <div class="row">
        <div class="col-md-4">
          <select class="form-select" v-model="filterStatus">
            <option value="all">Sve rezervacije</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Potvrđeno</option>
            <option value="cancelled">Otkazano</option>
          </select>
        </div>
      </div>
    </div>

    <div class="reservations-admin-list">
      <div
        v-for="rez in filteredReservations"
        :key="rez.id"
        class="admin-reservation-card mb-3"
      >
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="mb-1">{{ rez.userEmail }}</h5>
            <small class="text-muted">ID: {{ rez.id }}</small>
          </div>
          <span :class="getStatusClass(rez.status)">{{ getStatusText(rez.status) }}</span>
        </div>

        <div class="reservation-details">
          <div class="detail-row">
            <span class="detail-label">Datum:</span>
            <span class="detail-value">{{ formatDatum(rez.datum) }}</span>
          </div>

          <div class="detail-row" v-if="rez.timeSlot">
            <span class="detail-label">Vrijeme:</span>
            <span class="detail-value">{{ rez.timeSlot }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Količina:</span>
            <span class="detail-value">{{ rez.kolicina }} kg</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Trajanje:</span>
            <span class="detail-value">{{ calculateDuration(rez.kolicina) }} min</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Kreirano:</span>
            <span class="detail-value">{{ formatTimestamp(rez.createdAt) }}</span>
          </div>
        </div>

        <div class="action-buttons mt-3" v-if="rez.status === 'pending'">
          <button
            class="btn btn-success btn-sm me-2"
            @click="openConfirmModal(rez)"
          >
            Potvrdi
          </button>
          <button
            class="btn btn-danger btn-sm"
            @click="odbijRezervaciju(rez.id)"
          >
            Odbij
          </button>
        </div>

        <div v-if="rez.status === 'confirmed'" class="mt-2">
          <small class="text-success">Potvrđeno: {{ formatTimestamp(rez.confirmedAt) }}</small>
        </div>
      </div>

      <div v-if="filteredReservations.length === 0" class="text-center py-5">
        <p class="text-muted">Nema rezervacija za prikaz.</p>
      </div>
    </div>

    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      ref="confirmModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Potvrdi rezervaciju</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedReservation">
            <p><strong>Korisnik:</strong> {{ selectedReservation.userEmail }}</p>
            <p><strong>Datum:</strong> {{ formatDatum(selectedReservation.datum) }}</p>
            <p><strong>Količina:</strong> {{ selectedReservation.kolicina }} kg</p>
            <p><strong>Trajanje:</strong> {{ calculateDuration(selectedReservation.kolicina) }} minuta</p>

            <hr>

            <div class="mb-3">
              <label class="form-label">Odaberi početno vrijeme:</label>
              <select class="form-select" v-model="selectedTimeStart">
                <option value="">-- Odaberi vrijeme --</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
              <small v-if="selectedTimeStart" class="text-muted">
                Kraj: {{ calculateEndTime(selectedTimeStart, calculateDuration(selectedReservation.kolicina)) }}
              </small>
            </div>

            <div class="mb-3">
              <label class="form-label">Napomena (opcionalno):</label>
              <textarea
                class="form-control"
                v-model="adminNotes"
                rows="3"
                placeholder="Dodatne napomene..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Otkaži</button>
            <button
              type="button"
              class="btn btn-success"
              @click="potvrdiRezervaciju"
              :disabled="!selectedTimeStart || confirmingReservation"
            >
              <span v-if="confirmingReservation" class="spinner-border spinner-border-sm me-2"></span>
              Potvrdi rezervaciju
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Modal } from 'bootstrap';

export default {
  name: "AdminView",
  data() {
    return {
      rezervacije: [],
      loading: true,
      filterStatus: 'all',
      adminUljaraId: null,
      uljaraName: '',
      selectedReservation: null,
      selectedTimeStart: '',
      adminNotes: '',
      confirmingReservation: false
    };
  },
  computed: {
    filteredReservations() {
      if (this.filterStatus === 'all') {
        return this.rezervacije;
      }
      return this.rezervacije.filter(r => r.status === this.filterStatus);
    }
  },
  async mounted() {
    await this.checkAdminAccess();
    if (this.adminUljaraId) {
      await this.dohvatiRezervacije();
    }
  },
  methods: {
    async checkAdminAccess() {
      try {
        const user = auth.currentUser;
        if (!user) {
          this.$router.push('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
          alert("User dokument ne postoji!");
          this.$router.push('/dashboard');
          return;
        }

        const userData = userDoc.data();

        if (userData.role !== 'admin') {
          alert("Nemate admin pristup!");
          this.$router.push('/dashboard');
          return;
        }

        this.adminUljaraId = userData.uljaraId;
        this.uljaraName = this.getUljaraName(userData.uljaraId);

      } catch (error) {
        console.error("Greška pri provjeri pristupa:", error);
        this.$router.push('/dashboard');
      }
    },

    async dohvatiRezervacije() {
      this.loading = true;
      try {
        const q = query(
          collection(db, "reservations"),
          where("uljara", "==", this.adminUljaraId),
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
        const q = query(
          collection(db, "reservations"),
          where("uljara", "==", this.adminUljaraId)
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

    openConfirmModal(rezervacija) {
      this.selectedReservation = rezervacija;
      this.selectedTimeStart = '';
      this.adminNotes = '';

      const modalEl = this.$refs.confirmModal;
      const modal = new Modal(modalEl);
      modal.show();
    },

    async potvrdiRezervaciju() {
      if (!this.selectedTimeStart) {
        alert("Molimo odaberite vrijeme!");
        return;
      }

      this.confirmingReservation = true;

      try {
        const duration = this.calculateDuration(this.selectedReservation.kolicina);
        const endTime = this.calculateEndTime(this.selectedTimeStart, duration);
        const timeSlot = `${this.selectedTimeStart}-${endTime}`;

        await updateDoc(doc(db, "reservations", this.selectedReservation.id), {
          status: 'confirmed',
          timeSlot: timeSlot,
          duration: duration,
          confirmedAt: serverTimestamp(),
          adminNotes: this.adminNotes || null
        });

        const rez = this.rezervacije.find(r => r.id === this.selectedReservation.id);
        if (rez) {
          rez.status = 'confirmed';
          rez.timeSlot = timeSlot;
          rez.duration = duration;
          rez.confirmedAt = new Date();
        }

        alert("Rezervacija potvrđena!");

        const modalEl = this.$refs.confirmModal;
        const modal = Modal.getInstance(modalEl);
        modal.hide();

      } catch (error) {
        console.error("Greška pri potvrđivanju:", error);
        alert("Došlo je do greške.");
      } finally {
        this.confirmingReservation = false;
      }
    },

    async odbijRezervaciju(rezervacijaId) {
      if (!confirm("Jeste li sigurni da želite odbiti ovu rezervaciju?")) {
        return;
      }

      try {
        await updateDoc(doc(db, "reservations", rezervacijaId), {
          status: 'cancelled',
          cancelledBy: 'admin'
        });

        const rez = this.rezervacije.find(r => r.id === rezervacijaId);
        if (rez) rez.status = 'cancelled';

        alert("Rezervacija odbijena.");
      } catch (error) {
        console.error("Greška pri odbijanju:", error);
        alert("Došlo je do greške.");
      }
    },

    calculateDuration(kolicina) {
      if (!kolicina || kolicina === 0) return 120;
      if (kolicina < 150) return 45;
      if (kolicina < 400) return 75;
      return 120;
    },

    calculateEndTime(startTime, durationMinutes) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + durationMinutes;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    },

    formatDatum(datum) {
      if (!datum) return "";
      const [year, month, day] = datum.split("-");
      return `${day}.${month}.${year}.`;
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
      return uljare[uljara] || uljara;
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
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  text-align: center;
}

.admin-reservation-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.reservation-details {
  margin-top: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
