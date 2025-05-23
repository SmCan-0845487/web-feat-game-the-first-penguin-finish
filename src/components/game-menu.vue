<template>
  <div class="flex">
    <game-menu-background
      :selected-game="selectedGame.name"
      class="outline-none absolute w-full h-full z-0"
      @camera-movement-end="showMenu()"
      @completed="handleCompleted()"
    />

    <div class=" w-1/2 h-full flex flex-col items-center justify-center gap-12 pr-24 pb-10 z-0">
      <room-id-chip class="menu-item" />

      <base-btn
        :ref="mountButton"
        v-slot="{ hover }"
        label="開始遊戲"
        class=" w-[28rem] menu-item"
        label-hover-color="#3676a3"
        stroke-color="#456b87"
        stroke-hover-color="white"
        @click="startGame()"
      >
        <transition name="opacity">
          <div
            v-if="hover"
            class="btn-content absolute inset-0"
          >
            <div class="polygon-lt">
              <base-polygon
                size="13rem"
                shape="round"
                fill="spot"
                opacity="0.3"
                class="polygon-beat"
              />
            </div>

            <div class="polygon-rb">
              <base-polygon
                size="13rem"
                shape="round"
                fill="fence"
                opacity="0.2"
                class="polygon-beat"
              />
            </div>
          </div>
        </transition>
      </base-btn>

      <base-btn
        :ref="mountButton"
        v-slot="{ hover }"
        label="結束派對"
        class=" w-[28rem] menu-item"
        label-hover-color="#3676a3"
        stroke-color="#456b87"
        stroke-hover-color="white"
        @click="endParty()"
      >
        <transition name="opacity">
          <div
            v-if="hover"
            class="btn-content absolute inset-0"
          >
            <div class="polygon-lt">
              <base-polygon
                size="13.4rem"
                shape="square"
                fill="spot"
                opacity="0.3"
                class="polygon-swing"
              />
            </div>
            <div class="polygon-rb">
              <base-polygon
                size="13.3rem"
                shape="square"
                fill="fence"
                opacity="0.2"
                class="polygon-swing"
              />
            </div>
          </div>
        </transition>
      </base-btn>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { GameName } from '../types';
import { RouteName } from '../router/router';
import { debounce } from 'lodash-es';

import BaseBtn from './base-btn.vue';
import BasePolygon from './base-polygon.vue';
import RoomIdChip from './room-id-chip.vue';
import GameMenuBackground from './game-menu-background.vue';

import { useGamepadNavigator } from '../composables/use-gamepad-navigator';
import { useClientGameConsole } from '../composables/use-client-game-console';
import { useRouter } from 'vue-router';
import { useLoading } from '../composables/use-loading';

interface GameInfo {
  name: `${GameName}`;
  routeName: `${RouteName}`;
}

const emit = defineEmits<{
  (e: 'completed'): void;
}>();

const games: GameInfo[] = [
  {
    name: 'the-first-penguin',
    routeName: 'game-console-the-first-penguin',
  },
];

const gameConsole = useClientGameConsole();
const router = useRouter();
const loading = useLoading();

const currentIndex = ref(0);
const selectedGame = computed(() => games[currentIndex.value]);
function prevGame() {
  currentIndex.value--;
  if (currentIndex.value < 0) {
    currentIndex.value += games.length;
  }
}
function nextGame() {
  currentIndex.value++;
  currentIndex.value %= games.length;
}

let menuTween: ReturnType<typeof gsap.fromTo>;
onMounted(() => {
  menuTween = gsap.fromTo('.menu-item', {
    opacity: 0,
    translateY: '50%',
  }, {
    opacity: 1,
    translateY: '0%',
    duration: 0.6,
    ease: 'back.out(1.7)',
    /** 多個元素間隔時間 */
    stagger: 0.2,
    /** 動畫完成後刪除 inline-style，以免影響其他 CSS */
    clearProps: 'transform',
  });
  menuTween.pause();
});

function showMenu() {
  menuTween.play();
}
function handleCompleted() {
  emit('completed');
}


const { mountElement, click, next, prev } = useGamepadNavigator();

/** 將按鈕綁定 */
function mountButton(el: unknown) {
  const controlElement = el as InstanceType<typeof BaseBtn>;
  mountElement(controlElement)
}

const startGame = debounce(async () => {
  gameConsole.setStatus('playing');
  gameConsole.setGameName(selectedGame.value.name);

  await loading.show();

  router.push({
    name: selectedGame.value.routeName
  });
}, 3000, {
  leading: true,
  trailing: false,
});

const endParty = debounce(async () => {
  gameConsole.setStatus('home');
  await loading.show();
  gameConsole.endParty();

  router.push({
    name: RouteName.HOME
  });
}, 3000, {
  leading: true,
  trailing: false,
});

/** 讓其他元件可以控制選單 */
defineExpose({
  click, next, prev, prevGame, nextGame,
});
</script>

<style scoped lang="sass">

.btn-content
  background: #307da1

.polygon-lt
  position: absolute
  left: -6rem
  top: -6rem
  animation: polygon-rotate 50s infinite linear
.polygon-rb
  position: absolute
  right: -6rem
  bottom: -6rem
  animation: polygon-rotate 40s infinite linear

@keyframes polygon-rotate
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.polygon-beat
  animation: polygon-beat 1.4s infinite

.polygon-swing
  animation: polygon-swing 1.8s infinite

@keyframes polygon-beat
  0%
    transform: scale(1)
    animation-timing-function: cubic-bezier(0.000, 0.000, 1.000, 0.000)
  50%
    transform: scale(0.9)
    animation-timing-function: cubic-bezier(0.000, 1.000, 1.000, 1.000)
  100%
    transform: scale(1)

@keyframes polygon-swing
  0%
    transform: scale(1)
    animation-timing-function: cubic-bezier(0.870, 0.000, 0.180, 0.995)
  50%
    transform: scale(0.9)
    animation-timing-function: cubic-bezier(0.870, 0.000, 0.260, 1.375)
  100%
    transform: scale(1)
</style>