playerAnimationURLs = ["./img/player/Down/DownIdle.png","./img/player/Up/UpIdle.png","./img/player/Left/LeftIdle.png","./img/player/Right/RightIdle.png",
"./img/player/Down/DownWalk.png","./img/player/Up/UpWalk.png","./img/player/Left/LeftWalk.png","./img/player/Right/RightWalk.png",
"./img/player/Down/DownAttack.png","./img/player/Up/UpAttack.png","./img/player/Left/LeftAttack.png","./img/player/Right/RightAttack.png",
"./img/player/Down/DownDeath.png","./img/player/Up/UpDeath.png","./img/player/Left/LeftDeath.png","./img/player/Right/RightDeath.png",
"./img/player/Down/DownHurt.png","./img/player/Up/UpHurt.png","./img/player/Left/LeftHurt.png","./img/player/Right/RightHurt.png"]

playerAnimation = []
pAnimationCount = playerAnimationURLs.length

playerReady = false

var speedX = 0;
var speedY = 0;

var playerDir = "Down"

let canMoveX = true
let canMoveY = true

var attack = false
var lastAttackTime = 0
var attackCooldown = 1000

var takeDamage = false
var deathTime = 0

var playerHealth
var playerMaxHealth = 5

var inArena

//Check if player animations are loaded
for(var i = 0; i < playerAnimationURLs.length; i++) {
    var img = new Image();
    var animationName = playerAnimationURLs[i].split("/")[4].split(".")[0]
    playerAnimation[animationName] = img;
    
    img.onload = onloadHandler;
    img.src = playerAnimationURLs[i];
    
    if(img.complete){
        onloadHandler() 
    }
}

var player = null;
var playerHitBox = [];
var playerHitArea = [];

function createPlayer(){
    player = new Sprite({
        position: {
            //x: 1475,
            //y: -500

            x: 2400,
            y: 200

            //x: canvas.width / 2 - playerAnimation["DownIdle"].width / 5 / 2,
            //y: canvas.height / 2 - playerAnimation["DownIdle"].height
        },
        image: playerAnimation["DownIdle"],
        size: {
            width: playerAnimation["DownIdle"].width * 2 / 5,
            height: playerAnimation["DownIdle"].height * 2
        },
        cut:{
            sx:0,
            sy:0,
            ex:playerAnimation["DownIdle"].width / 5,
            ey:playerAnimation["DownIdle"].height
        },
        cFrame: 1,
        mFrame: playerAnimation["DownIdle"].width / playerAnimation["DownIdle"].height,
        curAnim: playerAnimation["DownIdle"],
    })

    playerHealth = playerMaxHealth
    inArena = false
    playerDir = "Left"
}

function onloadHandler() {
    pAnimationCount--

    if (pAnimationCount === 0){
        createPlayer()
        playerHitBox = {
            x: + 30,
            y: + 25,
            width: - 60,
            height: - 35
        }

        playerReady = true
    }
}

//Player Controller

const keys = {
    w:{
        pressed: false,
    },
    a:{
        pressed: false,
    },
    s:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
    space:{
        pressed: false,
    }
}

window.addEventListener("keydown", (e) =>{
    switch(e.key){
        case "w":
            keys.w.pressed = true
            break;
        case "a":
            keys.a.pressed = true
            break;
        case "s":
            keys.s.pressed = true
            break;
        case "d":
            keys.d.pressed = true
            break;
        case " ":
            keys.space.pressed = true
            break;
    }
})

window.addEventListener("keyup", (e) =>{
    switch(e.key){
        case "w":
            keys.w.pressed = false
            break;
        case "a":
            keys.a.pressed = false
            break;
        case "s":
            keys.s.pressed = false
            break;
        case "d":
            keys.d.pressed = false
            break;
        case " ":
            keys.space.pressed = false
            break;
    }
})

function playerController(){
    playerAnimationController()
    if(playerHealth > 0 && !takeDamage){
        playerMovement()
        playerAttack()
    }
    else
    {
        if(takeDamage){
            if(player.cFrame == player.mFrame){
                takeDamage = false
            }
        }
    }
}

function playerMovement(){
    //Player movement
    speedX = 0
    speedY = 0
    canMoveX = true
    canMoveY = true
    //Gives player movement if they are not attacking
    if(!attack){
        if(keys.w.pressed){
            speedY -= 2
        }
        if(keys.s.pressed){
            speedY += 2
        }
        if(keys.a.pressed){
            speedX -= 2
        }
        if(keys.d.pressed){
            speedX += 2
        }
    }

    canMoveX = checkCollisionX(player, playerHitBox, speedX, enemies, enemyHitBox)
    canMoveY = checkCollisionY(player, playerHitBox, speedY, enemies, enemyHitBox)

    //Checks players direction
    if(speedX > 0){
        playerDir = "Right"
    }
    else if(speedX < 0){
        playerDir = "Left"
    }
    else if(speedY > 0){
        playerDir = "Down"
    }
    else if(speedY < 0){
        playerDir = "Up"
    }

    if(canMoveX && canMoveY){
        if(speedY != 0 && speedX != 0){
            player.position.x += speedX / Math.sqrt(2)
            player.position.y += speedY / Math.sqrt(2)
        }
        else{
            player.position.x += speedX
            player.position.y += speedY
        }
    }
    else{
        if(canMoveX){
            player.position.x += speedX
        }
        if(canMoveY){
            player.position.y += speedY
        }
    }
    
    player.position.x = Math.round(player.position.x * 100) / 100
    player.position.y = Math.round(player.position.y * 100) / 100
}

function playerAttack(){
    if(keys.space.pressed){
            attack = true
    }

    getHitArea()

    var currentTime = Date.now()

    if(attack && currentTime - lastAttackTime > attackCooldown){
        if(player.cFrame == 3){
            lastAttackTime = currentTime
            if(inArena){
                var enemiesHit = checkHit(playerHitArea, [boss], bossHitBox)
            }
            else{
                var enemiesHit = checkHit(playerHitArea, enemies, enemyHitBox)
            }
            for(var i = 0; i < enemiesHit.length; i++){
                enemiesHit[i].health -= 1
                if(enemiesHit[i].health <= 0){
                    enemiesHit[i].state = "Death"
                }
                else{
                    enemiesHit[i].state = "Hurt"
                    enemiesHit[i].cFrame = 1
                }
            }
        }        
    }
}

function getHitArea(){
    if(playerDir == "Right"){
        playerHitArea = {
            x: player.position.x + 60,
            y: player.position.y,
            width: player.size.width/2,
            height: player.size.height
        }
    }
    else if(playerDir == "Left"){
        playerHitArea = {
            x: player.position.x - 20,
            y: player.position.y,
            width: player.size.width/2,
            height: player.size.height
        }
    }
    else if(playerDir == "Up"){
        playerHitArea = {
            x: player.position.x,
            y: player.position.y - 20,
            width: player.size.width,
            height: player.size.height/2
        }
    }
    else if(playerDir == "Down"){
        playerHitArea = {
            x: player.position.x,
            y: player.position.y + 60,
            width: player.size.width,
            height: player.size.height/2
        }
    }
}

function playerAnimationController(){
    if(takeDamage){
        player.image = playerAnimation[playerDir + "Hurt"]
        player.cut.ex = playerAnimation[playerDir + "Hurt"].width / 4
        player.mFrame = playerAnimation[playerDir + "Hurt"].width / playerAnimation[playerDir + "Hurt"].height
    }
    else if(playerHealth <= 0){
        player.image = playerAnimation[playerDir + "Death"]
        if(playerDir == "Up"){
            player.cut.ex = playerAnimation[playerDir + "Death"].width / 6
        }
        else{
            player.cut.ex = playerAnimation[playerDir + "Death"].width / 5
        }
        player.mFrame = playerAnimation[playerDir + "Death"].width / playerAnimation[playerDir + "Death"].height
    }
    else if (attack)
    {
        if(player.cFrame >= player.mFrame){
            attack = false
        }
        else{
            player.image = playerAnimation[playerDir + "Attack"]
            player.cut.ex = playerAnimation[playerDir + "Attack"].width / 6
            player.mFrame = playerAnimation[playerDir + "Attack"].width / playerAnimation[playerDir + "Attack"].height
        }
    }
    else
    {
        if (speedX != 0 || speedY != 0) {
            player.image = playerAnimation[playerDir + "Walk"]
            player.cut.ex = playerAnimation[playerDir + "Walk"].width / 8
            player.mFrame = playerAnimation[playerDir + "Walk"].width / playerAnimation[playerDir + "Walk"].height
        } else {
            player.image = playerAnimation[playerDir + "Idle"]
            player.cut.ex = playerAnimation[playerDir + "Idle"].width / 5
            player.mFrame = playerAnimation[playerDir + "Idle"].width / playerAnimation[playerDir + "Idle"].height
        }
    }
}