"use strict";

// Load in dependencies
const spritesmith = require("spritesmith");
const fs = require("fs");
const util = require("util");

spritesmith.run = util.promisify(spritesmith.run);
fs.writeFile = util.promisify(fs.writeFile);

// Generate our spritesheet
const sprites = [
  "assets/images/heart1.png",
  "assets/images/kitty1.png",
  "assets/images/kitty2.png",
  "assets/images/kitty3.png",
  "assets/images/kitty4.png",
  "assets/images/puppy1.png",
  "assets/images/puppy2.png",
  "assets/images/puppy3.png",
  "assets/images/puppy4.png",
  "assets/images/snake1.png",
  "assets/images/snakespit1.png",
  "assets/images/snakespit2.png",
  "assets/images/snakespit3.png",
  "assets/images/littlesnake1.png",
  "assets/images/phantom1.png",
  "assets/images/phantom2.png",
  "assets/images/phantom3.png",
  "assets/images/phantom4.png",
  "assets/images/play_background1.png",
  "assets/images/play_foreground1.png",
  "assets/images/play_pet_selector1.png",
  "assets/images/crater1.png",
  "assets/images/titlescreen1.png",
];
(async () => {
  const result = await spritesmith.run({src: sprites});
  await fs.writeFile("assets/sprites.png", result.image);
  const coords = {};
  for (const [file, coord] of Object.entries(result.coordinates)) {
    coords[file.replace("assets/images/", "").replace(".png", "")] = coord;
  }
  await fs.writeFile("src/sprites.js", `export default ${JSON.stringify(coords)}`);
})();
