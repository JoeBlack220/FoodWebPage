let sketch = function(p){

// --------------------- Sketch-wide variables ----------------------
let table;
let allSpeciesName = [];
let speciesNum;
let allSpecies = [];
let columnNum;
//float bigCircleDia = 600;
//float interval;

let rt = 0;

let level_two_exists = false;
let level_three_exists = false;
let level_four_exists = false;
let level_five_exists = false;
let curr_start,random_level_two_value,random_level_three_value,random_level_four_value,random_level_five_value;
let level_two_list = [];
let level_three_list = [];
let level_four_list = [];
let level_five_list = [];
let tmpImg;
let tmpInfo = [];

p.preload = function(){
  table = p.loadTable("./data/introduction/Bell.csv","csv");
}
p.setup = function(){
  p.createCanvas(1300, 700, p.P3D);
  p.smooth(); 
  // ELLIPSE x, y, width, height
  //bigCircle = createShape(ELLIPSE,725,475,bigCircleDia,bigCircleDia);  
  // Load the data table.
  // The first row of the table saves all the name of species in the food web.
  // Extract them all and save them in a String array.
  let row0 = table.getRow(0);
  columnNum = table.getColumnCount();

  for (let i = 1;i < columnNum;i++){
    allSpeciesName[i-1] = row0.getString(i);
    // p.println(allSpeciesName[i-1]);
  }
  // The first two columns are not species name
  // Initialize save all species information into an arraylist
  
  //require clean allSpecies since for repeating
  allSpecies = [];
  for (let i = 3; i < columnNum; i++){
    allSpecies.push(new Species(table.getRow(i)));
    } 
  speciesNum = allSpecies.length;
  //My code start here
  //reset thr time value rt to 0
  // p.println("\nThe next round start here!");
  rt = 0;
  //reset boolean value to check if each level exists
  level_two_exists = false;
  level_three_exists = false;
  level_four_exists = false;
  level_five_exists = false;
  
  let random_start_list = [];
  random_start_list.push("Pine");
  random_start_list.push("Aspen");
  random_start_list.push("Spruce");
  random_start_list.push("Juneberry");

  let random_start_index = Math.floor(Math.random() * 4);

  curr_start = random_start_list[random_start_index];
  // p.println(curr_start);
  
  rt = 0;
  //println("Name1:");
  //println(allSpecies.get(0).getName());
  //println("Name2:");
  //println(allSpecies.get(4).getName());
  //println("Their relation:");
  //println(allSpecies.get(0).getRelations().get(4));
  
  level_two_list = [];
  for(let i = 0; i < speciesNum; i++){  
    if(allSpecies[i].getName() == curr_start){
      for(let j = 0; j < speciesNum; j++){
       let ijRelation = allSpecies[i].getRelations()[j];
       if(ijRelation==4.0){
         level_two_list.push(allSpecies[j].getName());
       }
      }
    }
  }
  
  // p.println(level_two_list);
  
  if (!(level_two_list == undefined || level_two_list.length == 0)){
    level_two_exists = true;
  }
  
  if (level_two_exists){
  let level_two_size = level_two_list.length;
  let random_level_two_index = Math.floor(Math.random() * level_two_size);
  random_level_two_value = level_two_list[random_level_two_index];
  // p.println(random_level_two_value);
    level_three_list = [];
    for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_two_value){
        for(let j = 0; j < speciesNum; j++){
         let ijRelation = allSpecies[i].getRelations()[j];
         if(ijRelation==4){
           level_three_list.push(allSpecies[j].getName());
         }
        }
      }
    }
    // p.println(level_three_list);
    if (!(level_three_list == undefined || level_three_list.length == 0)){
      level_three_exists = true;
    }
  }
  
  if (level_three_exists){
    let level_three_size = level_three_list.length;
    let random_level_three_index = Math.floor(Math.random() * level_three_size);
    random_level_three_value = level_three_list[random_level_three_index];
    // p.println(random_level_three_value);
    level_four_list = [];
    for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_three_value){
        for(let j = 0; j < speciesNum; j++){
         let ijRelation = allSpecies[i].getRelations()[j];
         if(ijRelation==4){
           level_four_list.push(allSpecies[j].getName());
         }
        }
      }
    }
    // p.println(level_four_list);
    if (!(level_four_list == undefined || level_four_list.length == 0)){
      level_four_exists = true;
    }
  }
  
  if (level_four_exists){
    let level_four_size = level_four_list.length;
    let random_level_four_index = Math.floor(Math.random() * level_four_size);
    random_level_four_value = level_four_list[random_level_four_index];
    // p.println(random_level_four_value);
    level_five_list = [];
    for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_four_value){
        for(let j = 0; j < speciesNum; j++){
         let ijRelation = allSpecies[i].getRelations()[j];
         if(ijRelation==4){
           level_five_list.push(allSpecies[j].getName());
         }
        }
      }
    }
    // p.println(level_five_list);
    if (!(level_five_list == undefined || level_five_list.length == 0)){
      level_five_exists = true;
    }
  }
  
  if (level_five_exists){
    let level_five_size = level_five_list.length;
    let random_level_five_index = Math.floor(Math.random() * level_five_size);
    random_level_five_value = level_five_list[random_level_five_index];
    // p.println(random_level_five_value);
  }
  
}


p.draw = function(){
  rt += 1;
  p.background(255); 
  p.stroke(255);
  p.fill(0);
  p.strokeWeight(5);
  if (rt  > 20){
  for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == curr_start){
        tmpImg = allSpecies[i].getImg();
        tmpInfo = allSpecies[i].getInfo();
        break;
      }
  }
  p.fill(252,146,114);

  p.rect(90,90,220,220);

  p.image(tmpImg,100,100,200,200);
  p.textSize(20);
  p.fill(252,146,114);
  p.text(curr_start, 100+50, 100+200+30); 
  p.fill(0);
  p.textSize(15);
  p.text(tmpInfo[0], 100-20, 100+200+80, 240, 300); 
  }
  if (rt >200 && level_two_exists){
  p.stroke(252,146,114);
  p.line(310,200,400-25,200);
  p.fill(252,146,114);
  p.triangle(400-35,200-10,400-35,200+10,400-15,200);
  p.fill(0);
  p.stroke(255);
  }else{
    if (rt  == 400){
    p.setup();
    }
  }
  if (rt>220 && level_two_exists){
  for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_two_value){
        tmpImg = allSpecies[i].getImg();
        tmpInfo = allSpecies[i].getInfo();
        break;
      }
  }  
  p.fill(251,106,74);

  p.rect(390,90,220,220);

  p.image(tmpImg,400,100,200,200);
  p.fill(251,106,74);
  p.textSize(20);
  p.text(random_level_two_value, 400+50, 100+200+30); 
  p.fill(0);
  p.textSize(15);
  p.text(tmpInfo[0], 400-20, 100+200+80, 240,300); 
  }
  if (rt>400 && level_three_exists){
  p.stroke(251,106,74);
  p.line(610,200,700-25,200);
  p.fill(251,106,74);
  p.triangle(700-35,200-10,700-35,200+10,700-15,200);
  p.fill(0);
  p.stroke(255);
  }else{
    if (rt  == 600){
    p.setup();
    }
  }
  if (rt>420 && level_three_exists){
  for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_three_value){
        tmpImg = allSpecies[i].getImg();
        tmpInfo = allSpecies[i].getInfo();
        break;
      }
  }
  p.fill(239,59,44);
  p.rect(690,90,220,220);
  p.image(tmpImg,700,100,200,200);
  p.fill(239,59,44);
  p.textSize(20);
  p.text(random_level_three_value, 700+50, 100+200+30); 
  p.fill(0);
  p.textSize(15);
  p.text(tmpInfo[0], 700-20, 100+200+80, 240,300); 
  }
  if (rt>600 && level_four_exists){
  p.stroke(239,59,44);
  p.line(910,200,1000-25,200);
  p.fill(239,59,44);
  p.triangle(1000-35,200-10,1000-35,200+10,1000-15,200);
  p.fill(0);
  p.stroke(255);
  }else{
    if (rt  == 800){
    p.setup();
    }
  }
  if (rt>620 && level_four_exists){
  for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_four_value){
        tmpImg = allSpecies[i].getImg();
        tmpInfo = allSpecies[i].getInfo();
        break;
      }
  }
  p.fill(203,24,29);

  p.rect(990,90,220,220);
  p.image(tmpImg,1000,100,200,200);
  p.fill(203,24,29);
  p.textSize(20);
  p.text(random_level_four_value, 1000+50, 100+200+30); 
  p.fill(0);
  p.textSize(15);
  p.text(tmpInfo[0], 1000-20, 100+200+80, 240, 300); 
  }
  if (rt>800 && level_five_exists){
  p.stroke(203,24,29);
  p.line(1210,200,1300-25,200);
  p.fill(203,24,29);
  p.triangle(1300-35,200-10,1300-35,200+10,1300-10,200);
  p.fill(0);
  p.stroke(255);
  }else{
    if (rt  == 1000){
    p.setup();
    }
  }
  if (rt>820 && level_five_exists){
  for(let i = 0; i < speciesNum; i++){  
      if(allSpecies[i].getName() == random_level_five_value){
        tmpImg = allSpecies[i].getImg();
        tmpInfo = allSpecies[i].getInfo();
        break;
      }
  }

  p.rect(1290,90,220,220);
  p.image(tmpImg,1300,100,200,200);
  p.fill(165,15,21);
  p.textSize(20);
  p.text(random_level_five_value, 1300+50, 100+200+30); 
  p.fill(0);
  p.textSize(15);
  p.text(tmpInfo[0], 1300-20, 100+200+80, 240, 300); 
  }
  if (rt  == 1200){
    p.setup();
  }
}

class Species {
  // private String name;
  // private ArrayList<Float> relations = new ArrayList<Float>();
  // private String[] info;
  // private PImage img;
  constructor (speciesRow){
  //no = idx;
  this.relations = [];
  for(let i = 0; i < columnNum; i++){
      if(i==0) this.name = speciesRow.getString(i);
      else this.relations.push(speciesRow.getNum(i));
    }
  if ((this.name != undefined)  && (this.name.length!=0)){
    this.img = p.loadImage("./data/introduction/imgs/" + this.name + ".jpg");
    this.info = p.loadStrings("./data/introduction/intro/" + this.name + ".txt");
    }
  }
  
 getImg(){
    return this.img;
  }
  
 getInfo(){
    return this.info;
  }
  
 getName(){
    return this.name;
  }
 getRelations(){
    return this.relations;
  }
}


}