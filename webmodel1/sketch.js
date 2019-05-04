let sketchEnergy = function (p){
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


p.preload = function(){
  matrix = p.loadTable('./data/Energy/carpinteria.csv', 'csv');
}

p.setup = function(){
  p.createCanvas(800, 900);
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


p.draw = function()
{
  p.background(255); 
  p.stroke(0); 

  var s = p.second()+60*p.minute();
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

  p.stroke(0);
  for (i=0; i<speciesNum; i++){
    p.noFill();
    // fill(allSpecies[i].getColor());
    p.circle(allSpecies[i].getX(), allSpecies[i].getY(), 8);
  }

  p.stroke(150);
  p.textSize(18);
  p.text('Waste', 32, 55);
  p.text('Energy', 32, 22);
  if (tp){
    p.fill(150, 150, 150);
    p.rect(10, 10, 20, 20);
    p.noFill();
    p.rect(10, 40, 20, 20);
  }
  else{
    p.noFill();
    p.rect(10, 10, 20, 20);
    p.fill(150, 150, 150);
    p.rect(10, 40, 20, 20);
  }
}

class Species{
  constructor(level, pos, r){
    level = p.int(level);
    this.level = level;
    this.r = r;
    this.xCor = p.float(pos * level_length[level] - level_length[level]/2 + 400);
    this.yCor = p.float(800-level*100);
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
      if (p.int(this.r[i])!=0){
        return i;
      }
    }
    return -1;
  }
  getRelation(j){
    return this.r[j];
  }
}

p.mousePressed = function() {
  if (p.mouseX<=20 && p.mouseX>=10 && p.mouseY<=20 && p.mouseY>=10) tp = true;
  if (p.mouseX<=20 && p.mouseX>=10 && p.mouseY<=50 && p.mouseY>=40) tp = false;

  for (let i=0; i<speciesNum; i++){
    if ((p.mouseX-allSpecies[i].getX())*(p.mouseX-allSpecies[i].getX()) + (p.mouseY-allSpecies[i].getY())*(p.mouseY-allSpecies[i].getY()) < 100){
      var target = [];
      var timeline = []
      var t = p.second()+60*p.minute()+2;
      target.push(p.createVector(allSpecies[i].getX(), allSpecies[i].getY()));
      var idx = allSpecies[i].getPred();
      timeline.push(t);
      target.push(p.createVector(allSpecies[idx].getX(), allSpecies[idx].getY()));
      t += p.int(p.dist(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[idx].getX(), allSpecies[idx].getY())/25);
      timeline.push(t);
      while(allSpecies[idx].getPred()>0){
        idx1 = allSpecies[idx].getPred();
        target.push(p.createVector(allSpecies[idx1].getX(), allSpecies[idx1].getY()));
        t += p.int(p.dist(allSpecies[idx].getX(), allSpecies[idx].getY(), allSpecies[idx1].getX(), allSpecies[idx1].getY())/25);        
        timeline.push(t);
        idx = idx1;
      }
      target.push(p.createVector(p.random(allSpecies[idx].getX()-5, allSpecies[idx].getX()+5), allSpecies[idx].getY()-100));
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
        this.velocity = p.createVector(this.target.x*5, this.target.y*5);
      }
      else{
        this.velocity = p.createVector(p.random(0, this.target.x)*5, p.random(0, this.target.y)*5);
      }
    }
    else {
      if(Math.floor(Math.random()*10) <= 7){
        this.velocity = p.createVector(this.target.x*5, this.target.y*5);
      }
      else{
        this.velocity = p.createVector(p.random(0, this.target.x)*5, p.random(0, this.target.y)*5);
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
  p.noStroke();
  p.strokeWeight(1);
  if(this.obj==false) p.fill(252,141,89);
  else p.fill(116,196,118, this.lifespan/2);
  // getEnergyColor(this.level);
  p.ellipse(this.position.x, this.position.y, 2.5, 2.5);
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
      this.velocity = p.createVector(p.random(-this.target.x, this.target.x)/4, p.random(-this.target.y, this.target.y)/4);
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

  if(obj) this.lifesp = 1000*p.pow(0.1, level);
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
  if(this.obj==false) p.fill(252,141,89, this.lifespan/2);
  else p.fill(116,196,118, this.lifespan/2);
  p.circle(this.origin.x, this.origin.y, 8);
  
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