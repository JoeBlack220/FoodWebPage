let sketch = function (p5){


// --------------------- Sketch-wide variables ----------------------let matrix;
let allSpecies = [];
let speciesNum;
let matrix;
let level_length = [840, 720, 600, 480, 360, 240, 120];
let num_level = 7;
let systems = [];
let targets = [];
let time_table = [];
let dead_time = [];
let tp = true;
let tp_list = [];
// let targets;
//PShape bigCircle;
// ------------------------ Initialization --------------------------

// Initializes the data and bar chart.


p5.preload = function(){
  matrix = p5.loadTable('./data/Energy/carpinteria.csv', 'csv');
}

p5.setup = function(){
  p5.createCanvas(800, 900);
  systems = [];
  speciesNum = matrix.getRowCount()-3;
  for (let r=3; r<matrix.getRowCount(); r++){
    let relations = [];
    for (let c=3; c<matrix.getColumnCount(); c++){
      relations.push(matrix.getNum(r, c));
    }
    allSpecies.push(new Species(matrix.getNum(r, 0), matrix.getNum(r, 1), relations));
  }
}


p5.draw = function()
{
  p5.background(255); 
  p5.stroke(0); 

  var s = p5.second()+60*p5.minute();
  for (i=0; i<time_table.length; i++){
    for (j=0; j<time_table[i].length; j++){
      if (s==time_table[i][j]){
        ps = new ParticleSystem(targets[i][j], targets[i][j+1], j, tp_list[i]);
        systems.push(ps);
      }
    }
  }

  if(s==dead_time[0]){
    systems.splice(0, 1);
    dead_time.splice(0, 1);
  }

  for (i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }

  p5.stroke(0);
  for (i=0; i<speciesNum; i++){
    p5.noFill();
    // fill(allSpecies[i].getColor());
    p5.circle(allSpecies[i].getX(), allSpecies[i].getY(), 8);
  }

  p5.stroke(150);
  p5.textSize(18);
      p5.fill(252,141,89);

  p5.text('Plastic', 32, 55);
  p5.fill(116,196,118);

  p5.text('Energy', 32, 22);
  if (tp){
    p5.fill(116,196,118);
    p5.rect(10, 10, 20, 20);
    p5.noFill();
    p5.rect(10, 40, 20, 20);
  }
  else{
    p5.noFill();
    p5.rect(10, 10, 20, 20);
    p5.fill(252,141,89);
    p5.rect(10, 40, 20, 20);
  }
}

class Species{
  constructor(level, pos, r){
    level = p5.int(level);
    this.level = level;
    this.r = r;
    this.xCor = p5.float(pos * level_length[level] - level_length[level]/2 + 400);
    this.yCor = p5.float(800-level*100);
  }
  getX(){
    return this.xCor;
  }
  getY(){
    return this.yCor;
  }
  getLevel(){
    return this.level;
  }
  getPred(){
    for (let i=0; i<speciesNum; i++){
      if (p5.int(this.r[i])!=0){
        return i;
      }
    }
    return -1;
  }
  getRelation(j){
    return this.r[j];
  }
}

p5.mousePressed = function() {
  if (p5.mouseX<=30 && p5.mouseX>=10 && p5.mouseY<=30 && p5.mouseY>=10) tp = true;
  if (p5.mouseX<=30 && p5.mouseX>=10 && p5.mouseY<=60 && p5.mouseY>=40) tp = false;

  for (let i=0; i<speciesNum; i++){
    if ((p5.mouseX-allSpecies[i].getX())*(p5.mouseX-allSpecies[i].getX()) + (p5.mouseY-allSpecies[i].getY())*(p5.mouseY-allSpecies[i].getY()) < 100){
      var target = [];
      var timeline = []
      var t = p5.second()+60*p5.minute()+2;
      target.push(p5.createVector(allSpecies[i].getX(), allSpecies[i].getY()));
      var idx = allSpecies[i].getPred();
      timeline.push(t);
      target.push(p5.createVector(allSpecies[idx].getX(), allSpecies[idx].getY()));
      t += p5.int(p5.dist(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[idx].getX(), allSpecies[idx].getY())/25);
      timeline.push(t);
      while(allSpecies[idx].getPred()>0){
        idx1 = allSpecies[idx].getPred();
        target.push(p5.createVector(allSpecies[idx1].getX(), allSpecies[idx1].getY()));
        t += p5.int(p5.dist(allSpecies[idx].getX(), allSpecies[idx].getY(), allSpecies[idx1].getX(), allSpecies[idx1].getY())/25);        
        timeline.push(t);
        idx = idx1;
      }
      target.push(p5.createVector(p5.random(allSpecies[idx].getX()-5, allSpecies[idx].getX()+5), allSpecies[idx].getY()-100));
      targets.push(target);
      time_table.push(timeline);
      if (tp) dead_time.push(t+6);
      else dead_time.push(t+60);
      tp_list.push(tp);
    }
  }

}

let Particle = function(position, target, level, obj) {
  this.origin = position.copy();
  this.position = position.copy();
    tmp = target.copy();
    tmp.sub(position);
    this.dist = tmp.mag();
    this.target = tmp.normalize();
    this.dest = target.copy();
    this.obj = obj;
    this.level = level;
    if (obj){
      if(Math.floor(Math.random()*10) <= 3){
        this.velocity = p5.createVector(this.target.x*5, this.target.y*5);
      }
      else{
        this.velocity = p5.createVector(p5.random(0, this.target.x)*5, p5.random(0, this.target.y)*5);
      }
    }
    else {
      if(Math.floor(Math.random()*10) <= 7){
        this.velocity = p5.createVector(this.target.x*5, this.target.y*5);
      }
      else{
        this.velocity = p5.createVector(p5.random(0, this.target.x)*5, p5.random(0, this.target.y)*5);
      }
    }
  this.lifespan = 255;
  // this.speed = this.velocity.mag()/this.target.mag();
  // this.lifespan = this.target.x*10;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

Particle.prototype.update = function(){
  // this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  if(this.obj) {
    this.lifespan -= 100/this.dist;
  }
  else {
    this.lifespan -= 10/this.dist;
    this.velocity.mult(0.975);
  }
};

Particle.prototype.display = function () {
  // stroke(50, this.lifespan);
  p5.noStroke();
  p5.strokeWeight(1);
  if(this.obj==false) p5.fill(252,141,89);
  else p5.fill(116,196,118, this.lifespan/2);
  // getEnergyColor(this.level);
  p5.ellipse(this.position.x, this.position.y, 3, 2.5);
};

Particle.prototype.isDead = function () {
  // if (this.lifespan < 0) {
  //     return true;
  //   } else {
  //     if (this.position.y < this.dest.y)
  //       return true;
  //     else
  //       return false;
  //   }
  if (this.position.y < this.dest.y){
    if (this.obj) return true;
    else{
      this.velocity = p5.createVector(p5.random(-this.target.x, this.target.x)/4, p5.random(-this.target.y, this.target.y)/4);
      return false;
    }
  }
  else {
    if (this.lifespan < 0) {
      return true;
      }
    else return false;
  }
};

let ParticleSystem = function (origin, target, level, obj){
  this.origin = origin.copy();
  this.particles = [];
  // add for loop to support multi-targets on one level
  this.target = target.copy();
  this.obj = obj;

  if(obj) this.lifesp = 500*p5.pow(0.2, level);
  else this.lifesp = 100;
  this.level = level;
};

ParticleSystem.prototype.addParticle = function () {
  if(this.lifesp>0){
    p = new Particle(this.origin, this.target, this.level, this.obj);
    this.particles.push(p);
  }
};

ParticleSystem.prototype.run = function () {
  if(this.obj==false) p5.fill(252,141,89, this.lifespan/2);
  else p5.fill(116,196,118, this.lifespan/2);
  p5.circle(this.origin.x, this.origin.y, 8);
  
  if (this.obj) this.lifesp -= 10;
  else this.lifesp -= 10;
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    // this.lifesp -= 10;
    if (p.isDead()) this.particles.splice(i, 1);
    
    if(this.lifesp<0 && this.obj ){
      return;
    }
  }
};

}