// --------------------- Sketch-wide variables ----------------------
let matrix;
let allSpeciesName = [];
let speciesNum;
let allSpecies = [];
let bigCircleDia = 600;
let interval;
let last;
let bigCircle;
let img;
let description;
let predPray = true;
let paraHost = true;
let predHost = true;
let paraPara = true;
let buttonX = 50;
let buttonY = 800;
let canvasX = 1920;
let canvasY = 1080;
let foodChainX = 1500;
let foodChainY = 525;
let foodChainRadius = 20;
let foodChainLine = 200;
let foodChainIndex = 40;
let descImage;
let descX = 1400;
let descY = 840;
let descLength = 400;
let descHeight = 200;
let imageX = 1100;
let imageY = 810;
let imageLength = 300;
let imageHeight = 220;
let totalNum;
let descLines;
// color for basal, freeliving and parasite

let connectance;
let preyCor = []; 
let predatorCor = []; 
// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.

// ------------------------ Initialisation --------------------------

// Initialises the data and bar chart.
function preload(){
  matrix = loadTable('carpinteria.csv', 'csv');
}

function setup(){

  createCanvas(1920, 1080);
  smooth(); 
  let speciesColor1 = color(102,194,165);
  let speciesColor2 = color(252,141,98);
  let speciesColor3 = color(141,160,203);
  // Load the data table.
  // The first row of the table saves all the name of species in the food web.
  // Extract them all and save them in a String array.
  speciesNum = matrix.getRowCount() - 3;
  columnNum = matrix.getColumnCount();
  row0 = matrix.getRow(0);
  for (let i = 2; i < columnNum; i++){
    allSpeciesName[i-2] = row0.getString(i);
  }
  // // The first two columns are not species name
  // // Initialize save all species information into an arraylist
  totalNum = matrix.getRowCount();
  for (let i = 3; i < totalNum; i++){
    allSpecies.push(new Species(matrix.getRow(i), bigCircleDia, i - 3, totalNum - 3, columnNum));
    } 
    // console.log(totalNum);
  setFoodChains(foodChainIndex);
  computeConnectance(); 
}

function mouseClicked(){
  // if(evt.getCount() == 2) deleteFoodChainIndex(mouseX,mouseY);
  //last = millis();
  if (mouseX <= buttonX + 10 && mouseX >= buttonX && mouseY <= buttonY + 10 && mouseY >= buttonY) {
    if (predPray == false) predPray = true;
    else predPray = false;
  }
  if (mouseX <= buttonX + 10 && mouseX >= buttonX && mouseY <= buttonY + 30 && mouseY >= buttonY + 20) {
    if (paraHost == false) paraHost = true;
    else paraHost = false;
  }
  if (mouseX <= buttonX + 10 && mouseX >= buttonX && mouseY <= buttonY + 50 && mouseY >= buttonY + 40) {
    if (predHost == false) predHost = true;
    else predHost = false;
  }
  if (mouseX <= buttonX + 10 && mouseX >= buttonX && mouseY <= buttonY + 70 && mouseY >= buttonY + 60) {
    if (paraPara == false) paraPara = true;
    else paraPara = false;
  }
  if(mouseX <= 650 + 20 && mouseX >= 650 && mouseY <= 920 + 20 && mouseY >= 920) resetFoodWeb();
  setFoodChainIndex(mouseX, mouseY);
}

function doubleClicked(){
  deleteFoodChainIndex(mouseX, mouseY);
  return false;
}

function draw()
{ 
   textAlign(LEFT);
   background(255);
   fill(255,255,255);
   stroke(0);
   ellipse(725, 475, bigCircleDia, bigCircleDia)
   textSize(15);
   fill(0);
   noStroke();
   text("Subwebs (click to select)", 45, buttonY - 10);
   if (predPray) fill(152,78,163);
   else noFill();
   rect(buttonX, buttonY, 10, 10);
   fill(152,78,163);
   text("pedator-prey", buttonX + 13, buttonY + 10); 
   
   if (paraHost) fill(247,129,191);
   else noFill();
   rect(buttonX, buttonY + 20, 10, 10);
   fill(247,129,191);
   text("parasite-host", buttonX + 13, buttonY + 30);
   
   if (predHost) fill(78,179,211);
   else noFill();
   rect(buttonX, buttonY + 40, 10, 10);
   fill(78,179,211);
   text("predator-parasite", buttonX + 13, buttonY + 50);
   
   if (paraPara) fill(153,153,153);
   else noFill();
   rect(buttonX, buttonY + 60, 10, 10);
   fill(153,153,153);
   text("parasite-parasite", buttonX + 13, buttonY + 70);
   //reset button
   rect(650,920,20,20);
   fill(0);
   text("Reset the food web", 650 + 25, 935);

   
   var tpsX = 55;
   var tpsY = 250;
   fill(102,194,165); circle(tpsX, tpsY, 15);
   fill(1252,141,98); circle(tpsX, tpsY + 20, 15);
   fill(141,160,203); circle(tpsX, tpsY + 40, 15);
   
   fill(0);
   textSize(14);
   text("Types of species", tpsX-10, tpsY-15);
   textSize(14);
   text("Basal", tpsX + 10, tpsY + 5);
   text("Freeliving", tpsX + 10, tpsY + 25);
   text("Parasite", tpsX+10, tpsY+45);
   
   
   
   text("Connectance: " + connectance, 650, 980);

   for(let i = 0; i < speciesNum; i++){
     if (allSpecies[i].getStatus()) drawFoodWeb(i);
   }
   drawFoodChains(foodChainIndex);

 
}
function drawFoodWeb(i){
   // int t=i;
   // pushMatrix();
   // fill(0);
   // textSize(10);
   // rotate(t*PI/64);
   // translate(allSpecies.get(t).getXNum()*cos(t*PI/64)+allSpecies.get(t).getYNum()*sin(t*PI/64), -allSpecies.get(t).getXNum()*sin(t*PI/64)+allSpecies.get(t).getYNum()*cos(t*PI/64)+3);
   // text(allSpecies.get(t).getName(), 0,0);
   // popMatrix();
   let first = allSpecies[i];
   first.drawShape();
   let c = first.getColor();
   for(let j = 0; j < speciesNum; j++){
     // draw relations between i and j if j is still activated
     if(allSpecies[j].getStatus()){
       let ijRelation = first.getRelations()[j];
       let second = allSpecies[j];
       // draw links if two speceis have relations
       if(ijRelation != 0) {
         if (predPray){
           if(ijRelation == 1) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==1.2||ijRelation==1.25) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==2||ijRelation==2.5) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==3) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
         }
         if(paraHost){
           if(ijRelation==4||ijRelation==4.1||ijRelation==4.11||ijRelation==4.2) {
             strokeWeight(0.45);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
         }
         if (predHost){
           if(ijRelation==5||ijRelation==6) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           } 
           if(ijRelation==7||ijRelation==8) {
             strokeWeight(0.25);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           } 
         }
         if (paraPara){
           if(ijRelation==9) {
             strokeWeight(0.5);
             stroke(c);
             line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           } 
         }
       }
     }
   }
}
}

function resetFoodWeb(){
 for(let i = 0; i < speciesNum; i++){
   allSpecies[i].setStatus(true);
 }
 computeConnectance();
}

function computeConnectance(){
  // trophic elements
  let S = 0;
  // basal + primary producers
  let ppba = 0;
  // predators
  let pr = 0;
  // total link
  let link = 0;

  for(let i = 0; i < speciesNum; i++){
    let s = allSpecies[i];
    if(s.getStatus()){
      S++;
      if(s.getType() == "basal") ppba++;
      else pr ++;
      for(let j = 0; j < speciesNum; j++){
        if(allSpecies[j].getStatus()){
          if(s.getRelations()[j] != 0) link ++;
        }
      }
    }
  }
  connectance = (link / (Math.pow(S, 2) - (ppba)*S + S - ppba + pr*ppba));
}

function compFoodChainPrey(rela, x, y, level){
  let ret = [];
  let size = 0;
  // set the maximum number of a level for clearance
  let max = 3;
  // rescale the length of a food chain for readibility
  if (level != 1) level = level / 3 * 2;
  let radius = foodChainLine / level ;
  let index = [];
  for(let i = 0; i < rela.length; i++){
    // only find predator-prey relationships
    if(Math.floor(rela[i]) == 4 || Math.floor(rela[i]) == 3) {
      if(size >= max) break;
      size++;
      index.push(i);
    }
  }
  let interval = Math.PI / (size + 1);
  let temp = [];
  for(let i = 0; i < size; i++){
    temp = [];
    temp.push(x + radius * Math.sin(interval*(i+1)));
    temp.push(y - radius * Math.cos(interval*(i+1)));
    temp.push(x);
    temp.push(y);
    temp.push(index[i]);
    ret.push(temp);
  }
  return ret;
}

function compFoodChainPredator(index, x, y, level){
  let ret = [];
  let curRela;
  let size = 0;
  // set the maximum number of a level for clearance
  let max = 3;
  // use level to rescale the length of the food chain
  if (level != 1) level = level / 3 * 2;
  let radius = foodChainLine / level ;
  let indexList = [];
  
  for(let i = 0; i < speciesNum; i++){
      curRela = allSpecies[i].getRelations();
      if(Math.floor(curRela[index]) == 4) {
        if(size >= max) break;
        indexList.push(i);
        size++;
    }
  }
  let interval = Math.PI / (size + 1);
  let temp = [];
  for(let i = 0; i < size; i++){
    temp = [];
    temp.push(x - radius * Math.sin(interval*(i+1)));
    temp.push(y - radius * Math.cos(interval*(i+1)));
    temp.push(x);
    temp.push(y);
    temp.push(indexList[i]);
    ret.push(temp);
  }
  return ret;
}

function setFoodChains(index){
  let cur = allSpecies[index];
  let relaPrey = cur.getRelations();
  preyCor.push(compFoodChainPrey(relaPrey, foodChainX, foodChainY, 1));
  let curSize = preyCor.length;
  let scaleSize = 0;
  for(let i = 0; i < curSize; i++){
    let temp = preyCor[i];
    scaleSize = temp.length;
    for(let j = 0; j < scaleSize; j++){
      let curSpecies = temp[j];
      preyCor.push(compFoodChainPrey(allSpecies[(curSpecies[4])].getRelations(), curSpecies[0], curSpecies[1], scaleSize));
    }
  }
  predatorCor.push(compFoodChainPredator(index, foodChainX, foodChainY, 1));
  curSize = predatorCor.length;
  for(let i = 0; i < curSize; i++){
    let temp = predatorCor[i];
    scaleSize = temp.length;
    for(let j = 0; j < scaleSize; j++){
      let curSpecies = temp[j];
      predatorCor.push(compFoodChainPredator(curSpecies[4], curSpecies[0], curSpecies[1], scaleSize));
    }
  }
}

function drawFoodChains(index){
  curS = allSpecies[index];
  for(let i = 0; i < preyCor.length; i++){
    let curSpecies = preyCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      let temp = curSpecies[j];
      line(temp[0], temp[1], temp[2], temp[3]);
    }
  }
  for(let i = 0; i < predatorCor.length; i++){
    let curSpecies = predatorCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      let temp = curSpecies[j];
      line(temp[0], temp[1], temp[2], temp[3]);
    }  
  }
  let type = curS.getType();
  // If type is Basal, set the color to royal blue.
  if (type == "Basal") fill(color(102,194,165));
  // If type is Freeliving, set the color to Spring Green1.
  else if (type == "Freeliving") fill(color(252,141,98));
  // If type is Basal, set the color to Orange Red.
  else if (type == "Parasite") fill(color(141,160,203));
  ellipse(foodChainX, foodChainY, foodChainRadius, foodChainRadius);
  fill(50);
  textAlign(CENTER);
  textSize(9);
  text(curS.getName(), foodChainX, foodChainY + 15);
  textSize(18);
  text("Food chains around " + curS.getName() + ".", foodChainX, foodChainY - 250);
  textSize(12);
  for(let i = 0; i < preyCor.length; i++){
    let curSpecies = preyCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      temp = curSpecies[j];
      type = allSpecies[temp[4]].getType();
      // If type is Basal, set the color to royal blue.
      if (type == "Basal") fill(color(102,194,165));
      // If type is Freeliving, set the color to Spring Green1.
      else if (type == "Freeliving") fill(color(252,141,98));
      // If type is Basal, set the color to Orange Red.
      else if (type == "Parasite") fill(color(141,160,203));
      ellipse(temp[0], temp[1], foodChainRadius, foodChainRadius);
      fill(50);
      textAlign(LEFT);
      textSize(9);
      let printName = allSpecies[temp[4]].getName().split(" ");
      for(let i = 0; i < printName.length ; i++){
        text(printName[i], temp[0] - 10 , temp[1] + 18 + 8*  i);
      }
    }
  }
  for(let i = 0; i < predatorCor.length; i++){
    let curSpecies = predatorCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      let temp = curSpecies[j];
      type = allSpecies[temp[4]].getType();
      // If type is Basal, set the color to royal blue.
      if (type == "Basal") fill(color(102,194,165));
      // If type is Freeliving, set the color to Spring Green1.
      else if (type == "Freeliving") fill(color(252,141,98));
      // If type is Basal, set the color to Orange Red.
      else if (type == "Parasite") fill(color(141,160,203));
      ellipse(temp[0], temp[1], foodChainRadius, foodChainRadius);
      fill(50);
      textAlign(RIGHT);
      textSize(9);
      let printName = allSpecies[temp[4]].getName().split(" ");
      for(let i = 0; i < printName.length ; i++){
        text(printName[i], temp[0] - 10 , temp[1] + 18 + 8*  i);
      }
    }
  }
   textAlign(LEFT);
   textSize(18);
   let curName = curS.getName()
   text(curName, 1400, 825);
   // img = curS.getImg();
   // image(img, 1100, 810,300,220);
   // textSize(15);
   // description = curS.getDesc();
   // text(description, 1400, 840, 400, 200);
   image(curS.getImg(), imageX, imageY, imageLength, imageHeight);
   textSize(15);
   loadStrings("./desc/" + curName + ".txt", setDesc);
   text(descLines, descX, descY, descLength, descHeight);
   // this.description = Arrays.toString(lines);
}

function setDesc(res){
  descLines = res.join();
}

function setImage(res){
  descImage = res;
}

function setFoodChainIndex(x, y){
  for(let i = 0; i < speciesNum; i++){
    s = allSpecies[i];
    if(x < s.getXCor() + s.getDia()/2 && x > s.getXCor() - s.getDia()/2 
    && y > s.getYCor() - s.getDia()/2 && y < s.getYCor() + s.getDia()/2 ){
      foodChainIndex = i;
      preyCor = []; 
      predatorCor = []; 
      setFoodChains(foodChainIndex);
      return;
    }
  }
}


function deleteFoodChainIndex(x, y){
    for(let i = 0; i < speciesNum; i++){
    s = allSpecies[i];
    if(x < s.getXCor() + s.getDia()/2 && x > s.getXCor() - s.getDia()/2 
    && y > s.getYCor() - s.getDia()/2 && y < s.getYCor() + s.getDia()/2 ){
      allSpecies[i].setStatus(false);
      computeConnectance();
      return;
    }
  }
}


class Species {

  // private String name;
  // private String type;
  // private ArrayList<Float> relations = new ArrayList<Float>();
  // private PShape shape; 没有pshape了
  // private float diameter;
  // private float xCor;
  // private float yCor;
  // private float xNum;
  // private float yNum;
  // private int index;
  // private int speciesNum;
  // private String description = "";
  // private PImage img;
  // private boolean activated = true;
  // private color c;
  // private final float interval = (float)360/128;

  constructor(speciesRow, bigCircleDia, idx, total, columnNum){
    this.index = idx;
    this.speciesNum = total;
    this.relations = [];
    this.activated = true;
    this.interval = 360.0/128;
    for(let i = 0; i < columnNum ; i++){
        if(i == 0) this.type = speciesRow.getString(i);
        else if(i == 1) this.name = speciesRow.getString(i);
        else this.relations.push(speciesRow.getNum(i));
      }
      this.diameter = (bigCircleDia * Math.PI / this.speciesNum);
      console.log(bigCircleDia);
      this.xCor = (725.0 + cos(radians(this.index * this.interval)) * bigCircleDia / 2.0);
      this.yCor = (475.0 + sin(radians(this.index * this.interval)) * bigCircleDia / 2.0);
      this.xNum = (725.0 + cos(radians(this.index * this.interval)) * (bigCircleDia / 2.0 + 10));
      this.yNum = (475.0 + sin(radians(this.index * this.interval)) * (bigCircleDia / 2.0 + 10));
      if (this.type == "Basal") this.c = color(102,194,165);
      // If type is Freeliving, set the color to Spring Green1.
      else if (this.type == "Freeliving") this.c = color(252,141,98);
      // If type is Basal, set the color to Orange Red.
      else this.c = color(141,160,203);
      this.img = loadImage("./pics/" + this.name + ".jpg");

  }

  getImg(){
    return this.img;
  }
  drawShape(){
    fill(this.c);
    ellipse(this.xCor, this.yCor, this.diameter, this.diameter);
  }
   
  getName(){
    return this.name;
  }
  
  getStatus(){
    return this.activated; 
  }
  
  setStatus(f){
    this.activated = f;
  }
  
  getType(){
    return this.type;
  }
  
  getColor(){
    return this.c;
  }
  
  getRelations(){
    return this.relations;
  }
  getDia(){
    return this.diameter;
  }
  
  getXCor(){
    return this.xCor;
  }
  getYCor(){
    return this.yCor;
  }
  getXNum(){
    return this.xNum;
  }
  getYNum(){
    return this.yNum;
  }
  getIdx(){
    return this.index;
  }
}
