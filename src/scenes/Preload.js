export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.spritesheet(
      'bidik',
      'src/assets/bidikadam.png',
      {
        frameWidth: 128,
        frameHeight: 128
      }
    );
  }

  create() {
    this.scene.start('VillageIntro');
  }
}
