// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/front/HomeView.vue";
import { useAuthStore } from "../stores/auth/auth";
import { storeToRefs } from "pinia";

const routes = [
  {
    path: "/",
    component: () => import("../views/layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "home",
        meta: {
          title: "الرئيسية",
        },
        component: HomeView,
      },
      {
        path: "/exchange",
        name: "exchange",
        meta: {
          title: "المقايضة",
          requiresAuth: true,
        },
        component: () => import("../views/front/ExchangeView.vue"),
      },
      {
        path: "/notifications",
        name: "notifications",
        meta: {
          title: "التنبيهات",
          requiresAuth: true,
        },
        component: () => import("../views/front/NotificationsView.vue"),
      },
      {
        path: "/personal-profile",
        name: "personal_profile",
        meta: {
          title: "الملف الشخصي",
          requiresAuth: true,
        },
        component: () => import("../views/front/ProfileView.vue"),
      },
      {
        path: "/",
        component: () => import("../views/layouts/SearchLayout.vue"),
        children: [
          {
            path: "/search",
            name: "search-map",
            meta: {
              title: "بحث",
              requiresAuth: true,
            },
            component: () => import("../views/front/SearchView.vue"),
          },
          {
            path: "/search-list-stores",
            name: "search-list-stores",
            meta: {
              title: "بحث",
              requiresAuth: true,
            },
            component: () => import("../views/front/ListStoreView.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "تسجيل الدخول",
      requiresGuest: true,
    },
    component: () => import("../views/front/CreateAccount.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: "انشاء حساب",
      requiresGuest: true,
    },
    component: () => import("../views/front/CreateAccount.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    meta: {
      title: "نسيت كلمة المرور",
      requiresGuest: true,
    },
    component: () => import("../views/front/ForgotPassword.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    meta: {
      title: "اعادة تعيين كلمة المرور",
      requiresGuest: true,
    },
    component: () => import("../views/front/ResetPassword.vue"),
  },
  {
    path: "/otp-verification",
    name: "otp-verification",
    meta: {
      title: "ادخال رمز التحقق",
      requiresGuest: true,
    },
    component: () => import("../views/front/OtpVerification.vue"),
  },
  {
    path: "/create-account",
    name: "account",
    meta: {
      title: "انشاء حساب",
    },
    component: () => import("../views/front/CreateAccount.vue"),
  },

  {
    path: "/",
    component: () => import("../views/layouts/DashboardLayout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "لوحة التحكم",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/DashboardView.vue"),
      },
      {
        path: "/dashboard/products",
        name: "dashboard-product",
        meta: {
          title: "المنتجات",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/ProductView.vue"),
      },
      {
        path: "/dashboard/reports",
        name: "dashboard-report",
        meta: {
          title: "الابلاغات",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/ReportView.vue"),
      },
      {
        path: "/dashboard/stores",
        name: "dashboard-store",
        meta: {
          title: "المتاجر",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/StoreView.vue"),
      },
      {
        path: "/dashboard/categories",
        name: "dashboard-category",
        meta: {
          title: "التصنيفات",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/CategoryView.vue"),
      },
      {
        path: "/dashboard/users",
        name: "dashboard-user",
        meta: {
          title: "المستخدمون",
          requiresAuth: true,
          role: ["admin"],
        },
        component: () => import("../views/dashboard/UserView.vue"),
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { isAuth, user } = storeToRefs(authStore);
  await authStore.checkAuth();

  if (to.meta.requiresAuth) {
    if (isAuth.value) {
      if (to.meta.role) {
        if (to.meta.role.includes(user.value?.role)) {
          return next();
        }
        return next({ name: "home" });
      }
      return next();
    }
    return next({ name: "login" });
  }
  if (to.meta.requiresGuest) {
    if (isAuth.value) {
      next({ name: "home" });
    }
    return next();
  }

  let position = { x: 0, y: 0 };
  if (sessionStorage.getItem("scrollPosition")) {
    position = JSON.parse(sessionStorage.getItem("scrollPosition"));
    sessionStorage.removeItem("scrollPosition");
  }
  window.scrollTo(position.x, position.y);
  document.title = to.meta.title;
  return next();
});

export default router;
