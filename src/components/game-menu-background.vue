<template>
  <canvas ref="canvas" />
</template>


<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
  ArcRotateCamera, BackEase, BackgroundMaterial, Color3,
  EasingFunction,
  Engine, MeshBuilder, Scene, Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

import { createPenguinIsland } from './game-menu/the-first-penguin';
import { GameName, ModelIsland } from '../types';
import { createAnimation } from '../common/utils';

interface Shot {
  name: `${GameName}`;
  camera: {
    target: Vector3;
    alpha: number;
    beta: number;
    radius: number;
  }
}

interface Props {
  selectedGame: `${GameName}`;
}
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'camera-movement-start'): void;
  (e: 'camera-movement-end'): void;
}>();

const canvas = ref<HTMLCanvasElement>();
let engine: Engine;
let scene: Scene;
let camera: ArcRotateCamera;

function createEngine(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true);
  return engine;
}
function createScene(engine: Engine) {
  const scene = new Scene(engine);
  /** 使用預設光源 */
  scene.createDefaultLight();

  scene.fogMode = Scene.FOGMODE_LINEAR;
  scene.fogStart = 50;
  scene.fogEnd = 400;

  const color = Color3.FromHexString('#f0faff');
  scene.clearColor = color.toColor4(1);
  scene.fogColor = color;

  return scene;
}

function createCamera(scene: Scene) {
  const camera = new ArcRotateCamera(
    'camera',
    1.5, 0, 360,
    new Vector3(-28, 1.3, -0.5),
    scene
  );

  return camera;
}
const shots: Shot[] = [
  {
    name: 'the-first-penguin',
    camera: {
      target: new Vector3(-4, 0.67, 1.31),
      alpha: 4.339,
      beta: 1.034,
      radius: 13.046,
    }
  }
];

const ease = new BackEase();
ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
async function moveCamera(first = false) {
  const shot = shots.find(({ name }) => name === props.selectedGame);
  if (!shot) return;

  const results = [
    createAnimation(camera, 'target', shot.camera.target, { easingFunction: ease }),
    createAnimation(camera, 'alpha', shot.camera.alpha, { easingFunction: ease }),
    createAnimation(camera, 'beta', shot.camera.beta, { easingFunction: ease }),
    createAnimation(camera, 'radius', shot.camera.radius),
  ]

  const animations = results.map(({ animation }) => animation);

  const speed = first ? 0.15 : 0.5;

  emit('camera-movement-start');
  const ref = scene.beginDirectAnimation(camera, animations, 0, results[0].frameRate, false, speed);
  await ref.waitAsync();
  emit('camera-movement-end');

  const target = islands.find(({ name }) => name === props.selectedGame);
  target?.setActive(true);
}

function createSea(scene: Scene) {
  const sea = MeshBuilder.CreateGround('sea', { height: 1000, width: 1000 });

  const material = new BackgroundMaterial('sea-material', scene);
  material.useRGBColor = false;
  material.primaryColor = new Color3(71 / 256, 174 / 256, 250 / 256);

  sea.material = material;

  return sea;
}

/** 將所有島嶼儲存至此 */
let islands: ModelIsland[] = [];
async function createIslands(scene: Scene) {
  const result = await createPenguinIsland(scene);
  islands.push(result);
}

async function init() {
  if (!canvas.value) {
    console.error('無法取得 canvas DOM');
    return;
  }

  engine = createEngine(canvas.value);
  scene = createScene(engine);

  camera = createCamera(scene);
  camera.attachControl(canvas.value, true);
  /** 調整滾輪縮放程度 */
  camera.wheelDeltaPercentage = 0.01;

  createSea(scene);
  await createIslands(scene);

  /** 反覆渲染場景，這樣畫面才會持續變化 */
  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('keydown', (ev) => {
    // 按下 Shift+I 可以切換視窗
    if (ev.shiftKey && ev.keyCode === 73) {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
      } else {
        scene.debugLayer.show();
      }
    }
  });

  /** 發出完成事件，表示畫面初始化完成 */
  emit('completed');
}

onMounted(async () => {
  window.addEventListener('resize', handleResize);

  await init();
  moveCamera(true);
});

onBeforeUnmount(() => {
  engine.dispose();
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  engine.resize();
}

</script>
