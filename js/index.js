const config = 
{
  type: Phaser.AUTO,
  physics: 
  {
    default: "matter",
    matter: {
      debug: false,
      gravity: { y: 3 },
    },
  },

  scale: 
  {
    mode: Phaser.Scale.FIT,
    width: 900,
    height: 1400,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PlayScene],
};

const game = new Phaser.Game(config);
