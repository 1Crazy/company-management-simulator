import { createRouter, createWebHistory } from "vue-router";
import { useSimulatorApp } from "@/composables/useSimulatorApp";
import GameView from "@/views/GameView.vue";
import SetupView from "@/views/SetupView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "setup",
      component: SetupView
    },
    {
      path: "/game",
      name: "game",
      component: GameView,
      meta: {
        requiresSession: true
      }
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  if (to.meta.requiresSession && !useSimulatorApp().session.value) {
    return { name: "setup" };
  }

  return true;
});

export default router;
