import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: "/", name: "landing", component: () => import("../views/LandingView.vue") },
  { path: "/login", name: "login", component: () => import("../views/LoginView.vue") },
  { path: "/register", name: "register", component: () => import("../views/RegisterView.vue") },

  { path: "/dashboard", name: "dashboard", component: () => import("../views/DashboardView.vue"), meta: { requiresAuth: true } },
  { path: "/schedule", name: "schedule", component: () => import("../views/ScheduleView.vue"), meta: { requiresAuth: true } },
  { path: "/schedule/confirm", name: "scheduleConfirm", component: () => import("../views/ScheduleConfirmView.vue"), meta: { requiresAuth: true } },
  { path: "/schedule/success", name: "scheduleSuccess", component: () => import("../views/ScheduleSuccessView.vue"), meta: { requiresAuth: true } },
  { path: "/my-reservations", name: "myReservations", component: () => import("../views/MyReservationsView.vue"), meta: { requiresAuth: true } },

  { path: "/admin", name: "admin", component: () => import("../views/AdminView.vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Auth guard — čekamo Firebase da pokaže tko je logiran
const getCurrentUser = () => new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    resolve(user);
  });
});

router.beforeEach(async (to) => {
  const user = await getCurrentUser();

  // Ako je ulogiran i ide na landing/login/register, preusmjeri na dashboard
  if (user && (to.name === 'landing' || to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' };
  }

  // Ako nije ulogiran a stranica zahtijeva auth, preusmjeri na login
  if (to.meta.requiresAuth && !user) {
    return { name: 'login' };
  }
});

export default router
