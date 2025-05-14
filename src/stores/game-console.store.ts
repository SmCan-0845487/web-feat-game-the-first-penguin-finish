import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  GameConsoleState, GameConsoleStatus,
  GameName, Player
} from '../types';

export type UpdateStateParams = Partial<GameConsoleState>;

export const useGameConsoleStore = defineStore('game-console', () => {
  const roomId = ref<string>();

  function setRoomId(id: string) {
    roomId.value = id;
  }

  const status = ref<`${GameConsoleStatus}`>('home');
  const gameName = ref<`${GameName}`>('the-first-penguin');
  const players = ref<Player[]>([]);

  function updateState(state: UpdateStateParams) {
    status.value = state.status ?? status.value;
    gameName.value = state.gameName ?? gameName.value;
    players.value = state.players ?? players.value;
  }

  return {
    status,
    gameName,
    roomId,
    players,

    setRoomId,
    updateState,
  }
})