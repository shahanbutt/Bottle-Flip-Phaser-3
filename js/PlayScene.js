let score = 0;
// save best score to the browser
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let isThemePlaying = false;

class PlayScene extends Phaser.Scene 
{
  constructor() 
  {
    super("PlayScene");
  }

  preload() 
  {
    //preloading images
    this.load.image("background", "./assets/background.png");
    this.load.image("bottle", "/assets/bottle.png");
    this.load.image("floor", "./assets/floor.png");
    this.load.audio("win", ["./assets/win.mp3"]);

    this.load.audio("theme", ["./assets/theme.ogg"]);
    this.load.audio("fail", ["./assets/fail.mp3"]);
    this.load.audio("flip", ["./assets/flip.mp3"]);
  }

  create() 
  {
    this.winSound = this.sound.add("win");
    this.theme = this.sound.add("theme");
    this.failSound = this.sound.add("fail");
    this.flipSound = this.sound.add("flip");

    !isThemePlaying && this.theme.play({ loop: true , volume: 0.1 });

    isThemePlaying = true;

    this.gw = this.game.config.width;
    this.gh = this.game.config.height;

    this.startDragY = 0;

    this.addBackground();
    this.addScoreText();

    this.addFloor();
    this.addBottle();
    this.addDragEvents();
  }

  update() 
  {
    //CHECK IF THE BOTTLE HAS FLIPPED IN AIR
    if (Math.abs(this.bottle.angle) > 160) 
    {
      this.bottle.hasFlippedInAir = true;
    }
  }

  bottleTouchFloor() 
  {
    //CHECKING IF THE BOTTLE IS STANDING STRAIGHT AND HAS BEEN TOUCHED
    if (this.bottle.isStanding() && this.bottle.isTouched) 
    {
      // delay for the bottle to completely decelerate
      this.time.delayedCall(2000, () => 
      {
        //MAKING SURE THAT BOTTLE IS STANDING
        if (this.bottle.isStanding()) 
        {
          this.winSound.play();
          // prevent score add bug
          if (this.bottle.hasFlippedInAir) 
          {
            score++;
          }

          if (score > bestScore) 
          {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
          }

          this.scene.restart();

          // check if bottle is not standing
        } 
        else if (this.bottle.body.velocity.y === 0 && this.bottle.isTouched) 
        {
          this.scene.restart();
          this.failSound.play();
        }
      });
    }

    // check if bottle is not standing
    if (this.bottle.body.velocity.y === 0 && this.bottle.isTouched) 
    {
      this.scene.restart();
      this.failSound.play();
    }
  }

  addBackground() 
  {
    this.background = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh);
  }

  addScoreText() 
  {
    const textConfig = 
    {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "80px",
    };

    this.scoreText = this.add
      .text(10, 10, "score " + score, textConfig)
      .setOrigin(0, 0);

    this.bestScoreText = this.add
      .text(this.gw - 10, 10, "best " + bestScore, textConfig)
      .setOrigin(1, 0);
  }

  addFloor() 
  {
    this.floor = this.add.image(0, this.gh, "floor").setOrigin(0, 1);

    // floor hitbox
    this.floorBody = this.matter.add.rectangle(
      this.gw / 2,
      this.gh - 40,
      this.floor.displayWidth,
      this.floor.displayHeight,
      { isStatic: true }
    );
  }

  addBottle() 
  {
    this.bottle = new Bottle(this, this.gw / 2, this.floor.y, "bottle");
    this.bottle.y -= this.bottle.height / 2;

    // set bottle draggable
    this.input.setDraggable(this.bottle);

    // bottle touching floor callback
    this.bottle.setOnCollideActive(() => this.bottleTouchFloor());
  }

  addDragEvents() 
  {
    // we need store start Y to check drag distance
    this.input.on(
      "dragstart",
      (activePointer) => (this.startDragY = activePointer.y)
    );

    // flip bottle
    this.input.on("dragend", (activePointer) => 
    {
      this.flipSound.play();
      this.bottle.flip(activePointer.y);
      this.bottle.isTouched = true;
    });
  }
}