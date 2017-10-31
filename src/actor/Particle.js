/*
Paul Milham
10/31/17
*/

import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";
import ColorRectangle from "../pxl/actor/ColorRectangle.js";
import Point from "../pxl/core/Point.js";

export default class Heart extends Actor {
  constructor(scene, color, size, life) {
    super(scene);

    this.body = new Body();
    this.body.friction = new Point(.99, .99);
    this.body.type = "particle";

    this.graphics.push(new ColorRectangle(this));
    this.graphics[0].color = color;
    this.graphics[0].width = size;
    this.graphics[0].height = size;
    this.graphics[0].z = 3;

    this.count = 0;
    this.life = life;
  }

  update() {
    super.update();

    this.count++;

    if (this.count > this.life) {
      this.graphics[0].alpha -= 0.05;
      if (this.graphics[0].alpha <= 0) {
        this.alive = false;
      }
    }
  }
}
