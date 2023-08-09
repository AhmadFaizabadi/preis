
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Home.vue') },
      { path: '/services', component: () => import('pages/ServicesManagement.vue') },
      { path: '/accounts', component: () => import('pages/AccountManagement.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/invoice',props:{isNew:true}, component: () => import('src/pages/InvoiceIssuance.vue') },
      { path: '/list-invoices',component: () => import('src/pages/ListInvoices.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('src/pages/UserRegister.vue') },
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
