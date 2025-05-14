import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export interface RouteMeta {
  name: string;
}

export enum RouteName {
  HOME = 'home',
  GAME_CONSOLE = 'game-console',
  GAME_CONSOLE_LOBBY = 'game-console-lobby',
  GAME_CONSOLE_THE_FIRST_PENGUIN = 'game-console-the-first-penguin',

  PLAYER_GAMEPAD = 'player-gamepad',
  PLAYER_GAMEPAD_LOBBY = 'player-gamepad-lobby',
  PLAYER_GAMEPAD_THE_FIRST_PENGUIN = 'player-gamepad-the-first-penguin',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: {
      name: RouteName.HOME,
    }
  },

  {
    path: `/home`,
    name: RouteName.HOME,
    component: () => import('../views/the-home.vue')
  },
  {
    path: `/game-console`,
    name: RouteName.GAME_CONSOLE,
    component: () => import('../views/the-game-console.vue'),
    children: [
      {
        path: `lobby`,
        name: RouteName.GAME_CONSOLE_LOBBY,
        component: () => import('../views/the-game-console-lobby.vue')
      },
      {
        path: `the-first-penguin`,
        name: RouteName.GAME_CONSOLE_THE_FIRST_PENGUIN,
        component: () => import('../views/the-game-console-the-first-penguin.vue')
      },
    ]
  },
  {
    path: `/player-gamepad`,
    name: RouteName.PLAYER_GAMEPAD,
    component: () => import('../views/the-player-gamepad.vue'),
    children: [
      {
        path: `lobby`,
        name: RouteName.PLAYER_GAMEPAD_LOBBY,
        component: () => import('../views/the-player-gamepad-lobby.vue')
      },
      {
        path: `the-first-penguin`,
        name: RouteName.PLAYER_GAMEPAD_THE_FIRST_PENGUIN,
        component: () => import('../views/the-player-gamepad-the-first-penguin.vue')
      },
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
