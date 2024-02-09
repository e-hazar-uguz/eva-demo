import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/front/Home.vue'
import HiddenPage1 from '../views/front/HiddenPage1.vue'
import Login from '../views/auth/Login.vue'
import store from '../store'; 
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/hidden-page-1',
    name: 'HiddenPage1',
    component: HiddenPage1,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if the user is authenticated
    const isAuthenticated = store.getters.isAuthenticated;
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      next('/login');
    } else {
      // If authenticated, proceed to the requested route
      next();
    }
  } else {
    // If the route doesn't require authentication, proceed as usual
    next();
  }
});

export default router
