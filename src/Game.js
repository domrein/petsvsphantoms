import Game from "./pxl/core/Game.js";
import Canvas2dRenderer from "./pxl/core/Canvas2dRenderer.js";

import TitleScene from "./scene/TitleScene.js";
import PlayScene from "./scene/PlayScene.js";
import sprites from "./sprites.js";

export default class _Game extends Game {
  constructor() {
    super(480, 360, TitleScene, Canvas2dRenderer, "canvas");

    this.score = 0;

    this.inputRelay.preventDefaults = [
      // controls
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "z",
      "x",
      // block scrolling
      " ",
    ];

    // preload assets
    this.preloader.addImage("../assets/sprites.png");

    // this.preloader.addAudio("../assets/audio/EnemyDie.wav", "enemyDie");
    // this.preloader.addAudio("../assets/audio/EnemyHit.wav", "enemyHit");
    // this.preloader.addAudio("../assets/audio/Laser.wav", "laser");
    // this.preloader.addAudio("../assets/audio/Poop.wav", "poop");
    // this.preloader.addAudio("../assets/audio/RobotBatteryGet.wav", "robotBatteryGet");
    // this.preloader.addAudio("../assets/audio/TerminalBatteryGet.wav", "terminalBatteryGet");

    // this.preloader.addAudio("../assets/audio/BGMusic.mp3", "bgMusic");

    this.spriteStore.frameData = {"../assets/sprites.png": sprites};
    this.spriteStore.animData = {
      heart: {frames: ["heart1"], frameRate: 10, looping: true},
      kitty: {frames: ["kitty1", "kitty2", "kitty3", "kitty4"], frameRate: 10, looping: true},
      puppy: {frames: ["puppy1", "puppy2", "puppy3", "puppy4"], frameRate: 6, looping: true},
      snake: {frames: ["littlesnake1"], frameRate: 6, looping: true},
      snakespit: {frames: ["snakespit1", "snakespit2", "snakespit3"], frameRate: 6, looping: true},
      phantom: {frames: ["phantom1", "phantom1", "phantom2", "phantom3", "phantom4", "phantom4", "phantom3", "phantom2"], frameRate: 15, looping: true},
      playBackground: {frames: ["play_background1"], frameRate: 1, looping: true},
      playForeground: {frames: ["play_foreground1"], frameRate: 1, looping: true},
      playPetSelector: {frames: ["play_pet_selector1"], frameRate: 1, looping: true},
      crater: {frames: ["crater1"], frameRate: 1, looping: true},
      titleScreen: {frames: ["titlescreen1"], frameRate: 1, looping: true},
    };
  }
}
