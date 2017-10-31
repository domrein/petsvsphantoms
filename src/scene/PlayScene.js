/*
Paul Milham
10/15/17
*/

import Scene from "../pxl/scene/Scene.js";
import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";
import ColorRectangle from "../pxl/actor/ColorRectangle.js";
import Text from "../pxl/actor/Text.js";
import Point from "../pxl/core/Point.js";

import Pet from "../actor/Pet.js";
import Phantom from "../actor/Phantom.js";
import Particle from "../actor/Particle.js";
import TitleScene from "./TitleScene.js";

export default class PlayScene extends Scene {
  constructor(game) {
    super(game);

    this.physics.collisionPairs = [
      ["pet", "phantom"],
      ["projectile", "phantom"],
    ];

    // this.input.beacon.observe(this, "keyPressed", this.onKeyPressed);

    this.gridCellSize = 54;
    this.gridPadLeft = 12;
    this.gridPadTop = 73;
    this.gridRows = 5;
    this.gridColumns = 8;

    this.gridPets = [];
    this.gridPhantoms = [];
    this.dragTarget = null;
    this.deadRows = new Set();
    this.gameOver = false;
    this.count = 0;
    this.lastSpawn = 0;

    this._hearts = 0;
    this.kittyCost = 5;
    this.puppyCost = 7;
    this.snakeCost = 2;

    // background
    const background = new Actor(this);
    background.body = new Body();
    background.graphics.push(new Sprite(background));
    background.graphics[0].play("playBackground");
    background.graphics[0].z = -1;
    this.addActor(background);

    const foreground = new Actor(this);
    foreground.body = new Body();
    foreground.graphics.push(new Sprite(foreground));
    foreground.graphics[0].play("playForeground");
    foreground.body.y = 284;
    foreground.graphics[0].z = 1;
    this.addActor(foreground);

    // gui
    const petSelector = new Actor(this);
    petSelector.body = new Body();
    petSelector.graphics.push(new Sprite(petSelector));
    petSelector.graphics[0].play("playPetSelector");
    petSelector.body.y = 0;
    petSelector.body.x = 135;
    petSelector.graphics[0].z = 1;
    this.addActor(petSelector);

    this.petSelectorKitty = new Actor(this);
    this.petSelectorKitty.body = new Body();
    this.petSelectorKitty.body.width = 48;
    this.petSelectorKitty.body.height = 48;
    this.petSelectorKitty.graphics.push(new Sprite(this.petSelectorKitty));
    this.petSelectorKitty.graphics[0].play("kitty");
    this.petSelectorKitty.body.y = 10;
    this.petSelectorKitty.body.x = 150;
    this.petSelectorKitty.graphics[0].z = 3;
    this.petSelectorKitty.graphics[0].flip = true;
    this.addActor(this.petSelectorKitty);

    this.petSelectorKittyGauge = new Actor(this);
    this.petSelectorKittyGauge.body = new Body();
    this.petSelectorKittyGauge.graphics.push(new ColorRectangle(this.petSelectorKittyGauge));
    this.petSelectorKittyGauge.graphics[0].color = "#ff6bb9";
    this.petSelectorKittyGauge.graphics[0].width = 52;
    this.petSelectorKittyGauge.graphics[0].height = 52;
    this.petSelectorKittyGauge.graphics[0].alpha = 1;
    this.petSelectorKittyGauge.body.y = 8;
    this.petSelectorKittyGauge.body.x = 148;
    this.petSelectorKittyGauge.graphics[0].z = 2;
    this.addActor(this.petSelectorKittyGauge);

    this.petSelectorPuppy = new Actor(this);
    this.petSelectorPuppy.body = new Body();
    this.petSelectorPuppy.body.width = 48;
    this.petSelectorPuppy.body.height = 48;
    this.petSelectorPuppy.graphics.push(new Sprite(this.petSelectorPuppy));
    this.petSelectorPuppy.graphics[0].play("puppy");
    this.petSelectorPuppy.body.y = 9;
    this.petSelectorPuppy.body.x = 218;
    this.petSelectorPuppy.graphics[0].z = 3;
    this.petSelectorPuppy.graphics[0].flip = true;
    this.addActor(this.petSelectorPuppy);

    this.petSelectorPuppyGauge = new Actor(this);
    this.petSelectorPuppyGauge.body = new Body();
    this.petSelectorPuppyGauge.graphics.push(new ColorRectangle(this.petSelectorPuppyGauge));
    this.petSelectorPuppyGauge.graphics[0].color = "#ff6bb9";
    this.petSelectorPuppyGauge.graphics[0].width = 52;
    this.petSelectorPuppyGauge.graphics[0].height = 52;
    this.petSelectorPuppyGauge.graphics[0].alpha = 1;
    this.petSelectorPuppyGauge.body.y = 8;
    this.petSelectorPuppyGauge.body.x = 216;
    this.petSelectorPuppyGauge.graphics[0].z = 2;
    this.addActor(this.petSelectorPuppyGauge);

    this.petSelectorSnake = new Actor(this);
    this.petSelectorSnake.body = new Body();
    this.petSelectorSnake.body.width = 48;
    this.petSelectorSnake.body.height = 48;
    this.petSelectorSnake.graphics.push(new Sprite(this.petSelectorSnake));
    this.petSelectorSnake.graphics[0].play("snake");
    this.petSelectorSnake.body.y = 14;
    this.petSelectorSnake.body.x = 285;
    this.petSelectorSnake.graphics[0].z = 3;
    this.petSelectorSnake.graphics[0].flip = true;
    this.addActor(this.petSelectorSnake);

    this.petSelectorSnakeGauge = new Actor(this);
    this.petSelectorSnakeGauge.body = new Body();
    this.petSelectorSnakeGauge.body.y = 9;
    this.petSelectorSnakeGauge.body.x = 283;
    this.petSelectorSnakeGauge.graphics.push(new ColorRectangle(this.petSelectorSnakeGauge));
    this.petSelectorSnakeGauge.graphics[0].color = "#ff6bb9";
    this.petSelectorSnakeGauge.graphics[0].width = 52;
    this.petSelectorSnakeGauge.graphics[0].height = 52;
    this.petSelectorSnakeGauge.graphics[0].alpha = 1;
    this.petSelectorSnakeGauge.graphics[0].z = 2;
    this.addActor(this.petSelectorSnakeGauge);

    this.gridHighlight = new Actor(this);
    this.gridHighlight.body = new Body();
    this.gridHighlight.graphics.push(new ColorRectangle(this.gridHighlight));
    this.gridHighlight.graphics[0].width = this.gridCellSize;
    this.gridHighlight.graphics[0].height = this.gridCellSize;
    this.gridHighlight.graphics[0].z = 1;
    this.gridHighlight.graphics[0].visible = false;
    this.gridHighlight.graphics[0].alpha = .5;
    this.addActor(this.gridHighlight);

    this.gridPetPlacer = new Actor(this);
    this.gridPetPlacer.body = new Body();
    this.gridPetPlacer.graphics.push(new Sprite(this.gridPetPlacer));
    this.gridPetPlacer.graphics[0].z = 4;
    this.gridPetPlacer.graphics[0].visible = false;
    this.gridPetPlacer.graphics[0].alpha = .5;
    this.gridPetPlacer.graphics[0].flip = true;
    this.gridPetPlacer.graphics[0].offset = new Point(-24, -24);
    this.addActor(this.gridPetPlacer);

    // this.foo = new Actor(this);
    // this.foo.body = new Body(this.foo);
    // this.foo.body.velocity.m = 6;
    // this.foo.graphics.push(new Sprite(this.foo));
    // this.foo.graphics[0].play("snakespit");
    // this.foo.graphics[0].z = 1;
    // // // this.foo.graphics[0].visible = false;
    // // this.foo.graphics[0].alpha = .9;
    // // this.foo.graphics[0].flip = true;
    // this.addActor(this.foo);

    // listen for touch events
    this.input.beacon.observe(this, "touchStarted", this.onTouchStarted);
    this.input.beacon.observe(this, "touchMoved", this.onTouchMoved);
    this.input.beacon.observe(this, "touchEnded", this.onTouchEnded);

    // listen for actors dying
    this.beacon.observe(this, "actorRemoved", this.onActorRemoved);

    this.hearts = 5;
  }

  get hearts() {
    return this._hearts;
  }

  set hearts(val) {
    this._hearts = val;
    this.petSelectorKittyGauge.graphics[0].offset.y = 54 - Math.min(this._hearts, this.kittyCost) / this.kittyCost * 54;
    this.petSelectorKittyGauge.graphics[0].height = Math.min(this._hearts, this.kittyCost) / this.kittyCost * 54;
    this.petSelectorKittyGauge.graphics[0].alpha = Math.min(this._hearts / this.kittyCost, 1);
    this.petSelectorPuppyGauge.graphics[0].offset.y = 54 - Math.min(this._hearts, this.puppyCost) / this.puppyCost * 54;
    this.petSelectorPuppyGauge.graphics[0].height = Math.min(this._hearts, this.puppyCost) / this.puppyCost * 54;
    this.petSelectorPuppyGauge.graphics[0].alpha = Math.min(this._hearts / this.puppyCost, 1);
    this.petSelectorSnakeGauge.graphics[0].offset.y = 54 - Math.min(this._hearts, this.snakeCost) / this.snakeCost * 54;
    this.petSelectorSnakeGauge.graphics[0].height = Math.min(this._hearts, this.snakeCost) / this.snakeCost * 54;
    this.petSelectorSnakeGauge.graphics[0].alpha = Math.min(this._hearts / this.snakeCost, 1);
  }

  update() {
    super.update();
    this.count++;
    this.lastSpawn++;

    let spawnChance = 1;
    const spawnInterval = 4800;
    // const spawnLag = 0;
    const spawnLag = 1000;
    let closestSpawn = 120;
    if (this.count < spawnLag) {
      spawnChance = 1;
      closestSpawn = 120;
    }
    else if (this.count < spawnInterval * 1 + spawnLag) {
      spawnChance = 0.9975;
      closestSpawn = 120;
    }
    else if (this.count < spawnInterval * 2 + spawnLag) {
      spawnChance = 0.99;
      closestSpawn = 100;
    }
    else if (this.count < spawnInterval * 3 + spawnLag) {
      spawnChance = 0.985;
      closestSpawn = 80;
    }
    else if (this.count < spawnInterval * 4 + spawnLag) {
      spawnChance = 0.98;
      closestSpawn = 60;
    }
    else if (this.count < spawnInterval * 5 + spawnLag) {
      spawnChance = 0.97;
      closestSpawn = 40;
    }
    else {
      spawnChance = 0.9;
      closestSpawn = 10;
    }

    if ((Math.random() > spawnChance) && !this.gameOver && closestSpawn <= this.lastSpawn) {
      this.lastSpawn = 0;
      let row = -1;
      do {
        row = ~~(Math.random() * this.gridRows);
      }
      while (row === -1 || this.deadRows.has(row));

      const phantom = new Phantom(this);
      phantom.body.x = this.game.width;
      phantom.body.y = this.gridPadTop + this.gridCellSize * row;
      this.addActor(phantom);
      this.gridPhantoms.push({row, phantom});
    }

    // TODO: if phantom makes it past the left side, kill everything in lane and shut it down
    //       if all lanes shut down, you lose
    this.gridPhantoms.forEach(p => {
      if (p.phantom.body.x < -30) {
        // kill row
        p.phantom.alive = false;

        this.deadRows.add(p.row);
        this.killRow(p.row);
        if (this.deadRows.size === this.gridRows && !this.gameOver) {
          // game over
          this.gameOver = true;
          setTimeout(() => this.beacon.emit("completed", TitleScene), 3000);
        }
      }
    });
  }

  killRow(row) {
    for (let i = 0; i < this.gridColumns; i++) {
      setTimeout(() => {
        this.gridPets.filter(pet => {
          return pet.y === row && pet.pet.body.x <= this.gridPadLeft + i * this.gridCellSize
        }).forEach(pet => {
          pet.pet.alive = false;
          pet.pet.die();
        });
        this.gridPhantoms.filter(phantom => {
          return phantom.row === row && ((phantom.phantom.body.x <= this.gridPadLeft + i * this.gridCellSize + this.gridCellSize) || i === this.gridColumns - 1)
        }).forEach(phantom => {
          phantom.phantom.alive = false;
          phantom.phantom.die();
        });

        // add crater
        const crater = new Actor(this);
        crater.body = new Body();
        crater.body.x = this.gridPadLeft + i * this.gridCellSize;
        crater.body.y = this.gridPadTop + row * this.gridCellSize;
        crater.graphics.push(new Sprite(crater));
        crater.graphics[0].play("crater");
        crater.graphics[0].z = 1;
        this.addActor(crater);

        this.burst(
          "#444",
          10,
          this.gridPadLeft + i * this.gridCellSize + this.gridCellSize / 2,
          this.gridPadTop + row * this.gridCellSize + this.gridCellSize / 2
        );

        // shake dat screen
        this.camera.shake(3, 5);
        this.camera.shake(3, 5);
      }, i * 200);
    }
  }

  onActorRemoved(source, actor) {
    this.gridPets = this.gridPets.filter(p => p.pet !== actor);
    this.gridPhantoms = this.gridPhantoms.filter(p => p.phantom !== actor);
  }

  onKeyPressed(source, key) {
  }

  onTouchStarted(source, touch) {
    // pick up hearts
    const hearts = this.actors.filter(a => a.body.type === "heart" && a.body.contains(touch));
    if (hearts.length) {
      hearts[0].alive = false;
      this.hearts += 1;
      this.burst("#ff6bb9", 3, hearts[0].body.x + 16, hearts[0].body.y + 16);
      return;
    }
    // see what we're touching
    // create pet
    if (this.petSelectorKitty.body.contains(touch) && this._hearts >= this.kittyCost) {
      this.gridPetPlacer.graphics[0].play("kitty");
      this.gridPetPlacer.graphics[0].visible = true;
      this.dragTarget = {type: "create", pet: "kitty"};
    }
    else if (this.petSelectorPuppy.body.contains(touch) && this._hearts >= this.puppyCost) {
      this.gridPetPlacer.graphics[0].play("puppy");
      this.gridPetPlacer.graphics[0].visible = true;
      this.dragTarget = {type: "create", pet: "puppy"};
    }
    else if (this.petSelectorSnake.body.contains(touch) && this._hearts >= this.snakeCost) {
      this.gridPetPlacer.graphics[0].play("snake");
      this.gridPetPlacer.graphics[0].visible = true;
      this.dragTarget = {type: "create", pet: "snake"};
    }
    else {
      // move pet
      const pets = this.gridPets.filter(p => p.pet.body.contains(touch));
      if (pets.length) {
        const pet = pets[0];
        this.dragTarget = {type: "move", pet};
        pet.pet.inDrag = true;
        pet.pet.graphics[0].offset.x = -24;
        pet.pet.graphics[0].offset.y = -24;
        pet.pet.body.disabled = true;
      }
    }

    if (this.dragTarget) {
      this.tryGridDrag(touch);
    }
  }

  onTouchMoved(source, touch) {
    if (!this.dragTarget) {
      return;
    }

    this.tryGridDrag(touch);
  }

  onTouchEnded(source, touch) {
    if (!this.dragTarget) {
      return;
    }

    const cell = this.findGridCell(touch);
    if (cell) {
      const valid = this.isCellValid(this.dragTarget.type, cell);
      if (valid && this.dragTarget.type === "create") {
        this.createPet(this.dragTarget.pet, cell);
      }
      else if (valid && this.dragTarget.type === "move") {
        this.dragTarget.pet.pet.body.x = cell.x * this.gridCellSize + this.gridPadLeft;
        this.dragTarget.pet.pet.body.y = cell.y * this.gridCellSize + this.gridPadTop;
        this.dragTarget.pet.pet.inDrag = false;
        this.dragTarget.pet.x = cell.x;
        this.dragTarget.pet.y = cell.y;
        this.dragTarget.pet.pet.graphics[0].offset.x = 0;
        this.dragTarget.pet.pet.graphics[0].offset.y = 0;
        this.dragTarget.pet.pet.body.disabled = false;
      }
      else if (this.dragTarget.type === "move") {
        this.dragTarget.pet.pet.body.x = this.dragTarget.pet.x * this.gridCellSize + this.gridPadLeft;
        this.dragTarget.pet.pet.body.y = this.dragTarget.pet.y * this.gridCellSize + this.gridPadTop;
        this.dragTarget.pet.pet.inDrag = false;
        this.dragTarget.pet.x = cell.x;
        this.dragTarget.pet.y = cell.y;
        this.dragTarget.pet.pet.graphics[0].offset.x = 0;
        this.dragTarget.pet.pet.graphics[0].offset.y = 0;
        this.dragTarget.pet.pet.body.disabled = false;
      }
    }

    this.gridHighlight.graphics[0].visible = false;
    this.gridPetPlacer.graphics[0].visible = false;
    this.dragTarget = null;
  }

  tryGridDrag(touch) {
    // add grid highlight
    if (this.dragTarget.type === "create") {
      this.gridPetPlacer.body.x = touch.x;
      this.gridPetPlacer.body.y = touch.y;
    }
    else {
      this.dragTarget.pet.pet.body.x = touch.x;
      this.dragTarget.pet.pet.body.y = touch.y;
    }
    const cell = this.findGridCell(touch);
    if (cell) {
      const valid = this.isCellValid(this.dragTarget.type, cell);
      this.highlightGridCell(valid ? "#1E4" : "#E11", cell);
    }
    else {
      this.gridHighlight.graphics[0].visible = false;
    }
  }

  isCellValid(type, cell) {
    const sameCellPets = this.gridPets.filter(p => p.x === cell.x && p.y === cell.y);
    const valid = !sameCellPets.length;
    return valid && !this.deadRows.has(cell.y);
  }

  findGridCell(point) {
    // 12 buffer on left, 8 cells at this.gridCellSize px
    if (point.x < this.gridPadLeft || point.x > this.gridCellSize * this.gridColumns + this.gridPadLeft) {
      return null;
    }
    else if (point.y < this.gridPadTop || point.y > this.gridPadTop + this.gridCellSize * this.gridRows) {
      return null;
    }
    return new Point(
      ~~((point.x - this.gridPadLeft) / this.gridCellSize),
      ~~((point.y - this.gridPadTop) / this.gridCellSize)
    );
  }

  highlightGridCell(color, point) {
    this.gridHighlight.body.x = point.x * this.gridCellSize + this.gridPadLeft;
    this.gridHighlight.body.y = point.y * this.gridCellSize + this.gridPadTop;
    this.gridHighlight.graphics[0].color = color;
    this.gridHighlight.graphics[0].visible = true;
  }

  createPet(type, cell) {
    switch(type) {
      case "kitty": this.hearts -= this.kittyCost; break;
      case "puppy": this.hearts -= this.puppyCost; break;
      case "snake": this.hearts -= this.snakeCost; break;
    }
    const pet = new Pet(this, type);
    pet.body.x = cell.x * this.gridCellSize + this.gridPadLeft;
    pet.body.y = cell.y * this.gridCellSize + this.gridPadTop;
    this.addActor(pet);
    this.gridPets.push({x: cell.x, y: cell.y, pet});
  }

  burst(color, num, x, y) {
    for (let i = 0; i < num; i++) {
      const size = ~~(Math.random() * 5 + 5);
      const sparkle = new Particle(this, color, size, 40);
      sparkle.body.velocity.d = Math.random() * Math.PI * 2;
      sparkle.body.velocity.m = Math.random() * 3 + 1;
      sparkle.body.x = x;
      sparkle.body.y = y;
      this.addActor(sparkle);
    }
  }
}
