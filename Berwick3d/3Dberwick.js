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
  matrix = p.loadTable('Berwick.csv', 'csv');
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
 p.stroke(255); 
 p.noStroke();
 p.directionalLight(150, 150, 150, 1, -0.5, -0.5);
 p.directionalLight(150, 150, 150, 0, 0, -0.5);
 
 // add camera interaction
  var minDist = 200.0;
  var maxDist = 1500.0;
  //  Zoom in/out with the camera
  var cameraDistance = p.lerp(minDist, maxDist, p.float(p.mouseY)/p.height);
  // use the current mouse position with touchY to dolly the camera position towards and away from the data. 
  p.camera(cameraDistance,cameraDistance,cameraDistance, 0,0,0, 0,0,-1);
  // Rotate the data
  p.rotateZ(p.radians(0.25*p.mouseX));
  
  var s = p.second();
  var t = (p.int(s/2))%5;
  for (let i=0; i<speciesNum; i++){
    p.noStroke();
    allSpecies[i].fillColor();
    p.push();
    p.translate(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
    p.sphere(20);
    p.pop();

    p.beginShape(p.LINES);
    p.strokeWeight(0.8);
    if (t==4){
      allSpecies[i].lineColor();
      for (let j=0; j<speciesNum; j++){
        if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
          p.vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
          p.vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
          p.endShape();
        }
      }
    }
    else{
      if (p.int(allSpecies[i].getLevel())==t+1){
        allSpecies[i].lineColor();
        for (let j=0; j<speciesNum; j++){
          if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
            p.vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
            p.vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
            p.endShape();
          }
          allSpecies[i].fillColor();
          p.push();
          p.translate(0, 0, allSpecies[i].getZ());
          p.circle(0, 0, 700);
          p.pop();
        }
      }
    }
    
  }
}

class Species{
  constructor(level, angle, r){
    this.level = level;
    angle = angle*360;
    this.r = r;
    this.xCor = p.float(p.cos(p.radians(angle))*350);
    this.yCor = p.float(p.sin(p.radians(angle))*350);
    this.zCor = p.float(level*300.-600);
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

  lineColor(){
    switch (this.level){
      case 1.0:
        p.stroke(179,222,105);
        break;
      case 2.0:
        p.stroke(253,180,98);
        break;
      case 3.0:
        p.stroke(128,177,211);
        break;
      case 4.0:
        p.stroke(251,128,114);
        break;
      case 5.0:
        p.stroke(190,186,218);
        break;
      case 6.0:
        p.stroke(255,255,179);
        break;
      case 7.0:
        p.stroke(141,211,199);
        break;
    }
  }

  fillColor(){
    switch (this.level){
      case 1.0:
        p.fill(179,222,105);
        break;
      case 2.0:
        p.fill(253,180,98);
        break;
      case 3.0:
        p.fill(128,177,211);
        break;
      case 4.0:
        p.fill(251,128,114);
        break;
      case 5.0:
        p.fill(190,186,218);
        break;
      case 6.0:
        p.fill(255,255,179);
        break;
      case 7.0:
        p.fill(141,211,199);
        break;
    }
  }

  getRelation(j){
    return this.r[j];
  }
}

}