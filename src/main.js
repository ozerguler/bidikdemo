import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { VillageIntro } from './scenes/VillageIntro.js';
import { Level1 } from './scenes/Level1.js';

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: '#1b1f2a',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: [Boot, Preload, VillageIntro, Level1]
};

new Phaser.Game(config);
