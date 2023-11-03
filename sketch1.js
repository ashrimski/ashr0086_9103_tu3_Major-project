let particles = [];
let attractors = [];
let nParticles = 1000;
let img;



function preload(){
	img = loadImage("https://github.com/ashrimski/group-code.git");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	if(width > height){
		img.resize(0, height);
	}else{
		img.resize(width, 0);
	}
	
	resizeCanvas(img.width, img.height);
	
	background(0);
	
	for(let i = 0; i < nParticles; i++){
    particles[i] = new Particle();
  }
}

function draw() {
	
	strokeWeight(attractors.length * 2);
	
  for(let i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].show();
  }
	
  for(let i = 0; i < attractors.length; i++){
    //attractors[i].show();
		//attractors[i].update();
		attractors[i].lifeTime --;
		
		if(attractors[i].lifeTime <= 0){
			attractors.splice(i, 1);
		}
    
  }
}

function mousePressed(){
    attractors.push(new Attractor(mouseX, mouseY));
}



