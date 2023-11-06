let img;
let numSegments = 60;
let segments = [];
let drawSegments = true;

function preload() {
  img = loadImage('/assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  for (let segYPos = 0; segYPos < img.height; segYPos += segmentHeight) {
    for (let segXPos = 0; segXPos < img.width; segXPos += segmentWidth) {
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
      segments.push(segment);
    }
  }
}

function draw() {
  background(0);
  if (drawSegments) {
    for (const segment of segments) {
      segment.draw();
    }
  } else {
    image(img, 0, 0);
  }
}

function keyPressed() {
  if (key == " ") {
    drawSegments = !drawSegments;
  }
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
    let depth = 5;
    
    let shadowColor = color(red(this.srcImgSegColour) * 0.8, green(this.srcImgSegColour) * 0.8, blue(this.srcImgSegColour) * 0.8);
    let highlightColor = color(red(this.srcImgSegColour) * 1.2, green(this.srcImgSegColour) * 1.2, blue(this.srcImgSegColour) * 1.2);

    // Main block color
    fill(this.srcImgSegColour);
    noStroke();
    rect(this.srcImgSegXPos, this.srcImgSegYPos, this.srcImgSegWidth, this.srcImgSegHeight);

    // Right shadow
    fill(shadowColor);
    beginShape();
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth + depth, this.srcImgSegYPos + depth);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth + depth, this.srcImgSegYPos + this.srcImgSegHeight + depth);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos + this.srcImgSegHeight);
    endShape(CLOSE);

    // Bottom shadow
    beginShape();
    vertex(this.srcImgSegXPos, this.srcImgSegYPos + this.srcImgSegHeight);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos + this.srcImgSegHeight);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth + depth, this.srcImgSegYPos + this.srcImgSegHeight + depth);
    vertex(this.srcImgSegXPos, this.srcImgSegYPos + this.srcImgSegHeight + depth);
    endShape(CLOSE);

    // Top highlight
    fill(highlightColor);
    beginShape();
    vertex(this.srcImgSegXPos, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth - depth, this.srcImgSegYPos - depth);
    vertex(this.srcImgSegXPos - depth, this.srcImgSegYPos - depth);
    endShape(CLOSE);

    // Lego bump
    let bumpDiameter = min(this.srcImgSegWidth, this.srcImgSegHeight) * 0.5;
    let bumpHeight = bumpDiameter * 0.3;
    fill(this.srcImgSegColour);
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5, this.srcImgSegYPos + this.srcImgSegHeight * 0.5, bumpDiameter, bumpDiameter);

    // Shadow for bump
    fill(0, 0, 0, 50); // semi-transparent black for shadow
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5 + 2, this.srcImgSegYPos + this.srcImgSegHeight * 0.5 + 2, bumpDiameter, bumpDiameter);
  }
}
