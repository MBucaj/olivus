import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: "/", name: "landing", component: () => import("../views/LandingView.vue") },
  { path: "/login", name: "login", component: () => import("../views/LoginView.vue") },
  { path: "/register", name: "register", component: () => import("../views/RegisterView.vue") },

  { path: "/dashboard", name: "dashboard", component: () => import("../views/DashboardView.vue"), meta: { requiresAuth: true } },
  { path: "/schedule", name: "schedule", component: () => import("../views/ScheduleView.vue"), meta: { requiresAuth: true } },
  { path: "/my-reservations", name: "myReservations", component: () => import("../views/MyReservationsView.vue"), meta: { requiresAuth: true } },

  { path: "/admin", name: "admin", component: () => import("../views/AdminView.vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const getCurrentUser = () => new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();
    resolve(user);
  });
});

router.beforeEach(async (to) => {
  const user = await getCurrentUser();

  if (user && (to.name === 'landing' || to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' };
  }

  if (to.meta.requiresAuth && !user) {
    return { name: 'login' };
  }
});

export default router
