<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Prijava</h2>
      <p class="auth-subtitle">Prijavi se da rezerviraš termin u uljari.</p>

      <form class="auth-form">
        <div class="auth-field">
          <label class="auth-label">Email</label>
          <input
            class="auth-input"
            type="email"
            placeholder="npr. ana@mail.com"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label">Lozinka</label>
          <input
            class="auth-input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="auth-btn ol-btn ol-btn-primary w-100">
          Prijava
        </button>

        <div class="auth-footer">
          <span>Nemaš račun?</span>
          <router-link to="/register">Registracija</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
