<template>
  <game-menu
    ref="menu"
    class=" w-full h-full absolute"
    @completed="handleCompleted()"
  />

  <player-list class=" absolute w-full left-0 bottom-0 z-0" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import GameMenu from '../components/game-menu.vue';
import PlayerList from '../components/player-list.vue';

import { useLoading } from '../composables/use-loading';
import { useClientGameConsole } from '../composables/use-client-game-console';

const loading = useLoading();
const gameConsole = useClientGameConsole();

function handleCompleted() {
  init();
}

const menu = ref<InstanceType<typeof GameMenu>>();

function init() {
  gameConsole.setStatus('lobby');
  loading.hide();

  gameConsole.onGamepadData((data) => {
    console.log(`[ onGamepadData ] data : `, data);

    const datum = data.keys.at(-1);
    if (!datum) return;

    const { name, value } = datum;
    if (value) return;

    if (name === 'up') {
      menu.value?.prev();
      return;
    }

    if (name === 'down') {
      menu.value?.next();
      return;
    }

    if (name === 'confirm') {
      menu.value?.click();
      return;
    }
  });
}

</script>

<style scoped lang="sass">
</style>