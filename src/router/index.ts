import { createRouter, createWebHistory } from 'vue-router'

import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }

    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'catalog',
          component: () => import('@/pages/CatalogPage.vue'),
          meta: { title: 'Découvrir' },
        },
        {
          path: 'objets/:id',
          name: 'item-detail',
          component: () => import('@/pages/ItemDetailPage.vue'),
          props: (route) => ({ id: Number(route.params.id) }),
          meta: { title: 'Objet' },
        },
        {
          path: 'competences/:id',
          name: 'skill-detail',
          component: () => import('@/pages/SkillDetailPage.vue'),
          props: (route) => ({ id: Number(route.params.id) }),
          meta: { title: 'Compétence' },
        },
        {
          path: 'mes-annonces',
          name: 'my-listings',
          component: () => import('@/pages/me/MyListingsPage.vue'),
          meta: { title: 'Mes annonces', requiresAuth: true },
        },
        {
          path: 'mes-annonces/objets/nouveau',
          name: 'item-create',
          component: () => import('@/pages/me/ItemFormPage.vue'),
          meta: { title: 'Publier un objet', requiresAuth: true },
        },
        {
          path: 'mes-annonces/objets/:id/modifier',
          name: 'item-edit',
          component: () => import('@/pages/me/ItemFormPage.vue'),
          props: (route) => ({ id: Number(route.params.id) }),
          meta: { title: 'Modifier un objet', requiresAuth: true },
        },
        {
          path: 'mes-annonces/competences/nouveau',
          name: 'skill-create',
          component: () => import('@/pages/me/SkillFormPage.vue'),
          meta: { title: 'Publier une compétence', requiresAuth: true },
        },
        {
          path: 'mes-annonces/competences/:id/modifier',
          name: 'skill-edit',
          component: () => import('@/pages/me/SkillFormPage.vue'),
          props: (route) => ({ id: Number(route.params.id) }),
          meta: { title: 'Modifier une compétence', requiresAuth: true },
        },
        {
          path: 'reservations',
          name: 'reservations',
          component: () => import('@/pages/reservations/ReservationsPage.vue'),
          meta: { title: 'Réservations', requiresAuth: true },
        },
        {
          path: 'profil',
          name: 'profile',
          component: () => import('@/pages/ProfilePage.vue'),
          meta: { title: 'Profil', requiresAuth: true },
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'connexion',
          name: 'login',
          component: () => import('@/pages/auth/LoginPage.vue'),
          meta: { title: 'Connexion', requiresGuest: true },
        },
        {
          path: 'inscription',
          name: 'register',
          component: () => import('@/pages/auth/RegisterPage.vue'),
          meta: { title: 'Créer un compte', requiresGuest: true },
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminRouteLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/pages/admin/AdminDashboardPage.vue'),
          meta: { title: 'Tableau de bord' },
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/pages/admin/AdminCategoriesPage.vue'),
          meta: { title: 'Catégories' },
        },
        {
          path: 'utilisateurs',
          name: 'admin-users',
          component: () => import('@/pages/admin/AdminUsersPage.vue'),
          meta: { title: 'Utilisateurs' },
        },
        {
          path: 'objets',
          name: 'admin-items',
          component: () => import('@/pages/admin/AdminItemsPage.vue'),
          meta: { title: 'Modération des objets' },
        },
        {
          path: 'competences',
          name: 'admin-skills',
          component: () => import('@/pages/admin/AdminSkillsPage.vue'),
          meta: { title: 'Modération des compétences' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Page introuvable' },
    },
  ],
})

router.beforeEach(authGuard)

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · SkillSwap` : 'SkillSwap'
})

export default router
