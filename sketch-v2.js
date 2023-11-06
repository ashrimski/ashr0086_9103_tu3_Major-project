let img;
let numSegments = 80;
let segments;

let particles = [];
let attractors = [];
let nParticles = 1000;

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let segmentWidth = width / numSegments;
  let segmentHeight = height / numSegments;

  segments = make2Darray(numSegments, numSegments);

  for (let y = 0; y < numSegments; y++) {
    for (let x = 0; x < numSegments; x++) {
      let segXPos = x * segmentWidth;
      let segYPos = y * segmentHeight;
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      segments[y][x] = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
    }
  }

  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0);

  // Render the 3D block effect
  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].draw();
    }
  }

  // Update and display particles
  strokeWeight(attractors.length * 5);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  // Update attractors' lifetime
  for (let i = 0; i < attractors.length; i++) {
    attractors[i].lifeTime--;
    if (attractors[i].lifeTime <= 0) {
      attractors.splice(i, 1);
    }
  }
}

function make2Darray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function mousePressed() {
  attractors.push(new Attractor(mouseX, mouseY));
}

class ImageSegment {
  constructor(srcImgSegXPosInPrm, srcImgSegYPosInPrm, srcImgSegWidthInPrm, srcImgSegHeightInPrm, srcImgSegColourInPrm) {
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
  }

  draw() {
    let depth = 3;

    let shadowColor = color(red(this.srcImgSegColour) * 0.8, green(this.srcImgSegColour) * 0.8, blue(this.srcImgSegColour) * 0.8);
    let highlightColor = color(red(this.srcImgSegColour) * 1.2, green(this.srcImgSegColour) * 1.2, blue(this.srcImgSegColour) * 1.2);

    // Main block color
    fill(this.srcImgSegColour);
    noStroke();
    rect(this.srcImgSegXPos, this.srcImgSegYPos, this.srcImgSegWidth, this.srcImgSegHeight);

    // Top highlight
    fill(highlightColor);
    beginShape();
    vertex(this.srcImgSegXPos, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth - depth, this.srcImgSegYPos - depth);
    vertex(this.srcImgSegXPos - depth, this.srcImgSegYPos - depth);
    endShape(CLOSE);

    let bumpDiameter = min(this.srcImgSegWidth, this.srcImgSegHeight) * 0.4;
    // Shadow for bump
    fill(0, 0, 0, 100); // semi-transparent black for shadow
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5 + 2, this.srcImgSegYPos + this.srcImgSegHeight * 0.5 - 0.5, bumpDiameter, bumpDiameter);

    // Lego bump
    fill(220);
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5, this.srcImgSegYPos + this.srcImgSegHeight * 0.5 - 2, bumpDiameter, bumpDiameter);
  }
}

class Attractor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.lifeTime = 500;
    if (random(1) > 0.5) this.clockwise = true;
    else this.clockwise = false;
  }
  show() {
    if (this.clockwise) fill(255, 0, 0);
    else fill(0, 255, 0);
    circle(this.pos.x, this.pos.y, 50);
  }
  update() {
    this.pos.add(this.vel);

    if (this.pos.x >= width || this.pos.x <= 0) this.vel.x *= -1;
    if (this.pos.y >= height || this.pos.y <= 0) this.vel.y *= -1;
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.colour = img.get(round(this.pos.x), round(this.pos.y));
  }
  show() {
    stroke(img.get(round(this.pos.x), round(this.pos.y)));
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x, this.pos.y - this.vel.y);
  }
  update() {
    this.vel = createVector(0, 0);
    for (let i = 0; i < attractors.length; i++) {
      this.vector = p5.Vector.sub(this.pos, attractors[i].pos);
      this.vector.setMag(1 / this.vector.mag());
      if (attractors[i].clockwise) this.vector.rotate(-HALF_PI);
      else this.vector.rotate(HALF_PI);
      this.vel.add(this.vector);
    }
    this.vel.setMag(1);
    this.pos.add(this.vel);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
