class Particle{
    constructor(){
      this.pos = createVector(random(width), random(height));
      this.vel = createVector(0, 0);
          this.colour = img.get(round(this.pos.x), round(this.pos.y));
    }
      show(){
          stroke(img.get(round(this.pos.x), round(this.pos.y)));
          line(this.pos.x, this.pos.y, this.pos.x - this.vel.x, this.pos.y - this.vel.y);
      }
   update(){
      this.vel = createVector(0, 0);
      for(let i = 0; i < attractors.length; i++){
        this.vector = p5.Vector.sub(this.pos, attractors[i].pos);
        this.vector.setMag(1/this.vector.mag());
        if(attractors[i].clockwise) this.vector.rotate(-HALF_PI);
        else this.vector.rotate(HALF_PI);
        this.vel.add(this.vector);
      }
      this.vel.setMag(1);
      this.pos.add(this.vel);
     
      }
  }