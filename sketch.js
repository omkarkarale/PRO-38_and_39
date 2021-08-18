var path,mainCyclist;
var player1,player2,player3;
var ob1, ob2, ob3;
var database, distanceRef; 
var pathImg,mainRacerImg1,mainRacerImg2;

var ob1Image,ob2Image,ob3Image;
var oppPink1Img,oppPink2Img;
var oppYellow1Img,oppYellow2Img;
var oppRed1Img,oppRed2Img;
var gameOverImg,cycleBell;

var pinkCG, yellowCG,redCG,ob1CG,ob2CG,ob3CG;

var END =0;
var PLAY =1;
var gameState = PLAY;

var distance=0;
var gameOver, restart;

function preload(){
  pathImg = loadImage("Road.png");
  mainRacerImg1 = loadAnimation("mainPlayer1.png","mainPlayer2.png");
  mainRacerImg2= loadAnimation("mainPlayer3.png");

  ob1Image = loadImage("obstacle1.png")

  ob2Image = loadImage("obstacle2.png")

  ob3Image = loadImage("obstacle3.png")

  oppPink1Img = loadAnimation("opponent1.png","opponent2.png");
  oppPink2Img = loadAnimation("opponent3.png");

  oppYellow1Img = loadAnimation("opponent4.png","opponent5.png");
  oppYellow2Img = loadAnimation("opponent6.png");

  oppRed1Img = loadAnimation("opponent7.png","opponent8.png");
  oppRed2Img = loadAnimation("opponent9.png");

  cycleBell = loadSound("bell.mp3");
  gameOverImg = loadImage("gameOver.png");
}

function setup(){

createCanvas(1200,300);
database = firebase.database();
// Moving background
path=createSprite(100,150);
path.addImage( pathImg);
path.velocityX = -5;

//creating boy running
mainCyclist  = createSprite(70,150);
mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
mainCyclist.scale=0.07;

//set collider for mainCyclist
// mainCyclist.debug = true;
mainCyclist.setCollider("circle", 0, 0, 700)

gameOver = createSprite(650,150);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.8;
gameOver.visible = false;

pinkCG = new Group();
yellowCG = new Group();
redCG = new Group();
ob1CG = new Group();
ob2CG = new Group();
ob3CG = new Group();

distanceRef = database.ref('distance');
}

function draw() {
  background(0);

  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: "+ distance,900,30);

if(gameState===PLAY){

   distance = distance + Math.round(getFrameRate()/50);
   database.ref('/').set({
            distance : distance
        })
   path.velocityX = -(6 + 2*distance/150);

   mainCyclist.y = World.mouseY;

   edges= createEdgeSprites();
   mainCyclist .collide(edges);

  //code to reset the background
  if(path.x < 0 ){
    path.x = width/2;
  }

    //code to play cycle bell sound
  if(keyDown("space")) {
    cycleBell.play();
  }

  //creating continous opponent players
  var select_oppPlayer = Math.round(random(1,6));

  if (World.frameCount % 150 == 0) {
    if (select_oppPlayer == 1) {
      pinkCyclists();
    } else if (select_oppPlayer == 2) {
      yellowCyclists();
    } else if (select_oppPlayer == 3) {
      redCyclists();
    } else if (select_oppPlayer == 4) {
      obstacle1();
    } else if (select_oppPlayer == 5){
      obstacle2();
    } else if (select_oppPlayer == 6){
      obstacle3();
    }
  }

   if(pinkCG.isTouching(mainCyclist)){
     gameState = END;
     player1.velocityY = 0;
     player1.addAnimation("opponentPlayer1",oppPink2Img);
    }

    else if(yellowCG.isTouching(mainCyclist)){
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2",oppYellow2Img);
    }

    else if(redCG.isTouching(mainCyclist)){
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3",oppRed2Img);
    }

    else if(ob1CG.isTouching(mainCyclist)){
      gameState = END;
      ob1.velocityY = 0;
    }

    else if(ob2CG.isTouching(mainCyclist)){
      gameState = END;
      ob2.velocityY = 0;
    }

    else if(ob3CG.isTouching(mainCyclist)){
      gameState = END;
      ob3.velocityY = 0;
    } 
}
else if (gameState === END) {
    gameOver.visible = true;
    //Add code to show restart game instrution in text here
    textSize(20);
    fill(255);
    text("Reload the page to restart or press up arrow!",490,200);
    path.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.addAnimation("SahilRunning",mainRacerImg2);

    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);

    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);

    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);

    ob1CG.setVelocityXEach(0);
    ob1CG.setLifetimeEach(-1);

    ob2CG.setVelocityXEach(0);
    ob2CG.setLifetimeEach(-1);

    ob3CG.setVelocityXEach(0);
    ob3CG.setLifetimeEach(-1);

    //write condition for calling reset( )
    if(keyDown(UP_ARROW)){
      reset()
    }
}

function obstacle1(){
  ob1 =createSprite(1100,Math.round(random(50, 250)));
  ob1.scale =0.1;
  ob1.setCollider("rectangle",0,0,500,500)
  ob1.velocityX = -(6 + 2*distance/150);
  ob1.addImage(ob1Image);
  ob1.setLifetime=170;
  ob1CG.add(ob1);
}

function obstacle2(){
  ob2 =createSprite(1100,Math.round(random(50, 250)));
  ob2.scale =0.1;
  ob2.setCollider("rectangle",0,0,600,400)
  ob2.velocityX = -(6 + 2*distance/150);
  ob2.addImage(ob2Image);
  ob2.setLifetime=170;
  ob2CG.add(ob2);
}

function obstacle3(){
  ob3 =createSprite(1100,Math.round(random(50, 250)));
  ob3.scale =0.1;
  ob3.setCollider("rectangle",0,0,500,500)
  ob3.velocityX = -(6 + 2*distance/150);
  ob3.addImage(ob3Image);
  ob3.setLifetime=170;
  ob3CG.add(ob3);
}

function pinkCyclists(){
  player1 =createSprite(1100,Math.round(random(50, 250)));
  player1.scale =0.06;
  player1.velocityX = -(6 + 2*distance/150);
  player1.addAnimation("opponentPlayer1",oppPink1Img);
  player1.setLifetime=170;
  pinkCG.add(player1);
}

function yellowCyclists(){
        player2 =createSprite(1100,Math.round(random(50, 250)));
        player2.scale =0.06;
        player2.velocityX = -(6 + 2*distance/150);
        player2.addAnimation("opponentPlayer2",oppYellow1Img);
        player2.setLifetime=170;
        yellowCG.add(player2);
}

function redCyclists(){
        player3 =createSprite(1100,Math.round(random(50, 250)));
        player3.scale =0.06;
        player3.velocityX = -(6 + 2*distance/150);
        player3.addAnimation("opponentPlayer3",oppRed1Img);
        player3.setLifetime=170;
        redCG.add(player3);
}

//create reset function here
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  pinkCG.destroyEach();
  yellowCG.destroyEach();
  redCG.destroyEach();
  ob1CG.destroyEach();
  ob2CG.destroyEach();
  ob3CG.destroyEach();
  distance = 0;
 }
}
