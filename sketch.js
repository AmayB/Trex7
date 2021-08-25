//sound, lifetimeeach, game adaptivity
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var trex, trex_collided, trex_running;
var score;
var cloud, cloudImage, cloudGroup;
var ground, groundImage, invisibleGround;
var obstacle, obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameover, restart, restartImage, gameoverImage;
var checkpointSound, dieSound, jumpSound;

function preload() {
  checkpointSound = loadSound("checkpoint.mp3");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");

  trex_collided = loadImage("trex_collided.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600,200);

  trex = createSprite(100,100,100,100)
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.x = 50;
  trex.y = 180;

  ground = createSprite(200,195,400,400);
  ground.addImage(groundImage);
  ground.x = ground.width/2;

  cloudGroup = createGroup();
  obstacleGroup = createGroup();

  invisibleGround = createSprite(200,205,400,10);
  invisibleGround.visible = false;

  gameover = createSprite(300,100);
  gameover.addImage(gameoverImage);

  restart = createSprite(300,140);
  restart.addImage(restartImage);
  
  gameover.scale = 0.5;
  restart.scale = 0.5;

  trex.setCollider("rectangle",0,0,40,trex.height)
  trex.debug = true;

  score = 0;
}

function draw() {
  background("white");

  if(gamestate === PLAY) {
    restart.visible = false;
    gameover.visible = false;

    text ("score: " + score, 500, 50);

    ground.velocityX = -(4 + 1* score/1000)

    score = score + Math.round(frameCount / 60);

    if(keyDown("space")&&(trex.y > 100)) {
      trex.velocityY = -10;
      jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8;

    if(obstacleGroup.isTouching(trex)){
      gamestate = END;
      jumpSound.play();
    
    }

    cloudSpawn();
    obstacleSpawn();
  }
  else if (gamestate === END) {
    gameover.visible = true;
    restart.visible = true;
   
    ground.velocityX = 0;
    trex.velocityY = 0
    trex.changeAnimation("collided", trex_collided);
   
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
   
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
 }


  if(ground.x < 0) {
    ground.x = ground.width / 2;
  }

  trex.collide(invisibleGround);
  drawSprites();
}

function cloudSpawn() {
  if(frameCount % 60 === 0) {
    cloud = createSprite(650,100,100,100);
    cloud.scale = 0.5;
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,60));
    cloud.velocityX = -3;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloud.lifetime = 300;

    cloudGroup.add(cloud);
  }
}

function obstacleSpawn(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(650,180,10,40);
    obstacle.velocityX = -(4 + 1* score/1000)

     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
         break;
       case 2: obstacle.addImage(obstacle2);
          break;
       case 3: obstacle.addImage(obstacle3);
          break;
       case 4: obstacle.addImage(obstacle4);
          break;
       case 5: obstacle.addImage(obstacle5);
         break;
       case 6: obstacle.addImage(obstacle6);
          break;
       default: break;
     }
          
     obstacle.scale = 0.5;
     obstacle.lifetime = 300;

     obstacleGroup.add(obstacle);
  }
 }
