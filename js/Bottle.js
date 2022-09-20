class Bottle extends Phaser.GameObjects.Sprite 
{
  constructor(scene, x, y, sprite) 
  {
    super(scene, x, y, sprite);
    this.scene = scene;

    // add the bottle to main scene
    scene.add.existing(this);
    scene.matter.add.gameObject(this);

    this.setFriction(0.4);
    this.setFrictionAir(0.009);
    this.setFrictionStatic(10);

    // make the bottle clickable
    this.setInteractive();

    this.hasFlippedInAir = false;
    this.isTouched = false;
  }

  flip(pointerY) 
  {
    if (this.isTouched) return;

    let velocity = (this.scene.startDragY - pointerY) / 20;
    if (velocity > 35) velocity = 35;

    this.setVelocity(0, -velocity);
    this.setAngularVelocity(velocity / 300);
  }

  isStanding() 
  {
    // check a couple of factors to make sure that bottle is standing
    return (
      Math.abs(this.angle) < 0.65 &&
      Math.abs(this.body.angularVelocity) < 2 &&
      Math.abs(this.body.velocity.y) < 2
    );
  }
}
