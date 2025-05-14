<template>
  <div
    class="w-full h-full flex text-white select-none"
    :class="bgClass"
    @touchmove="(e) => e.preventDefault()"
  >
    <gamepad-d-pad
      class="absolute bottom-5 left-8 opacity-90"
      @trigger="({ keyName, status }) => handleBtnTrigger(keyName, status)"
    />
    <gamepad-btn
      class="absolute bottom-10 right-20 opacity-90"
      size="6rem"
      icon="done"
      @trigger="(status) => handleBtnTrigger('confirm', status)"
    />

    <div class="code-name">
      {{ codeName }}
    </div>

    <q-dialog
      v-model="isPortrait"
      persistent
    >
      <q-card class="p-8">
        <q-card-section class="flex flex-col items-center gap-6">
          <q-spinner-box
            color="primary"
            size="10rem"
          />
          <div class="text-4xl">
            請將手機轉為橫向
          </div>
          <div class="text-base">
            轉為橫向後，此視窗會自動關閉
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import GamepadBtn from '../components/gamepad-btn.vue';
import GamepadDPad from '../components/gamepad-d-pad.vue';

import { useLoading } from '../composables/use-loading';
import { useClientPlayer } from '../composables/use-client-player';
import { useScreenOrientation } from '@vueuse/core';
import { KeyName } from '../types';

const { orientation } = useScreenOrientation();
const loading = useLoading();
const { codeName, colorName, emitGamepadData } = useClientPlayer();

function init() {
  loading.hide();
}
init();

const isPortrait = computed(() => orientation.value?.includes('portrait') ?? false);

const bgClass = computed(() => `bg-${colorName.value}`);

function handleBtnTrigger(keyName: `${KeyName}`, status: boolean) {
  console.log(`[ handleBtnTrigger ] : `, { keyName, status });

  emitGamepadData([{
    name: keyName,
    value: status,
  }]);
}
</script>

<style scoped lang="sass">
.code-name
  position: absolute
  top: 0
  left: 50%
  transform: translateX(-50%)
  display: flex
  justify-content: center
  padding: 0.1rem
  font-size: 10rem
  text-shadow: 0px 0px 2rem rgba(#000, 0.5)
</style>
