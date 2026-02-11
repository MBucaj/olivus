<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">Pozdrav, {{ displayName || 'korisniče' }}!</h2>
      <p class="page-subtitle">Dobrodošao/la u Olivus.</p>
    </div>

    <div class="grid-actions">
      <router-link to="/schedule" class="action-card">
        <div class="action-title">Rezerviraj termin</div>
        <div class="action-desc">Odaberi datum i vrijeme u uljari</div>
      </router-link>

      <router-link to="/my-reservations" class="action-card">
        <div class="action-title">Moje rezervacije</div>
        <div class="action-desc">Pregled i otkazivanje termina</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default {
  name: "DashboardView",
  data() {
    return {
      displayName: ''
    };
  },
  async mounted() {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        this.displayName = userDoc.data().displayName;
      }
    }
  }
};
</script>
