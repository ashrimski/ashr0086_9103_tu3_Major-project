let img;
let numSegments = 80;
let segments;
let particles = [];
let attractor;

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg'); // Ensure the image path is correct
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
      segments[y][x] = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
    }
  }
}

function draw() {
  background(0);

  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].draw();
    }
  }

  attractor && particles.forEach(p => {
    let force = p5.Vector.sub(attractor, p.pos);
    force.setMag(0.2);
    p.applyForce(force);
    p.update();
    p.display();
  });
  
  particles = particles.filter(p => !p.isFinished());
}

function mousePressed() {
  attractor = createVector(mouseX, mouseY);
  for (let i = 0; i < 10; i++) {
    let col = img.get(mouseX, mouseY);
    particles.push(new Particle(createVector(mouseX, mouseY), col));
  }
}

function make2Darray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

class ImageSegment {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  draw() {
    let depth = 3;
    let shadowColor = color(red(this.c) * 0.8, green(this.c) * 0.8, blue(this.c) * 0.8);
    let highlightColor = color(red(this.c) * 1.2, green(this.c) * 1.2, blue(this.c) * 1.2);

    // Main block color
    fill(this.c);
    noStroke();
    rect(this.x, this.y, this.w, this.h);

    // Top highlight
    fill(highlightColor);
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x + this.w, this.y);
    vertex(this.x + this.w - depth, this.y - depth);
    vertex(this.x - depth, this.y - depth);
    endShape(CLOSE);

    // Lego bump
    let bumpDiameter = min(this.w, this.h) * 0.4;
    // Shadow for bump
    fill(0, 0, 0, 100); // semi-transparent black for shadow
    ellipse(this.x + this.w * 0.5 + 2, this.y + this.h * 0.5 - 0.5, bumpDiameter, bumpDiameter);

    // Bump
    fill(220);
    ellipse(this.x + this.w * 0.5, this.y + this.h * 0.5 - 2, bumpDiameter, bumpDiameter);
  }
}

class Particle {
  constructor(pos, color) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.color = color;
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.lifespan -= 2;
  }

  display() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.lifespan);
    circle(this.pos.x, this.pos.y, 8);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}
