<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">Početna</h2>
      <p class="page-subtitle">Dobrodošla u Olivus.</p>
    </div>

    <!-- Glavne akcije -->
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

    <!-- Brzi pregled (dummy podaci za dizajn) -->
    <div class="ol-card mt-3">
      <h5 class="mb-2">Zadnja rezervacija</h5>

      <div class="res-row">
        <span class="res-label">Datum</span>
        <span class="res-value">12.01.2026</span>
      </div>

      <div class="res-row">
        <span class="res-label">Vrijeme</span>
        <span class="res-value">10:30</span>
      </div>

      <div class="res-row">
        <span class="res-label">Količina</span>
        <span class="res-value">150 kg</span>
      </div>

      <div class="res-row">
        <span class="res-label">Status</span>
        <span class="badge status-pending">PENDING</span>
      </div>

      <router-link to="/my-reservations" class="btn ol-btn ol-btn-outline w-100 mt-3">
        Pogledaj sve rezervacije
      </router-link>
    </div>
  </div>
</template>
