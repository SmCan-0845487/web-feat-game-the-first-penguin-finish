import { RouteName } from "../router/router";

/** 遊戲名稱 */
export enum GameName {
  THE_FIRST_PENGUIN = 'the-first-penguin',
}

export interface GameInfo {
  name: `${GameName}`;
  title: string;
  description: string;
  routeName: `${RouteName}`;
}

/** 遊戲狀態 */
export enum GameConsoleStatus {
  /** 首頁 */
  HOME = 'home',
  /** 大廳 */
  LOBBY = 'lobby',
  /** 遊戲中 */
  PLAYING = 'playing',
}

/** 玩家 */
export interface Player {
  /** 唯一 ID */
  readonly clientId: string;
  /** 表示玩家手機端允許的 API 清單 */
  permissions?: any;
}

export interface GameConsoleState {
  status: `${GameConsoleStatus}`;
  gameName: `${GameName}`;
  players: Player[];
}
