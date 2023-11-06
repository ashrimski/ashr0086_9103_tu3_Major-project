// Main sketch file (sketch5.js)

let particles = [];
let numParticles = 1000;

function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    particle.update();
    particle.display();
  }
}

function mouseClicked() {
  for (let i = 0; i < numParticles; i++) {
    let particle = new Particle(mouseX, mouseY);
    particles.push(particle);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 5));
    this.lifespan = 255;
  }

  update() {
    this.vel.add(createVector(random(-0.1, 0.1), random(-0.1, 0.1)));
    this.pos.add(this.vel);
    this.lifespan -= 1;
  }

  display() {
    noStroke();
    fill(255, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 8, 8);
  }
}
