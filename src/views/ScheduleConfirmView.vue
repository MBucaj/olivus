<template>
  <div class="confirm-page">
    <h2 class="mb-4">Odaberi vrijeme</h2>

    <div class="card mb-4">
      <div class="card-body">
        <p><strong>Uljara:</strong> {{ uljaraName }}</p>
        <p><strong>Količina:</strong> {{ kolicina }} tona</p>
        <p><strong>Datum:</strong> {{ formatDatum }}</p>
      </div>
    </div>

    <!-- Odabir vremena -->
    <div class="mb-4">
      <label class="form-label">Odaberi vrijeme</label>
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle w-100"
          type="button"
          data-bs-toggle="dropdown"
        >
          {{ odabranoVrijeme || "Odaberi vrijeme..." }}
        </button>
        <ul class="dropdown-menu w-100">
          <li v-for="termin in termini" :key="termin.vrijeme">
            <a
              class="dropdown-item"
              :class="{ disabled: termin.zauzeto }"
              :aria-disabled="termin.zauzeto"
              href="#"
              @click.prevent="odaberiVrijeme(termin)"
            >
              {{ termin.vrijeme }}
              <span v-if="termin.zauzeto" class="text-muted ms-2">(zauzeto)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="d-grid gap-2">
      <button class="btn btn-primary btn-lg" @click="potvrdi" :disabled="!odabranoVrijeme || saving">
        {{ saving ? "Spremanje..." : "Potvrdi rezervaciju" }}
      </button>
      <button class="btn btn-outline-secondary" @click="natrag" :disabled="saving">Natrag</button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default {
  name: "ScheduleConfirmView",
  data() {
    return {
      odabranoVrijeme: "",
      zauzetiTermini: [],
      saving: false
    };
  },
  computed: {
    uljara() {
      return this.$route.query.uljara || "";
    },
    kolicina() {
      return this.$route.query.kolicina || "";
    },
    datum() {
      return this.$route.query.datum || "";
    },
    uljaraName() {
      const uljare = {
        agrolaguna: "Agrolaguna (Poreč)",
        "oleum-maris": "Oleum Maris (Novigrad)",
        vodnjan: "Uljara Vodnjan (Vodnjan)",
        chiavalon: "Chiavalon"
      };
      return uljare[this.uljara] || this.uljara;
    },
    formatDatum() {
      if (!this.datum) return "";
      const [year, month, day] = this.datum.split("-");
      return `${day}.${month}.${year}.`;
    },
    termini() {
      const sviTermini = [];
      for (let sat = 8; sat <= 15; sat++) {
        const vrijeme = `${sat.toString().padStart(2, "0")}:00`;
        sviTermini.push({
          vrijeme,
          zauzeto: this.zauzetiTermini.includes(vrijeme)
        });
      }
      return sviTermini;
    }
  },
  mounted() {
    this.dohvatiZauzeteTermine();
  },
  methods: {
    async dohvatiZauzeteTermine() {
      try {
        const q = query(
          collection(db, "rezervacije"),
          where("datum", "==", this.datum),
          where("uljara", "==", this.uljara)
        );

        const snapshot = await getDocs(q);
        this.zauzetiTermini = snapshot.docs.map(doc => doc.data().vrijeme);
      } catch (error) {
        console.error("Greška pri dohvaćanju termina:", error);
      }
    },
    odaberiVrijeme(termin) {
      if (!termin.zauzeto) {
        this.odabranoVrijeme = termin.vrijeme;
      }
    },
    async potvrdi() {
      if (!this.odabranoVrijeme) {
        alert("Molimo odaberite vrijeme!");
        return;
      }

      this.saving = true;

      try {
        const user = auth.currentUser;
        if (!user) {
          alert("Morate biti prijavljeni!");
          return;
        }

        await addDoc(collection(db, "rezervacije"), {
          userId: user.uid,
          userEmail: user.email,
          uljara: this.uljara,
          kolicina: this.kolicina,
          datum: this.datum,
          vrijeme: this.odabranoVrijeme,
          createdAt: new Date().toISOString()
        });

        this.$router.push("/schedule/success");
      } catch (error) {
        console.error("Greška pri spremanju:", error);
        alert("Greška: " + error.message);
      } finally {
        this.saving = false;
      }
    },
    natrag() {
      this.$router.push("/schedule");
    }
  }
};
</script>

<style scoped>
.confirm-page {
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

.btn-primary:disabled {
  background-color: #334214;
  border-color: #334214;
  opacity: 0.5;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item.disabled {
  color: #adb5bd;
  pointer-events: none;
}
</style>
