let sketch = function (p){

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
  let backgroundImage;
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
p.preload = function(){
  matrix = p.loadTable('/data/carpinteria/carpinteria.csv', 'csv');
  backgroundImage = p.loadImage('/data/carpinteria/back.jpg');
}

p.setup = function(){
  p.createCanvas(1920, 1080);
  p.smooth(); 
  let speciesColor1 = p.color(102,194,165);
  let speciesColor2 = p.color(252,141,98);
  let speciesColor3 = p.color(141,160,203);
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

p.mouseClicked = function(){
  // if(evt.getCount() == 2) deleteFoodChainIndex(p.mouseX,p.mouseY);
  //last = millis();
  if (p.mouseX <= buttonX + 10 && p.mouseX >= buttonX && p.mouseY <= buttonY + 10 && p.mouseY >= buttonY) {
    if (predPray == false) predPray = true;
    else predPray = false;
  }
  if (p.mouseX <= buttonX + 10 && p.mouseX >= buttonX && p.mouseY <= buttonY + 30 && p.mouseY >= buttonY + 20) {
    if (paraHost == false) paraHost = true;
    else paraHost = false;
  }
  if (p.mouseX <= buttonX + 10 && p.mouseX >= buttonX && p.mouseY <= buttonY + 50 && p.mouseY >= buttonY + 40) {
    if (predHost == false) predHost = true;
    else predHost = false;
  }
  if (p.mouseX <= buttonX + 10 && p.mouseX >= buttonX && p.mouseY <= buttonY + 70 && p.mouseY >= buttonY + 60) {
    if (paraPara == false) paraPara = true;
    else paraPara = false;
  }
  if(p.mouseX <= 650 + 20 && p.mouseX >= 650 && p.mouseY <= 920 + 20 && p.mouseY >= 920) resetFoodWeb();
  setFoodChainIndex(p.mouseX, p.mouseY);
}

p.doubleClicked = function(){
  deleteFoodChainIndex(p.mouseX, p.mouseY);
  return false;
}

p.draw = function()
{   
  p.textAlign(p.LEFT);
  p.background(255);
  p.fill(255,255,255);
  p.stroke(0);
  p.ellipse(725, 475, bigCircleDia, bigCircleDia)
  p.textSize(15);
  p.fill(0);
  p.noStroke();
  p.text("Subwebs (click to select)", 45, buttonY - 10);
   if (predPray) p.fill(152,78,163);
   else p.noFill();
  p.rect(buttonX, buttonY, 10, 10);
  p.fill(152,78,163);
  p.text("pedator-prey", buttonX + 13, buttonY + 10); 
   
   if (paraHost) p.fill(247,129,191);
   else p.noFill();
   p.rect(buttonX, buttonY + 20, 10, 10);
   p.fill(247,129,191);
   p.text("parasite-host", buttonX + 13, buttonY + 30);
   
   if (predHost) p.fill(78,179,211);
   else p.noFill();
   p.rect(buttonX, buttonY + 40, 10, 10);
   p.fill(78,179,211);
   p.text("predator-parasite", buttonX + 13, buttonY + 50);
   
   if (paraPara) p.fill(153,153,153);
   else p.noFill();
   p.rect(buttonX, buttonY + 60, 10, 10);
   p.fill(153,153,153);
   p.text("parasite-parasite", buttonX + 13, buttonY + 70);
   //reset button
   p.rect(650,920,20,20);
   p.fill(0);
   p.text("Reset the food web", 650 + 25, 935);

   
   var tpsX = 55;
   var tpsY = 250;
   p.fill(102,194,165); p.circle(tpsX, tpsY, 15);
   p.fill(1252,141,98); p.circle(tpsX, tpsY + 20, 15);
   p.fill(141,160,203); p.circle(tpsX, tpsY + 40, 15);
   
   p.fill(0);
   p.textSize(14);
   p.text("Types of species", tpsX-10, tpsY-15);
   p.textSize(14);
   p.text("Basal", tpsX + 10, tpsY + 5);
   p.text("Freeliving", tpsX + 10, tpsY + 25);
   p.text("Parasite", tpsX+10, tpsY+45);
   
   
   
   p.text("Connectance: " + connectance, 650, 980);

   for(let i = 0; i < speciesNum; i++){
     if (allSpecies[i].getStatus()) drawFoodWeb(i);
   }
   drawFoodChains(foodChainIndex);
   p.tint(255, 50);
   p.image(backgroundImage,0,0,canvasX,canvasY);
   p.tint(255, 255);

 
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
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==1.2||ijRelation==1.25) {
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==2||ijRelation==2.5) {
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
           if(ijRelation==3) {
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
         }
         if(paraHost){
           if(ijRelation==4||ijRelation==4.1||ijRelation==4.11||ijRelation==4.2) {
             p.strokeWeight(0.45);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           }
         }
         if (predHost){
           if(ijRelation==5||ijRelation==6) {
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           } 
           if(ijRelation==7||ijRelation==8) {
             p.strokeWeight(0.25);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
           } 
         }
         if (paraPara){
           if(ijRelation==9) {
             p.strokeWeight(0.5);
             p.stroke(c);
             p.line(first.getXCor(), first.getYCor(), second.getXCor(), second.getYCor());
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
      p.line(temp[0], temp[1], temp[2], temp[3]);
    }
  }
  for(let i = 0; i < predatorCor.length; i++){
    let curSpecies = predatorCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      let temp = curSpecies[j];
      p.line(temp[0], temp[1], temp[2], temp[3]);
    }  
  }
  let type = curS.getType();
  // If type is Basal, set the color to royal blue.
  if (type == "Basal") p.fill(p.color(102,194,165));
  // If type is Freeliving, set the color to Spring Green1.
  else if (type == "Freeliving") p.fill(p.color(252,141,98));
  // If type is Basal, set the color to Orange Red.
  else if (type == "Parasite") p.fill(p.color(141,160,203));
  p.ellipse(foodChainX, foodChainY, foodChainRadius, foodChainRadius);
  p.fill(50);
  p.textAlign(p.CENTER);
  p.textSize(9);
  p.text(curS.getName(), foodChainX, foodChainY + 15);
  p.textSize(18);
  p.text("Food chains around " + curS.getName() + ".", foodChainX, foodChainY - 250);
  p.textSize(12);
  for(let i = 0; i < preyCor.length; i++){
    let curSpecies = preyCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      temp = curSpecies[j];
      type = allSpecies[temp[4]].getType();
      // If type is Basal, set the color to royal blue.
      if (type == "Basal") p.fill(p.color(102,194,165));
      // If type is Freeliving, set the color to Spring Green1.
      else if (type == "Freeliving") p.fill(p.color(252,141,98));
      // If type is Basal, set the color to Orange Red.
      else if (type == "Parasite") p.fill(p.color(141,160,203));
      p.ellipse(temp[0], temp[1], foodChainRadius, foodChainRadius);
      p.fill(50);
      p.textAlign(p.LEFT);
      p.textSize(9);
      let printName = allSpecies[temp[4]].getName().split(" ");
      for(let i = 0; i < printName.length ; i++){
        p.text(printName[i], temp[0] - 10 , temp[1] + 18 + 8*  i);
      }
    }
  }
  for(let i = 0; i < predatorCor.length; i++){
    let curSpecies = predatorCor[i];
    for(let j = 0; j < curSpecies.length; j++){
      let temp = curSpecies[j];
      type = allSpecies[temp[4]].getType();
      // If type is Basal, set the color to royal blue.
      if (type == "Basal") p.fill(p.color(102,194,165));
      // If type is Freeliving, set the color to Spring Green1.
      else if (type == "Freeliving") p.fill(p.color(252,141,98));
      // If type is Basal, set the color to Orange Red.
      else if (type == "Parasite") p.fill(p.color(141,160,203));
      p.ellipse(temp[0], temp[1], foodChainRadius, foodChainRadius);
      p.fill(50);
      p.textAlign(p.RIGHT);
      p.textSize(9);
      let printName = allSpecies[temp[4]].getName().split(" ");
      for(let i = 0; i < printName.length ; i++){
        p.text(printName[i], temp[0] - 10 , temp[1] + 18 + 8*  i);
      }
    }
  }
   p.textAlign(p.LEFT);
   p.textSize(18);
   let curName = curS.getName()
   p.text(curName, 1400, 825);
   // img = curS.getImg();
   // image(img, 1100, 810,300,220);
   // textSize(15);
   // description = curS.getDesc();
   // text(description, 1400, 840, 400, 200);
   p.image(curS.getImg(), imageX, imageY, imageLength, imageHeight);
   p.textSize(15);
   p.loadStrings("./data/carpinteria/desc/" + curName + ".txt", setDesc);
   p.text(descLines, descX, descY, descLength, descHeight);
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
      this.xCor = (725.0 + p.cos(p.radians(this.index * this.interval)) * bigCircleDia / 2.0);
      this.yCor = (475.0 + p.sin(p.radians(this.index * this.interval)) * bigCircleDia / 2.0);
      this.xNum = (725.0 + p.cos(p.radians(this.index * this.interval)) * (bigCircleDia / 2.0 + 10));
      this.yNum = (475.0 + p.sin(p.radians(this.index * this.interval)) * (bigCircleDia / 2.0 + 10));
      if (this.type == "Basal") this.c = p.color(102,194,165);
      // If type is Freeliving, set the color to Spring Green1.
      else if (this.type == "Freeliving") this.c = p.color(252,141,98);
      // If type is Basal, set the color to Orange Red.
      else this.c = p.color(141,160,203);
      this.img = p.loadImage("./data/carpinteria/pics/" + this.name + ".jpg");

  }

  getImg(){
    return this.img;
  }
  drawShape(){
    p.fill(this.c);
    p.ellipse(this.xCor, this.yCor, this.diameter, this.diameter);
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

}

function drawANew(){
  let myp5 = new p5(sketch);
}
