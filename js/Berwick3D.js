let sketch3D = function(p){
// --------------------- Sketch-wide variables ----------------------let matrix;
let allSpecies = [];
let speciesNum;
let matrix;
let canvasX = 620;
let canvasY = 1080;
//PShape bigCircle;
// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.

// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.


p.preload = function() {
  matrix = p.loadTable('./data/Berwick/Berwick3D.csv', 'csv');
}

p.setup = function(){
  p.createCanvas(canvasX, canvasY, p.WEBGL);
  p.smooth(); 
  
  speciesNum = matrix.getRowCount()-1;
  for (let r=1; r<matrix.getRowCount(); r++){
    let relations = [];
    for (let c=5; c<matrix.getColumnCount(); c++){
      relations.push(matrix.getNum(r, c));
    }
    allSpecies.push(new Species(matrix.getNum(r, 0), matrix.getNum(r, 2), relations));
  }
}


p.draw = function()
{
 p.background(255); 
 p.directionalLight(200, 200, 200, 1, -0.5, -0.5);
 p.directionalLight(200, 200, 200, 0, 0, -0.5);
 
 // add camera interaction
  var minDist = 200.0;
  var maxDist = 1500.0;
  //  Zoom in/out with the camera
  var cameraDistance = p.lerp(minDist, maxDist, p.float(p.mouseY)/p.height);
  // use the current mouse position with touchY to dolly the camera position towards and away from the data. 
  p.camera(cameraDistance,cameraDistance,cameraDistance, 0,0,0, 0,0,-1);
  // Rotate the data
  p.rotateZ(p.radians(0.25 * p.mouseX));
  
  var s = p.second();
  var t = (p.int(s/2))%5+1;

  for (let i=1; i<5; i++){
    var c = getColor(i);
    p.stroke(c);
    p.noFill();
    p.push();
    p.translate(0, 0, i*200-400);
    p.circle(0, 0, 700);
    if (t==i){
      p.fill(c, 10);
      p.circle(0, 0, 700);
    }
    p.pop();
  }

  for (let i=0; i<speciesNum; i++){
    p.noStroke();
    p.fill(allSpecies[i].getC());
    p.push();
    p.translate(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
    p.sphere(20);
    p.pop();

    p.beginShape(p.LINES);
    p.strokeWeight(0.8);
    if (t==4){
      p.stroke(allSpecies[i].getC());
      for (let j=0; j<speciesNum; j++){
        if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
          p.vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
          p.vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
          p.endShape();
        }
      }
    }
    else{
      if (p.int(allSpecies[i].getLevel())==t){
        p.stroke(allSpecies[i].getC());
        for (let j=0; j<speciesNum; j++){
          if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
            p.vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
            p.vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
            p.endShape();
          }
        }
      }
    }
    
  }
}

function getColor(level){
  switch (level){
    case 1:
      return p.color(179,222,105);
    case 2:
      return p.color(253,180,98);
    case 3:
      return p.color(128,177,211);
    case 4:
      return p.color(251,128,114);
    }
}

class Species{
  constructor(level, angle, r){
    this.level = level;
    angle = angle*360;
    this.r = r;
    this.xCor = p.float(p.cos(p.radians(angle))*350);
    this.yCor = p.float(p.sin(p.radians(angle))*350);
    this.zCor = p.float(level*200-400);
    this.c = getColor(level);
  }

  getX(){
    return this.xCor;
  }

  getY(){
    return this.yCor;
  }

  getZ(){
    return this.zCor;
  }

  getLevel(){
    return this.level;
  }

  getC(){
    return this.c;
  }

  getRelation(j){
    return this.r[j];
  }
}
}