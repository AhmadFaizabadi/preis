const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("layouts/LoginLayout/LoginForm.vue"),
    children: [],
  },
  {
    path: "/register",
    name: "register",
    component: () => import("layouts/LoginLayout/RegisterForm.vue"),
    children: [],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Home.vue") },
      {
        path: "/services",
        component: () => import("pages/ServicesManagement.vue"),
      },
      {
        path: "/products",
        component: () => import("src/pages/Product/ProductsManagement.vue"),
        children: [
          {
            path: "view/:id",
            component: () => import("pages/Product/ProductView.vue"),
          },
          {
            path: "new",
            component: () => import("pages/Product/ProductNew.vue"),
          },
          {
            path: "edit/:id",
            component: () => import("pages/Product/ProductNew.vue"),
          },
          {
            path: "delete/:id",
            component: () => import("pages/Product/ProductDelete.vue"),
          },
          {
            path: "undelete/:id",
            component: () => import("pages/Product/ProductDelete.vue"),
          },
          {
            path: "import",
            component: () => import("pages/Product/ProductImport.vue"),
          },
        ],
      },
      {
        path: "/customers",
        component: () => import("pages/Customer/CustomersManagement.vue"),
        children: [
          {
            path: "new",
            component: () => import("pages/Customer/CustomerNew.vue"),
          },
          {
            path: "view/:id",
            component: () => import("pages/Customer/CustomerView.vue"),
          },
          {
            path: "edit/:id",
            component: () => import("pages/Customer/CustomerNew.vue"),
          },
          {
            path: "delete/:id",
            component: () => import("pages/Customer/CustomerDelete.vue"),
          },
          {
            path: "undelete/:id",
            component: () => import("pages/Customer/CustomerDelete.vue"),
          },
        ],
      },
      {
        path: "/invoices",
        component: () => import("pages/Invoice/InvoiceManagement.vue"),
        children: [
          {
            path: "new",
            component: () => import("pages/Invoice/InvoiceNew.vue"),
            props: { isNew: true },
          },
          {
            path: "view/:id",
            component: () => import("pages/Invoice/InvoiceView.vue"),
          },
          {
            path: "edit/:id",
            component: () => import("pages/Invoice/InvoiceNew.vue"),
            props: { isNew: false },
          },
          {
            path: "print/:id",
            component: () => import("pages/Invoice/InvoicePrint.vue"),
          },
        ],
      },
      {
        path: "/packages",
        component: () => import("src/pages/Package/PackagesManagement.vue"),
        children: [
          {
            path: "new",
            component: () => import("pages/Package/PackageNew.vue"),
            props: { isNew: true },
          },
          {
            path: "view/:id",
            component: () => import("pages/Package/PackageView.vue"),
          },
          {
            path: "edit/:id",
            component: () => import("pages/Package/PackageNew.vue"),
            props: { isNew: false },
          },
        ],
      },
      { path: "/users", component: () => import("pages/UsersManagement.vue") },
      { path: "/settings", component: () => import("pages/Settings.vue") },
      {
        path: "/register",
        component: () => import("src/pages/UserRegister.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
