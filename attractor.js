class Attractor{
	constructor(x, y){
		this.pos = createVector(x, y);
		this.vel = createVector(random(-1, 1), random(-1, 1));
		this.lifeTime = 500;
		if(random(1) > 0.5) this.clockwise = true;
    else this.clockwise = false;
	}
	show(){
    if(this.clockwise) fill(255, 0, 0);
    else fill(0, 255, 0);
    circle(this.pos.x, this.pos.y, 50);
  }
	update(){
		this.pos.add(this.vel);
		
		if(this.pos.x >= width || this.pos.x <= 0) this.vel.x *=  -1;
		if(this.pos.y >= height || this.pos.y <= 0) this.vel.y *=  -1;
	}
}