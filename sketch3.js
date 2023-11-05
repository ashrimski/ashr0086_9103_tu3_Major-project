let particles = [];
let attractors = [];
let nParticles = 1000;
let img, img2; // img for particles background, img2 for segments
let numSegments = 80;
let segments;

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg');
  // You'll need to host your second image or provide its URL
  img2 = loadImage('assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Resize and set up for the particle system's image
  if (width > height) {
    img.resize(0, height);
  } else {
    img.resize(width, 0);
  }
  resizeCanvas(img.width, img.height);
  background(img);


  // Initialize particles
  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle();
  }

  // Resize and set up for the segmented image
  if (img2.width !== img.width || img2.height !== img.height) {
    img2.resize(img.width, img.height);
  }

  let segmentWidth = img2.width / numSegments;
  let segmentHeight = img2.height / numSegments;

  segments = make2Darray(numSegments, numSegments);

  for (let y = 0; y < numSegments; y++) {
    for (let x = 0; x < numSegments; x++) {
      let segXPos = x * segmentWidth;
      let segYPos = y * segmentHeight;
      let segmentColour = img2.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      segments[y][x] = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
    }
  }
}

function draw() {
  // Draw segments
  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].draw();
    }
  }

  // Draw particles over the segments
  strokeWeight(attractors.length * 2);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  // Update and draw attractors
  for (let i = 0; i < attractors.length; i++) {
    attractors[i].lifeTime--;
    if (attractors[i].lifeTime <= 0) {
      attractors.splice(i, 1);
    }
  }
}

function mousePressed() {
  attractors.push(new Attractor(mouseX, mouseY));
}

// Define the ImageSegment class
class ImageSegment {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  draw() {
    fill(this.c);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    
  }
}

// Function to create a 2D array
function make2Darray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}



