/*
Paul Milham
10/31/17
*/

import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";
import Point from "../pxl/core/Point.js";

export default class Heart extends Actor {
  constructor(scene) {
    super(scene);

    this.body = new Body();
    this.body.width = 32;
    this.body.height = 32;
    this.body.type = "heart";

    this.graphics.push(new Sprite(this));
    this.graphics[0].play("heart");
    this.graphics[0].flip = true;
    this.graphics[0].pivot.x = 16;
    this.graphics[0].pivot.y = 16;
    this.graphics[0].z = 3;

    this.count = 0;
    this.activateFriction = 0;
  }

  update() {
    super.update();

    if (this.count === this.activateFriction) {
      this.body.friction = new Point(.9, .9);
    }

    this.count++;
    this.graphics[0].scale.x = .9 + Math.sin(this.count / 20) * .1;
    this.graphics[0].scale.y = .9 + Math.sin(this.count / 20) * .1;

    if (this.count > 900) {
      this.alive = false;
    }
  }
}
