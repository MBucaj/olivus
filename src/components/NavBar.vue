<template>
  <nav class="navbar fixed-top olivus-navbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Olivus</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Izbornik</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Početna</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/schedule">Rezerviraj termin</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/my-reservations">Moje rezervacije</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" to="/admin">Admin</router-link>
            </li>
          </ul>

          <button class="btn btn-outline-danger mt-3 w-100">
            Odjava
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>
/* NAVBAR BOJA */
.olivus-navbar {
  background-color: #334214;
}

/* LINKOVI I LOGO */
.olivus-navbar .navbar-brand,
.olivus-navbar .nav-link {
  color: white;
}

/* HOVER */
.olivus-navbar .nav-link:hover {
  color: #e6e6e6;
}

/* HAMBURGER IKONA DA BUDE BIJELA */
.olivus-navbar .navbar-toggler-icon {
  filter: invert(1);
}

/* BORDER HAMBURGER GUMBA */
.olivus-navbar .navbar-toggler {
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
