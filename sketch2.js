let img;
let numSegments = 80;
let segments;

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg'); // Make sure the path to the image is correct
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
}

function draw() {
  background(0);
  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].update();
      segments[y][x].draw();
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
}

class ImageSegment {
  constructor(x, y, w, h, c, a) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.alpha = a;
    this.revealing = false;
    this.revealDelay = 0;
  }

  draw() {
    // Create a color with the alpha value
    let col = color(red(this.c), green(this.c), blue(this.c), this.alpha);
    fill(col);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
    
    // Shadow and highlight colors based on the main color
    let shadowColor = color(red(this.c) * 0.8, green(this.c) * 0.8, blue(this.c) * 0.8, this.alpha);
    let highlightColor = color(red(this.c) * 1.2, green(this.c) * 1.2, blue(this.c) * 1.2, this.alpha);
    
    // Top highlight
    fill(highlightColor);
    beginShape();
    vertex(this.x, this.y);
    vertex(this.x + this.w, this.y);
    vertex(this.x + this.w - 3, this.y - 3);
    vertex(this.x - 3, this.y - 3);
    endShape(CLOSE);

    // "Lego bump" shadow
    fill(0, 0, 0, 100 * this.alpha / 255); // semi-transparent shadow
    ellipse(this.x + this.w * 0.5 + 2, this.y + this.h * 0.5 + 1, this.w * 0.4, this.h * 0.4);

    // "Lego bump"
    fill(220, 220, 220, this.alpha);
    ellipse(this.x + this.w * 0.5, this.y + this.h * 0.5, this.w * 0.4, this.h * 0.4);
  }

  update() {
    if (this.revealing) {
      if (this.revealDelay > 0) {
        this.revealDelay--;
      } else {
        this.alpha += 5;
        if (this.alpha >= 255) {
          this.alpha = 255;
          this.revealing = false;
        }
      }
    }
  }

  reveal(delay) {
    if (this.alpha === 0) {
      this.revealing = true;
      this.revealDelay = delay;
    }
  }
}

function make2Darray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
