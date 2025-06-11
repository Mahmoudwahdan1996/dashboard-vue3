import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layout/default.vue";
import { useAuthStore } from "../stores/auth"; // Assuming Pinia store for permissions

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "default",
      component: DefaultLayout,
      redirect: "/products",
      children: [
        {
          path: "/products",
          name: "Products",
          component: () => import("../views/products/index.vue"),
          meta: { requiresAuth: true, breadcrumb: [{ label: "products" }] },
        },
        {
          path: "/products/add",
          name: "AddProduct",
          component: () => import("../views/products/add.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "products", to: "/products" },
              { label: "add" },
            ],
          },
        },
        {
          path: "/products/edit/:id",
          name: "EditProduct",
          component: () => import("../views/products/edit.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "products", to: "/products" },
              { label: "id", dynamic: true }, // Dynamic label
            ],
          },
        },
        {
          path: "/categories",
          name: "categories",
          component: () => import("../views/categories/index.vue"),
          meta: {
            breadcrumb: [{ label: "categories" }], // Use translation keys for i18n
          },
        },

        {
          path: "/categories/add",
          name: "AddCategory",
          component: () => import("../views/categories/add.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "categories", to: "/categories" },
              { label: "add" },
            ],
          },
        },
        {
          path: "/categories/edit/:id",
          name: "EditCategory",
          component: () => import("../views/categories/edit.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "categories", to: "/categories" },
              { label: "edit", dynamic: true }, // Dynamic label
            ],
          },
        },
        {
          path: "/users",
          name: "users",
          component: () => import("../views/users/index.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [{ label: "users" }], // Use translation keys for i18n
          },
        },
        {
          path: "/users/add",
          name: "AddUser",
          component: () => import("../views/users/add.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [{ label: "users", to: "/users" }, { label: "add" }],
          },
        },
        {
          path: "/users/edit/:id",
          name: "EditUser",
          component: () => import("../views/users/edit.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "users", to: "/users" },
              { label: "id", dynamic: true }, // Dynamic label
            ],
          },
        },

        {
          path: "/products/:id",
          name: "ProductDetails",
          component: () => import("../views/ProductDetails.vue"),
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: "products", to: "/products" },
              { label: "id", dynamic: true }, // Dynamic label
            ],
          },
        },
      ],
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("../views/auth/login.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.name === "login" && authStore.isAuthenticated) {
    return next({ name: "default" });
  }

  // // Fetch permissions if not already loaded
  // if (Object.keys(authStore.permissions).length === 0) {
  //   await authStore.fetchPermissions();
  // }

  // // Check if route requires authentication
  // if (to.meta.requiresAuth) {
  //   if (!authStore.isAuthenticated) {
  //     // Redirect to login if not authenticated
  //     return next({ name: "Login", query: { redirect: to.fullPath } });
  //   }

  //   // Check permissions if specified in route meta
  //   if (to.meta.permissions) {
  //     const hasPermission = to.meta.permissions.every((perm) => {
  //       const [module, action] = perm.split(":");
  //       return authStore.hasPermission(module, action);
  //     });

  //     if (!hasPermission) {
  //       // Redirect to unauthorized page or home if no permission
  //       return next({ name: "Home" });
  //     }
  //   }
  // }
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
  }

  // Proceed to the route
  next();
});

export default router;
