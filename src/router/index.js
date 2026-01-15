import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: "/", name: "landing", component: () => import("../views/LandingView.vue") },
  { path: "/login", name: "login", component: () => import("../views/LoginView.vue") },
  { path: "/register", name: "register", component: () => import("../views/RegisterView.vue") },

  { path: "/dashboard", name: "dashboard", component: () => import("../views/DashboardView.vue") },
  { path: "/schedule", name: "schedule", component: () => import("../views/ScheduleView.vue") },
  { path: "/my-reservations", name: "myReservations", component: () => import("../views/MyReservationsView.vue") },

  { path: "/admin", name: "admin", component: () => import("../views/AdminView.vue") },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
