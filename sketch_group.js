

let img;
let numSegments = 80;
let segments;

function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  segments = make2Darray(numSegments, numSegments); // Initialize the 2D array
  
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
  console.log(segments)
  console.log(segments[1][2])
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
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5 + 2, this.srcImgSegYPos + this.srcImgSegHeight * 0.5-0.5, bumpDiameter, bumpDiameter);

    // Lego bump
    fill(220);
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5, this.srcImgSegYPos + this.srcImgSegHeight * 0.5-2, bumpDiameter, bumpDiameter);

  }
}

function make2Darray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;

}
