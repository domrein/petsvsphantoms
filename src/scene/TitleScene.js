/*
Paul Milham
3/26/16
*/

import Scene from "../pxl/scene/Scene.js";
import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";
import ColorRectangle from "../pxl/actor/ColorRectangle.js";
import Text from "../pxl/actor/Text.js";
import Point from "../pxl/core/Point.js";

import PlayScene from "./PlayScene.js";

export default class TitleScene extends Scene {
  constructor(game) {
    super(game);
    this.count = 0;

    this.input.beacon.observe(this, "keyPressed", this.onKeyPressed);
    this.input.beacon.observe(this, "touchStarted", this.onTouchStarted);

    this.titleGraphic = new Actor(this);
    this.titleGraphic.graphics.push(new Sprite(this.titleGraphic));
    this.titleGraphic.graphics[0].play("titleScreen");
    this.titleGraphic.body = new Body();
    this.addActor(this.titleGraphic);

    const pup = new Actor(this);
    pup.graphics.push(new Sprite(pup));
    pup.graphics[0].play("puppy");
    pup.graphics[0].z = 1;
    pup.graphics[0].flip = true;
    pup.graphics[0].scale.x = 2;
    pup.graphics[0].scale.y = 2;
    pup.body = new Body();
    pup.body.x = 140;
    pup.body.y = 130;
    this.addActor(pup);

    const phantom = new Actor(this);
    phantom.graphics.push(new Sprite(phantom));
    phantom.graphics[0].play("phantom");
    phantom.graphics[0].z = 1;
    phantom.graphics[0].scale.x = 2;
    phantom.graphics[0].scale.y = 2;
    phantom.body = new Body();
    phantom.body.x = 290;
    phantom.body.y = 140;
    this.addActor(phantom);
  }

  update() {
    super.update();
    this.count++;

    // add sparkles
    if (this.count % 5 === 0) {
      const sparkle = new Actor(this);
      sparkle.graphics.push(new ColorRectangle(sparkle));
      const size = ~~(Math.random() * 5 + 5);
      sparkle.graphics[0].width = size;
      sparkle.graphics[0].height = size;
      switch (~~(Math.random() * 5)) {
        case 0: sparkle.graphics[0].color = "#8bff1b"; break;
        case 1: sparkle.graphics[0].color = "#1babff"; break;
        case 2: sparkle.graphics[0].color = "#f31bff"; break;
        case 3: sparkle.graphics[0].color = "#ff1b1b"; break;
        case 4: sparkle.graphics[0].color = "#ffab1b"; break;
      }
      sparkle.graphics[0].alpha = 1;
      sparkle.graphics[0].z = 2;
      sparkle.body = new Body();
      sparkle.body.velocity.d = Math.PI * .4 + Math.random() * Math.PI * .2;
      sparkle.body.velocity.m = Math.random() * .5 + .1;
      sparkle.body.x = ~~(Math.random() * this.game.width - size);
      sparkle.body.y = ~~(Math.random() * this.game.height - size);
      this.addActor(sparkle);
      const tween = this.tween.add(
        sparkle.graphics[0],
        "alpha",
        sparkle.graphics[0].alpha,
        0,
        ~~(Math.random() * 90 + 60),
        "linear"
      );
      tween.beacon.observe(this, "completed", () => {
        sparkle.alive = false;
      });
    }
  }

  onActorRemoved() {
  }

  onKeyPressed(target, keyCode) {
    this.startGame();
  }

  onTouchStarted(target, touch) {
    this.startGame();
  }

  startGame() {
    this.beacon.emit("completed", PlayScene);
  }
}
