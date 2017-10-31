/*
Paul Milham
10/29/17
*/

import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";

import Projectile from "./Projectile.js";
import Heart from "./Heart.js";

export default class Pet extends Actor {
  constructor(scene, type) {
    super(scene);

    this.body = new Body();
    this.body.width = 48;
    this.body.height = 48;

    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "pet";

    this.graphics.push(new Sprite(this));
    this.graphics[0].play(type);
    this.graphics[0].flip = true;
    this.graphics[0].z = 0;

    this.health = 1;
    this.cooldown = 0;
    this.cooldownCount = 0;
    this.projectile = null;
    this.type = type;
    this.inDrag = false;

    switch (type) {
      case "kitty":
        this.health = 2;
        this.cooldown = 600;
        break;
      case "puppy":
        this.health = 10;
        break;
      case "snake":
        this.health = 1;
        this.projectile = "snakespit";
        this.cooldown = 120;
        break;
    }
  }

  update() {
    super.update();

    if (this.inDrag) {
      return;
    }

    this.cooldownCount++;
    if (this.cooldownCount >= this.cooldown && this.projectile) {
      this.cooldownCount = 0;
      const projectile = new Projectile(this.scene, this.projectile);
      projectile.body.x = this.body.x;
      projectile.body.y = this.body.y;
      if (this.projectile === "snakespit") {
        projectile.body.x += 30;
        projectile.body.y += 15;
      }
      this.scene.addActor(projectile);
    }

    if (this.type === "kitty" && this.cooldownCount >= this.cooldown) {
      this.cooldownCount = 0;
      const heart = new Heart(this.scene);
      heart.body.x = this.body.x;
      heart.body.y = this.body.y;
      heart.body.velocity.m = 5;
      heart.body.velocity.d = Math.random() * Math.PI * 2;
      this.scene.addActor(heart);
    }
  }

  onCollided() {
    if (this.inDrag) {
      return;
    }

    this.health--;
    if (!this.health) {
      this.alive = false;
      this.die();
    }
  }

  die() {
    let color = "#000";
    switch (this.type) {
      case "kitty": color = "#8d53af"; break;
      case "puppy": color = "#7cd77c"; break;
      case "snake": color = "#6ac851"; break;
    }
    this.scene.burst(color, 20, this.body.x + 24, this.body.y + 24);
    this.scene.camera.shake(2, 15);
  }
}
