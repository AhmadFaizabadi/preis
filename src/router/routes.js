
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/services', component: () => import('pages/ServicesManagement.vue') },
      { path: '/invoice', component: () => import('pages/Invoice.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
