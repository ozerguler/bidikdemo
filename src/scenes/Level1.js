export class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    /* --------------------------------------------------
     * WORLD / ZEMİN
     * -------------------------------------------------- */
    this.platforms = this.physics.add.staticGroup();

    // Ana zemin
    this.platforms.create(180, 620, null)
      .setDisplaySize(360, 40)
      .setOrigin(0.5)
      .refreshBody();

    // Platformlar
    this.platforms.create(220, 480, null)
      .setDisplaySize(100, 20)
      .refreshBody();

    this.platforms.create(320, 390, null)
      .setDisplaySize(100, 20)
      .refreshBody();

    /* --------------------------------------------------
     * PLAYER
     * -------------------------------------------------- */
    this.player = this.physics.add.sprite(60, 520, 'bidik', 0);
    this.player.setScale(0.8);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(70, 90).setOffset(30, 30);

    this.physics.add.collider(this.player, this.platforms);

    /* --------------------------------------------------
     * INPUT
     * -------------------------------------------------- */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    /* --------------------------------------------------
     * PLAYER STATE
     * -------------------------------------------------- */
    this.playerState = 'idle';

    /* --------------------------------------------------
     * ITEMS (KRİSTALLER)
     * -------------------------------------------------- */
    this.items = this.physics.add.staticGroup();

    this.items.create(220, 440, 'crystal');
    this.items.create(320, 320, 'crystal');

    this.collected = 0;
    this.required = 2;

    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    /* --------------------------------------------------
     * UI
     * -------------------------------------------------- */
    this.counterText = this.add.text(16, 16,
      `Kristal: 0 / ${this.required}`,
      {
        fontSize: '14px',
        color: '#ffffff'
      }
    );

    /* --------------------------------------------------
     * EXIT DOOR
     * -------------------------------------------------- */
    this.door = this.physics.add.staticSprite(340, 560, 'door');
    this.doorLocked = true;

    this.physics.add.collider(this.player, this.door);

    this.doorText = this.add.text(
      this.door.x,
      this.door.y - 40,
      'KAPALI',
      {
        fontSize: '12px',
        color: '#ffcc00'
      }
    ).setOrigin(0.5);

    /* --------------------------------------------------
     * ANIMATIONS
     * -------------------------------------------------- */
    this.createAnimations();

    this.player.play('idle');
  }

  /* ==================================================
   * UPDATE
   * ================================================== */
  update() {
    const speed = 160;
    let nextState = 'idle';

    // Yatay hareket
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

    // Zıplama
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-420);
      nextState = 'jump';
    }

    // Havada
    if (!this.player.body.onFloor()) {
      nextState = 'jump';
    }

    // Animasyon geçişi
    if (this.playerState !== nextState) {
      this.playerState = nextState;
      this.player.anims.play(nextState, true);
    }

    // Kapı etkileşimi
    if (
      !this.doorLocked &&
      Phaser.Input.Keyboard.JustDown(this.keyE) &&
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.door.x,
        this.door.y
      ) < 50
    ) {
      this.finishLevel();
    }

    // Çukur (düşme)
    if (this.player.y > 700) {
      this.respawn();
    }
  }

  /* ==================================================
   * METHODS
   * ================================================== */

  createAnimations() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 0,
        end: 3
      }),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 8,
        end: 15
      }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('bidik', {
        start: 16,
        end: 20
      }),
      frameRate: 10,
      repeat: 0
    });
  }

  collectItem(player, item) {
    item.destroy();
    this.collected++;

    this.counterText.setText(
      `Kristal: ${this.collected} / ${this.required}`
    );

    if (this.collected >= this.required) {
      this.unlockDoor();
    }
  }

  unlockDoor() {
    this.doorLocked = false;
    this.doorText.setText('[E] AÇ');
    this.doorText.setColor('#00ff88');
  }

  finishLevel() {
    this.scene.start('VillageIntro'); // şimdilik geri döndürüyoruz
  }

  respawn() {
    this.player.setPosition(60, 520);
    this.player.setVelocity(0, 0);
  }
}
