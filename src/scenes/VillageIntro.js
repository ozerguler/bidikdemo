export class VillageIntro extends Phaser.Scene {
  constructor() {
    super('VillageIntro');
  }

  create() {
    // --- ZEMİN ---
    this.ground = this.add.rectangle(180, 620, 360, 40, 0x2e2e2e);
    this.physics.add.existing(this.ground, true);

    // --- PLAYER ---
    this.player = this.physics.add.sprite(180, 480, 'bidik', 0);
    this.player.setScale(0.8);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(70, 90).setOffset(30, 30);

    this.physics.add.collider(this.player, this.ground);

    // --- INPUT ---
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- STATE ---
    this.playerState = 'idle';

    // --- ANIMATIONS ---
    // Idle (4 frame)
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 0,
        end: 3
      }),
      frameRate: 2,
      repeat: -1
    });

    // Walk (8 frame)
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 8,
        end: 15
      }),
      frameRate: 12,
      repeat: -1
    });

    // Jump / Reaction (5 frame)
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 16,
        end: 20
      }),
      frameRate: 10,
      repeat: 0
    });

    // Başlangıç animasyonu
    this.player.play('idle');

    // --- UI ---
    this.add.text(180, 80,
      'Bıdık Adam\nNormal Olmak İstiyor...',
      {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.add.text(180, 140,
      '← → Yürü | ↑ Zıpla',
      {
        fontSize: '14px',
        color: '#aaaaaa'
      }
    ).setOrigin(0.5);

      this.exitX = 330;

  }

  update() {
    const speed = 160;
    let nextState = 'idle';

    // --- YATAY HAREKET ---
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      nextState = 'walk';

    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
      nextState = 'walk';

    } else {
      this.player.setVelocityX(0);
    }

    // --- ZIPLAMA ---
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-420);
      nextState = 'jump';
    }

    // --- HAVADAYSA ---
    if (!this.player.body.onFloor()) {
      nextState = 'jump';
    }

    // --- ANİMASYON GEÇİŞİ (Flicker YOK) ---
    if (this.playerState !== nextState) {
      this.playerState = nextState;
      this.player.anims.play(nextState, true);
    }
    if (this.player.x >= this.exitX) {
     this.scene.start('Level1');
    }
  }
}
