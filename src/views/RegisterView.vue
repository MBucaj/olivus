<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Registracija</h2>
      <p class="auth-subtitle">Kreiraj račun i rezerviraj termin u uljari.</p>

      <form class="auth-form">
        <div class="auth-field">
          <label class="auth-label">Ime i prezime</label>
          <input
            class="auth-input"
            type="text"
            placeholder="npr. Ana Anić"
          />
        </div>

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

        <div class="auth-field">
          <label class="auth-label">Potvrdi lozinku</label>
          <input
            class="auth-input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="auth-btn ol-btn ol-btn-primary w-100">
          Registriraj se
        </button>

        <div class="auth-footer">
          <span>Već imaš račun?</span>
          <router-link to="/login">Prijava</router-link>
        </div>
      </form>
    </div>
  </div>
</template>
