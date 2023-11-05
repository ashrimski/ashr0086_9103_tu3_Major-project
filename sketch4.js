let img;
let numSegments = 80;
let segments;
let particles = [];
let nParticles = 1000;
let attractors = [];

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  segments = make2Darray(numSegments, numSegments);

  for (let y = 0; y < numSegments; y++) {
    for (let x = 0; x < numSegments; x++) {
      let segXPos = x * segmentWidth;
      let segYPos = y * segmentHeight;
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      segments[y][x] = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour, 0);
    }
  }

  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0);

  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].update();
      segments[y][x].draw();
    }
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  // Update and draw attractors
  for (let i = attractors.length - 1; i >= 0; i--) {
    attractors[i].update();
    attractors[i].show();
    // Remove the attractor if its lifetime has elapsed
    if (attractors[i].lifeTime <= 0) {
      attractors.splice(i, 1);
    }
  }
}

function mousePressed() {
  let segmentX = floor(mouseX / (img.width / numSegments));
  let segmentY = floor(mouseY / (img.height / numSegments));

  for (let y = max(segmentY - 5, 0); y < min(segmentY + 5, numSegments); y++) {
    for (let x = max(segmentX - 5, 0); x < min(segmentX + 5, numSegments); x++) {
      let d = dist(segmentX, segmentY, x, y);
      let delay = map(d, 0, 5, 0, 30);
      segments[y][x].reveal(delay);
    }
  }

  attractors.push(new Attractor(mouseX, mouseY));
}

class ImageSegment {
  constructor(x, y, w, h, c, a) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.a = a; // Alpha for transparency
    this.revealing = false;
    this.revealDelay = 0;
  }

  draw() {
    let col = color(red(this.c), green(this.c), blue(this.c), this.a);
    fill(col);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  update() {
    if (this.revealing) {
      if (this.revealDelay > 0) {
        this.revealDelay--;
      } else {
        this.a += 5; // Increment alpha
        if (this.a >= 255) {
          this.a = 255;
          this.revealing = false;
        }
      }
    }
  }

  reveal(delay) {
    if (!this.revealing && this.a === 0) {
      this.revealing = true;
      this.revealDelay = delay;
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.colour = img.get(round(this.pos.x), round(this.pos.y));
  }

  show() {
    stroke(this.colour);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x, this.pos.y - this.vel.y);
  }

  update() {
    this.vel = createVector(0, 0);
    for (let i = 0; i < attractors.length; i++) {
      let force = p5.Vector.sub(this.pos, attractors[i].pos);
      let distanceSq = force.magSq();
      distanceSq = constrain(distanceSq, 100, 500);
      let strength = 100 / distanceSq;
      force.setMag(strength);
      this.vel.add(force);
    }
    this.pos.sub(this.vel);
  }
}

class Attractor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.lifeTime = 255; // Start with a full lifeTime
  }

  show() {
    noStroke();
    fill(255, this.lifeTime);
    ellipse(this.pos.x, this.pos.y, 10);
  }

  update() {
    this.pos.add(this.vel);
    this.lifeTime -= 2; // Decrease the lifetime each frame
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }
}

function make2Darray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
