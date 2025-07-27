//board

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//submarine

let subWidth = 54;
let subHeight = 44;
let subX =  boardWidth/8;
let subY = boardHeight/2;
let submarineImg;

let sub = {
    x: subX,
    y : subY,
    width : subWidth,
    height: subHeight
}

//seaweeds

let seaArray = [];
let seaWidth =  68;
let seaHeight = 512;
let seaX = boardWidth;
let seaY = 0;

let  topSeaImg;
let bottomSeaImg; 


// game physicsss

let velocityX = -1; // sea movig to left

let velocityY = 0     ; //jujmping speed

let gravity = 0.05 ;

let gameOver = false;

let score = 0;

window.onload = function (){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // use to draw in the board

    //draw submarine
    // context.fillStyle = "green";
    // context.fillRect(sub.x, sub.y, sub.width, sub.height);


    //load image

    submarineImg = new Image();
    submarineImg.src = "./submarine.png";
    submarineImg.onload = function() {
    context.drawImage(submarineImg, sub.x, sub.y, sub.width, sub.height);
    }

    topSeaImg = new Image();
    topSeaImg.src = "./toptower.png";

    bottomSeaImg = new Image();
    bottomSeaImg.src = "./bottomtower.png";
    requestAnimationFrame(update);
    setInterval(placeSea, 1500);
    document.addEventListener("keydown", moveSub);
    // mouse / touch jump
    board.addEventListener("click", jump);
    board.addEventListener("touchstart", jump, { passive: true });

}

function update (){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight);

    //submarine
    velocityY += gravity;
    // sub.y += velocityY; 
    sub.y = Math.max(sub.y + velocityY, 0); // limit the height  
    context.drawImage(submarineImg, sub.x, sub.y, sub.width, sub.height);


    if (sub.y >board.height){
        gameOver = true; 
    }

    for (let i = 0; i< seaArray.length; i++){
        let sea = seaArray[i];
        sea.x += velocityX;
        context.drawImage(sea.img, sea.x, sea.y, sea.width, sea.height);

        if(!sea.passed && sub.x > sea.x + sub.height){
            score += 0.5;
            sea.passed = true;  
        }

        if (detectCollision(sub, sea)){
            gameOver = true;
        }
    
    }

    //clear vines
    while(seaArray.length> 0 && seaArray[1].x< -seaWidth){
        seaArray.shift(); //removes first elements
    }

    //score update
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5,45);
    
    if (gameOver){
        
        context.fillText("Game Over", 70 , 300);
        context.fillStyle ="red";
        context.font = "20px sans-serif"
        context.fillText("Press space/click to start over" , 70, 350)
    }
}

function  placeSea(){
    if(gameOver){
        return; 
    }

    let randomSeaY = seaY - seaHeight/4 - Math.random()*(seaHeight/2);
    let openingSpace = board.height/4;

    let topSea = {
        img : topSeaImg,
        x : seaX,
        y : randomSeaY,
        width : seaWidth,
        height : seaHeight,
        passed : false
    }
    seaArray.push(topSea)

    let bottomSea = {
        img: bottomSeaImg,
        x : seaX,
        y : randomSeaY+ seaHeight + openingSpace,
        width: seaWidth,
        height: seaHeight,
        passed : false
    }
    seaArray.push(bottomSea);
}



function moveSub(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
    velocityY =-2; 

    //reset game
    if(gameOver){
        sub.y = subY;
        seaArray = []
        score = 0;
        gameOver =false;
    }
    }
}
function jump(e) {
  e.preventDefault();                // stop double-tap zoom on mobile
  velocityY = -2;

  // restart after game-over
  if (gameOver) {
    sub.y = subY;
    seaArray.length = 0;
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b){
    return a.x < b.x + b.width - 25 &&
    a.x + a.width -25 > b.x &&
    a.y <b.y + b.height -25 &&
    a.y + a.height -25  > b.y;
}