enemyAnimationURLs = ["./img/enemy/Down/DownIdle.png","./img/enemy/Up/UpIdle.png","./img/enemy/Left/LeftIdle.png","./img/enemy/Right/RightIdle.png",
"./img/enemy/Down/DownWalk.png","./img/enemy/Up/UpWalk.png","./img/enemy/Left/LeftWalk.png","./img/enemy/Right/RightWalk.png",
"./img/enemy/Down/DownAttack.png","./img/enemy/Up/UpAttack.png","./img/enemy/Left/LeftAttack.png","./img/enemy/Right/RightAttack.png",
"./img/enemy/Down/DownDeath.png","./img/enemy/Up/UpDeath.png","./img/enemy/Left/LeftDeath.png","./img/enemy/Right/RightDeath.png",
"./img/enemy/Down/DownHurt.png","./img/enemy/Up/UpHurt.png","./img/enemy/Left/LeftHurt.png","./img/enemy/Right/RightHurt.png"]

enemyAnimation = []
enemyAnimationCount = enemyAnimationURLs.length

var enemySpawnpoints = [
    [500, -1000],
    [1500, 200],
]

var enemies = [];

enemiesReady = false

var enemyHitBox = [];
var enemyHitArea = [];

//Check if enemy animations are loaded
for(var i = 0; i < enemyAnimationURLs.length; i++) {
    var img = new Image();
    var animationName = enemyAnimationURLs[i].split("/")[4].split(".")[0]
    enemyAnimation[animationName] = img;

    img.onload = onloadHandler;
    img.src = enemyAnimationURLs[i];

    if(img.complete && img != undefined){
        window.onload = () => {
            console.log(img)
            onloadHandler().bind(img);    
        }
    }
}

function createEnemy(x,y){
    var enemy = new Enemy({
        position: {
            x: x,
            y: y
        },
        image: enemyAnimation["DownIdle"],
        size: {
            width: enemyAnimation["DownIdle"].width * 2 / 6,
            height: enemyAnimation["DownIdle"].height * 2
        },
        cut:{
            sx:0,
            sy:0,
            ex:enemyAnimation["DownIdle"].width / 6,
            ey:enemyAnimation["DownIdle"].height
        },
        cFrame: 1,
        mFrame: enemyAnimation["DownIdle"].width / enemyAnimation["DownIdle"].height,
        curAnim: enemyAnimation["DownIdle"],
        state: "Idle",
        speed: {
            x: 0,
            y: 0,
            maxSpeed: 1.5
        },
        direction: "Down",
        health: 3,
        lastAttack: 0,
    })
    enemies.push(enemy)
}

function onloadHandler() {
    enemyAnimationCount--

    if (enemyAnimationCount === 0){
        enemySpawnpoints.forEach(spawnPoint => {
            createEnemy(spawnPoint[0],spawnPoint[1])
        });

        enemyHitBox = {
            x: 30,
            y: 30,
            width: - 60,
            height: - 40
        }

        enemyCuts = {
            idle: 6,
            walk: 6,
            attack: 10,
            death: 9,
            hurt: 4
        }

        enemiesReady = true
    }
}

var enemySight = 500;
var attackRange = 50;

var enemyAttackSpeed = 1500;

function enemyMove(enemy) {
    enemy.state = "Walk"

    if(Math.round(player.position.y * 10) /10 == Math.round(enemy.position.y * 10) /10){
        enemy.speed.y = 0
    }
    else if (player.position.y < enemy.position.y) {
        enemy.speed.y = -enemy.speed.maxSpeed
    }
    else if (player.position.y > enemy.position.y) {
        enemy.speed.y = enemy.speed.maxSpeed
    }
    if(Math.round(player.position.x * 10) /10 == Math.round(enemy.position.x * 10) /10){
        enemy.speed.x = 0
    }
    else if (player.position.x < enemy.position.x) {
        enemy.speed.x = -enemy.speed.maxSpeed
    }
    else if (player.position.x > enemy.position.x) {
        enemy.speed.x = enemy.speed.maxSpeed
    }

    if(!checkCollisionX(enemy, enemyHitBox, enemy.speed.x)){
        enemy.speed.x = 0
    }
    if(!checkCollisionY(enemy, enemyHitBox, enemy.speed.y)){
        enemy.speed.y = 0
    }

    if(enemy.speed.x != 0 && enemy.speed.y != 0){
        if(player.position.x - enemy.position.x < 1 && player.position.x - enemy.position.x > -1 && enemy.speed.x != 0){
            enemy.position.x += (player.position.x - enemy.position.x)
        }else{
            enemy.position.x += enemy.speed.x / Math.sqrt(2)
        }

        if(player.position.y - enemy.position.y < 1 && player.position.y - enemy.position.y > -1 && enemy.speed.y != 0){
            enemy.position.y += (player.position.y - enemy.position.y)
        }else{
            enemy.position.y += enemy.speed.y / Math.sqrt(2)
        }
    }
    else{
        if(player.position.x - enemy.position.x < 1 && player.position.x - enemy.position.x > -1 && enemy.speed.x != 0){
            enemy.position.x += (player.position.x - enemy.position.x)
        }
        else{
            enemy.position.x += enemy.speed.x
        }

        if(player.position.y - enemy.position.y < 1 && player.position.y - enemy.position.y > -1 && enemy.speed.y != 0){
            enemy.position.y += (player.position.y - enemy.position.y)
        }
        else{
            enemy.position.y += enemy.speed.y
        }
    }

    enemy.position.x = Math.round(enemy.position.x * 100) / 100
    enemy.position.y = Math.round(enemy.position.y * 100) / 100
}

function enemyAttack(enemy) {
    enemyHitArea = []
    var currentTime = Date.now()

    if(currentTime - enemy.lastAttack > enemyAttackSpeed){
        enemy.state = "Attack"

        if(enemy.direction == "Right"){
            enemyHitArea = {
                x: enemy.position.x + 60,
                y: enemy.position.y,
                width: enemy.size.width/2,
                height: enemy.size.height
            }
        }
        else if(enemy.direction == "Left"){
            enemyHitArea = {
                x: enemy.position.x - 20,
                y: enemy.position.y,
                width: enemy.size.width/2,
                height: enemy.size.height
            }
        }
        else if(enemy.direction == "Up"){
            enemyHitArea = {
                x: enemy.position.x,
                y: enemy.position.y - 20,
                width: enemy.size.width,
                height: enemy.size.height/2
            }
        }
        else if(enemy.direction == "Down"){
            enemyHitArea = {
                x: enemy.position.x,
                y: enemy.position.y + 60,
                width: enemy.size.width,
                height: enemy.size.height/2
            }
        }

        if(enemy.cFrame == 8){
            enemy.lastAttack = currentTime

            var playerHit = checkHit(enemyHitArea, [player], playerHitBox)

            if(playerHit.length > 0){
                damagePlayer()
            }
        }
    }
    else if((enemy.state == "Attack" && enemy.cFrame == enemy.mFrame) || enemy.state == "Walk"){
        enemy.state = "Idle"
    }
}

function enemyController(enemy){
    enemy.speed.x = 0
    enemy.speed.y = 0

    if(enemy.state != "Death"){
        if(enemy.state == "Hurt"){
            if(enemy.cFrame == enemy.mFrame){
                enemy.state = "Idle"
            }
        }
        else if (playerInSight(enemy, enemySight) && distanceToPlayer(enemy) > attackRange && enemy.state != "Attack") {
            enemyMove(enemy, enemy.size.width)
        }
        else if(distanceToPlayer(enemy) <= attackRange || enemy.state == "Attack"){
            enemyAttack(enemy)
        }
        else{
            enemy.state = "Idle"
        }
    }
    
    enemyAnimator(enemy, enemyAnimation, enemyCuts, "enemy")
}