// --------------------- Sketch-wide variables ----------------------let matrix;
let allSpecies = [];
let speciesNum;
let matrix;
//PShape bigCircle;
// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.

// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.


function preload(){
  matrix = loadTable('carpinteria.csv', 'csv');
}

function setup(){
  createCanvas(700, 900, WEBGL);
  smooth(); 
  
  speciesNum = matrix.getRowCount()-3;
  for (let r=3; r<matrix.getRowCount(); r++){
    let relations = [];
    for (let c=3; c<matrix.getColumnCount(); c++){
      relations.push(matrix.getNum(r, c));
    }
    allSpecies.push(new Species(matrix.getNum(r, 0), matrix.getNum(r, 1), relations));
  }
}


function draw()
{
 background(255); 
 stroke(255); 
 noStroke();
 directionalLight(255, 255, 255,  1, -0.5, -0.5);
 
 // add camera interaction
  var minDist = 200.0;
  var maxDist = 1500.0;
  //  Zoom in/out with the camera
  var cameraDistance = lerp(minDist, maxDist, float(mouseY)/height);
  // use the current mouse position with touchY to dolly the camera position towards and away from the data. 
  camera(cameraDistance,cameraDistance,cameraDistance, 0,0,0, 0,0,-1);
  // Rotate the data
  rotateZ(radians(0.25*mouseX));
  
  var s = second();
  var t = (int(s/2))%8;
  for (let i=0; i<speciesNum; i++){
    noStroke();
    allSpecies[i].fillColor();
    push();
    translate(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
    sphere(20);
    pop();

    beginShape(LINES);
    strokeWeight(0.8);
    if (t==7){
      allSpecies[i].lineColor();
      for (let j=0; j<speciesNum; j++){
        if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
          vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
          vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
          endShape();
        }
      }
    }
    else{
      if (int(allSpecies[i].getLevel())==t+1){
        allSpecies[i].lineColor();
        for (let j=0; j<speciesNum; j++){
          if (allSpecies[i].getRelation(j)==4 || allSpecies[i].getRelation(j)==4.1 ||allSpecies[i].getRelation(j)==4.2 || allSpecies[i].getRelation(j)==5){
            vertex(allSpecies[i].getX(), allSpecies[i].getY(), allSpecies[i].getZ());
            vertex(allSpecies[j].getX(), allSpecies[j].getY(), allSpecies[j].getZ());
            endShape();
          }
          allSpecies[i].fillColor();
          push();
          translate(0, 0, allSpecies[i].getZ());
          circle(0, 0, 700);
          pop();
        }
      }
    }
    
  }
}

class Species{
  constructor(level, angle, r){
    this.level = level;
    this.angle = angle;
    this.r = r;
    this.xCor = float(cos(radians(angle))*350);
    this.yCor = float(sin(radians(angle))*350);
    this.zCor = float(level*150-400);
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
        stroke(179,222,105);
        break;
      case 2.0:
        stroke(253,180,98);
        break;
      case 3.0:
        stroke(128,177,211);
        break;
      case 4.0:
        stroke(251,128,114);
        break;
      case 5.0:
        stroke(190,186,218);
        break;
      case 6.0:
        stroke(255,255,179);
        break;
      case 7.0:
        stroke(141,211,199);
        break;
    }
  }

  fillColor(){
    switch (this.level){
      case 1.0:
        fill(179,222,105);
        break;
      case 2.0:
        fill(253,180,98);
        break;
      case 3.0:
        fill(128,177,211);
        break;
      case 4.0:
        fill(251,128,114);
        break;
      case 5.0:
        fill(190,186,218);
        break;
      case 6.0:
        fill(255,255,179);
        break;
      case 7.0:
        fill(141,211,199);
        break;
    }
  }

  getRelation(j){
    return this.r[j];
  }
}
