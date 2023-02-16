bossAnimationURLs = ["./img/boss/Down/DownIdle.png","./img/boss/Up/UpIdle.png","./img/boss/Left/LeftIdle.png","./img/boss/Right/RightIdle.png",
"./img/boss/Down/DownWalk.png","./img/boss/Up/UpWalk.png","./img/boss/Left/LeftWalk.png","./img/boss/Right/RightWalk.png",
"./img/boss/Down/DownAttack01.png","./img/boss/Up/UpAttack01.png","./img/boss/Left/LeftAttack01.png","./img/boss/Right/RightAttack01.png",
"./img/boss/Down/DownDeath.png","./img/boss/Up/UpDeath.png","./img/boss/Left/LeftDeath.png","./img/boss/Right/RightDeath.png",
"./img/boss/Down/DownHurt.png","./img/boss/Up/UpHurt.png","./img/boss/Left/LeftHurt.png","./img/boss/Right/RightHurt.png"]

bossAnimation = []
bossAnimationCount = bossAnimationURLs.length

var boss = null;

bossReady = false

var bossHitBox = [];
var bossHitArea = [];
var bossMaxHealth = 15;
var bossActualSize

//Check if boss animations are loaded
for(var i = 0; i < bossAnimationURLs.length; i++) {
    var img = new Image();
    var animationName = bossAnimationURLs[i].split("/")[4].split(".")[0]
    bossAnimation[animationName] = img;

    img.onload = onloadHandler;
    img.src = bossAnimationURLs[i];

    if (img.complete) onloadHandler().bind(img);
}

function createBoss(){
    boss = new Boss({
        position: {
            x: 1445,
            y: -750 - bossAnimation["DownIdle"].height * 2 / 2
        },
        image: bossAnimation["DownIdle"],
        size: {
            width: bossAnimation["DownIdle"].width * 2 / 7,
            height: bossAnimation["DownIdle"].height * 2
        },
        cut:{
            sx:0,
            sy:0,
            ex:bossAnimation["DownIdle"].width / 7,
            ey:bossAnimation["DownIdle"].height
        },
        cFrame: 1,
        mFrame: bossAnimation["DownIdle"].width / bossAnimation["DownIdle"].height,
        curAnim: bossAnimation["DownIdle"],
        state: "Idle",
        speed: {
            x: 0,
            y: 0,
            maxSpeed: 1.5,
            currentSpeed: 0
        },
        direction: "Down",
        health: bossMaxHealth,
        lastAttack: 0,
        extraOffset: {
            x: 0,
            y: 0
        },
        frameChange: {
            last: 0,
            cooldown: 250
        },
    })
}

function onloadHandler() {
    bossAnimationCount--

    if (bossAnimationCount === 0){
        createBoss()

        bossHitBox = {
            x: 40,
            y: 20,
            width: - 80,
            height: - 50
        }

        bossCuts = {
            idle: 7,
            walk: 8,
            attack1: 7,
            death: 9,
            hurt: 4
        }

        bossActualSize = bossAnimation["DownIdle"].height * 2,

        bossReady = true
    }
}

var bossSight = 500;
var bossAttackRange = 75;

var bossAttackSpeed = 1500;

function bossStateAttack(){
    if(boss.state == "Attack01" || boss.state == "Attack02" || boss.state == "Attack03"){
        return true
    }
    else{
        return false
    }   
}

function bossAttack() {
    var currentTime = Date.now()

    if(currentTime - boss.lastAttack > bossAttackSpeed){
        boss.state = "Attack01"

        if(boss.direction == "Right"){
            bossHitArea = {
                x: boss.position.x + 90,
                y: boss.position.y,
                width: bossActualSize / 2 + 10,
                height: bossActualSize
            }
        }
        else if(boss.direction == "Left"){
            bossHitArea = {
                x: boss.position.x - 20,
                y: boss.position.y,
                width: bossActualSize / 2,
                height: bossActualSize
            }
        }
        else if(boss.direction == "Up"){
            bossHitArea = {
                x: boss.position.x,
                y: boss.position.y - 40,
                width: bossActualSize,
                height: bossActualSize / 2
            }
        }
        else if(boss.direction == "Down"){
            bossHitArea = {
                x: boss.position.x,
                y: boss.position.y + 100,
                width: bossActualSize,
                height: bossActualSize / 2
            }
        }

        if(boss.cFrame == 6){
            boss.lastAttack = currentTime

            var playerHit = checkHit(bossHitArea, [player], playerHitBox)

            if(playerHit.length > 0){
                damagePlayer()
            }
        }
        else{
            if(Math.abs(boss.position.x - player.position.x) >= Math.abs(boss.position.y - player.position.y)){
                if(boss.position.x < player.position.x){
                    boss.direction = "Right"
                }
                else{
                    boss.direction = "Left"
                }
            }
            else{
                if(boss.position.y < player.position.y){
                    boss.direction = "Down"
                }
                else{
                    boss.direction = "Up"
                }
            }
        }
    }
    else if((bossStateAttack() && boss.cFrame == boss.mFrame) || boss.state == "Walk"){
        boss.state = "Idle"
    }
}

function bossMove() {
    boss.state = "Walk"

    bossPosition = {
        x: boss.position.x + (bossAnimation["DownIdle"].height - player.size.width / 2),
        y: boss.position.y + (bossAnimation["DownIdle"].height - player.size.height / 2)
    }

    if(Math.round(player.position.y * 10) /10 == Math.round(bossPosition.y * 10) /10){
        boss.speed.y = 0
    }
    else if (player.position.y < bossPosition.y) {
        boss.speed.y = -boss.speed.maxSpeed
    }
    else if (player.position.y > bossPosition.y) {
        boss.speed.y = boss.speed.maxSpeed
    }
    if(Math.round(player.position.x * 10) /10 == Math.round(bossPosition.x * 10) /10){
        boss.speed.x = 0
    }
    else if (player.position.x < bossPosition.x) {
        boss.speed.x = -boss.speed.maxSpeed
    }
    else if (player.position.x > bossPosition.x) {
        boss.speed.x = boss.speed.maxSpeed
    }

    if(!checkCollisionX(boss, bossHitBox, boss.speed.x)){
        boss.speed.x = 0
    }
    if(!checkCollisionY(boss, bossHitBox, boss.speed.y)){
        boss.speed.y = 0
    }

    if(boss.speed.x != 0 && boss.speed.y != 0){
        if(player.position.x - bossPosition.x < 1 && player.position.x - bossPosition.x > -1 && boss.speed.x != 0){
            boss.position.x += (player.position.x - bossPosition.x)
        }else{
            boss.position.x += boss.speed.x / Math.sqrt(2)
        }

        if(player.position.y - bossPosition.y < 1 && player.position.y - bossPosition.y > -1 && boss.speed.y != 0){
            boss.position.y += (player.position.y - bossPosition.y)
        }else{
            boss.position.y += boss.speed.y / Math.sqrt(2)
        }
    }
    else{
        if(player.position.x - bossPosition.x < 1 && player.position.x - bossPosition.x > -1 && boss.speed.x != 0){
            boss.position.x += (player.position.x - bossPosition.x)
        }
        else{
            boss.position.x += boss.speed.x
        }

        if(player.position.y - bossPosition.y < 1 && player.position.y - bossPosition.y > -1 && boss.speed.y != 0){
            boss.position.y += (player.position.y - bossPosition.y)
        }
        else{
            boss.position.y += boss.speed.y
        }
    }

    boss.position.x = Math.round(boss.position.x * 100) / 100
    boss.position.y = Math.round(boss.position.y * 100) / 100
}

function bossController(){
    boss.speed.x = 0
    boss.speed.y = 0
    bossHitArea = []

    if(boss.state != "Death"){
        if(boss.state == "Hurt"){
            if(boss.cFrame == boss.mFrame){
                boss.state = "Idle"
            }
        }
        else if(playerInSight(boss, bossSight) && distanceToPlayer(boss) > bossAttackRange && bossStateAttack() == false){
            bossMove()
        }
        else if(distanceToPlayer(boss) <= bossAttackRange || bossStateAttack()){
            bossAttack()
        }
        else{
            boss.state = "Idle"
        }
    }
    enemyAnimator(boss, bossAnimation, bossCuts, "boss")
    if(boss.cFrame > 3 && boss.state == "Death"){
        boss.cut.ey = bossAnimation["DownIdle"].height - 10
        boss.size.height = bossAnimation["DownIdle"].height * 2 - 20
    }

}