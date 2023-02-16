function checkCollisionX(character, hitbox, speedX)
{
    var tempCharacter = {
            x: character.position.x + hitbox.x,
            y: character.position.y + hitbox.y,
            width: character.size.width + hitbox.width,
            height: character.size.height + hitbox.height
    }

    if(character.constructor.name == "Boss"){
        tempCharacter = {
            x: character.position.x + hitbox.x,
            y: character.position.y + hitbox.y,
            width: bossActualSize + hitbox.width,
            height: bossActualSize + hitbox.height
        }
    }

    for(var i = 0; i < boundaries.length; i++)
    {
        if(tempCharacter.x + tempCharacter.width + speedX >= boundaries[i].position.x + background.position.x && 
            tempCharacter.x + speedX <= boundaries[i].position.x + boundaries[i].width + background.position.x && 
            tempCharacter.y + tempCharacter.height >= boundaries[i].position.y + background.position.y && 
            tempCharacter.y <= boundaries[i].position.y + boundaries[i].height + background.position.y
        )
        {
            return false   
        }
    }
    return true
}

function checkCollisionY(character, hitbox, speedY)
{
    var tempCharacter = {
            x: character.position.x + hitbox.x,
            y: character.position.y + hitbox.y,
            width: character.size.width + hitbox.width,
            height: character.size.height + hitbox.height
    }

    if(character.constructor.name == "Boss"){
        tempCharacter = {
            x: character.position.x + hitbox.x,
            y: character.position.y + hitbox.y,
            width: bossActualSize + hitbox.width,
            height: bossActualSize + hitbox.height
        }
    }

    for(var i = 0; i < boundaries.length; i++)
    {
        if(tempCharacter.x + tempCharacter.width >= boundaries[i].position.x + background.position.x && 
            tempCharacter.x <= boundaries[i].position.x + boundaries[i].width + background.position.x && 
            tempCharacter.y + tempCharacter.height + speedY >= boundaries[i].position.y + background.position.y && 
            tempCharacter.y + speedY <= boundaries[i].position.y + boundaries[i].height + background.position.y
        )
        {
            return false
        }
    }
    return true
}

function checkArenaEnter()
{
    for(var i = 0; i < triggers.length; i ++)
    {
        if(player.position.x + player.size.width - 30 >= triggers[i].position.x + background.position.x && 
            player.position.x + 30 <= triggers[i].position.x + triggers[i].width + background.position.x && 
            player.position.y + 25 >= triggers[i].position.y + background.position.y && 
            player.position.y + player.size.height - 10 <= triggers[i].position.y + triggers[i].height + background.position.y
        )
        {
            if(!inArena){
                addArenaColliders()
                inArena = true
            }
        }
    }
}

function addArenaColliders()
{
    arenaColliders.forEach((collider)=>
        boundaries.push(
            new Boundary({
                position:{
                    x: collider[1] * Boundary.width, 
                    y: collider[0] * Boundary.height
                },
                type: "boundary"
            })
        )
    )
}

function distanceToPlayer(enemy) {
    playerPosition = {
        x: player.position.x + playerHitBox.x,
        y: player.position.y + playerHitBox.y,
        width: player.size.width + playerHitBox.width,
        height: player.size.height + playerHitBox.height
    }
    enemyPosition = {
        x: enemy.position.x + enemy.size.width / 2,
        y: enemy.position.y + enemy.size.height / 2,
    }

    //Check which direction the player is in
    // left edge
    if (enemyPosition.x < playerPosition.x){   
        testX = playerPosition.x
    }             
    // right edge
    else if (enemyPosition.x > playerPosition.x + playerPosition.width){
        testX = playerPosition.x + playerPosition.width
    } 
    else {
        testX = playerPosition.x + playerPosition.width / 2
    }
    // top edge
    if (enemyPosition.y < playerPosition.y){
        testY = playerPosition.y
    }
    // bottom edge
    else if (enemyPosition.y > playerPosition.y + playerPosition.height){
        testY = playerPosition.y + playerPosition.height
    }
    else {
        testY = playerPosition.y + playerPosition.height / 2
    }

    distX = enemyPosition.x - testX;
    distY = enemyPosition.y - testY;
    distance = Math.sqrt( (distX*distX) + (distY*distY) );
    return distance;
}

function checkHit(hitArea, victims, victimsHitbox){

    victimsHit = []

    for(var i = 0; i < victims.length; i++)
    {
        var tempVictim = {
            x: victims[i].position.x + victimsHitbox.x,
            y: victims[i].position.y + victimsHitbox.y,
            width: victims[i].size.width + victimsHitbox.width,
            height: victims[i].size.height + victimsHitbox.height
        }

        if(victims[0].constructor.name == "Boss"){
            tempVictim.width = bossActualSize+ victimsHitbox.width
            tempVictim.height = bossActualSize+ victimsHitbox.height
        }

        if(hitArea.x + hitArea.width >= tempVictim.x && 
            hitArea.x <= tempVictim.x + tempVictim.width && 
            hitArea.y + hitArea.height >= tempVictim.y && 
            hitArea.y <= tempVictim.y + tempVictim.height
        )
        {
            victimsHit.push(victims[i])
        }
    }
    return victimsHit
}

function enemyAnimator(enemy, animations, cuts){
    enemy.image = animations[enemy.direction + enemy.state]
    switch(enemy.state){
        case "Idle":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.idle
            break
        case "Walk":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.walk
            break
        case "Attack":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.attack
            break
        case "Death":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.death
            break
        case "Hurt":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.hurt
            break
        case "Attack01":
            enemy.cut.ex = animations[enemy.direction + enemy.state].width / cuts.attack1
            break
    }
    enemy.cut.ey = animations[enemy.direction + enemy.state].height
    enemy.mFrame = animations[enemy.direction + enemy.state].width / animations[enemy.direction + enemy.state].height

    if(enemy.state != "Death" && enemy.state != "Attack" && enemy.state != "Attack01"){
        if(enemy.constructor.name == "Boss"){
            var now = Date.now()
            if(now - enemy.frameChange.last < enemy.frameChange.cooldown){
                return;
            }
        }
        if(enemy.speed.x != 0 || enemy.speed.y != 0){
            if((Math.abs(enemy.speed.x) >= Math.abs(enemy.speed.y))){
                if(enemy.speed.x > 0){
                    enemy.direction = "Right"
                }
                else{
                    enemy.direction = "Left"
                }
            }
            else{
                if(enemy.speed.y > 0){
                    enemy.direction = "Down"
                }
                else{
                    enemy.direction = "Up"
                }
            }
        }
        else{
            if(Math.abs(enemy.position.x - player.position.x) >= Math.abs(enemy.position.y - player.position.y)){
                if(enemy.position.x < player.position.x){
                    enemy.direction = "Right"
                }
                else{
                    enemy.direction = "Left"
                }
            }
            else{
                if(enemy.position.y < player.position.y){
                    enemy.direction = "Down"
                }
                else{
                    enemy.direction = "Up"
                }
            }
        }
        if(enemy.constructor.name == "Boss"){
            enemy.frameChange.last = Date.now()
        }
    }
}

function getCorrectSize(){
    if(boss.state == "Walk" && (boss.direction == "Left" || boss.direction == "Right")){
        boss.size.width = bossAnimation[boss.direction + boss.state].width / bossCuts.walk * 2
        boss.size.height = bossAnimation[boss.direction + boss.state].height * 2
        boss.extraOffset.x = (bossAnimation["DownIdle"].width / bossCuts.idle - bossAnimation[boss.direction + boss.state].width / bossCuts.walk)
        boss.extraOffset.y = (bossAnimation["DownIdle"].height - bossAnimation[boss.direction + boss.state].height)
    }
    else{
        boss.size.width = bossAnimation[boss.direction + boss.state].height * 2
        boss.size.height = bossAnimation[boss.direction + boss.state].height * 2
        boss.extraOffset.x = 0
        boss.extraOffset.y = 0
    }
}

var boundaries = [];
var triggers = [];

function restartGame(){
    //Reset player
    deathTime = 0

    createPlayer()

    //Reset enemies
    enemies = []
    for(var i = 0; i < enemySpawnpoints.length; i++){
        createEnemy(enemySpawnpoints[i][0],enemySpawnpoints[i][1])
    }

    //Reset boss
    createBoss()

    //Reset boundaries
    boundaries = []
    for(var i = 0; i < colliders.length; i++){
        boundaries.push(
            new Boundary({
                position:{
                    x: colliders[i][1] * Boundary.width, 
                    y: colliders[i][0] * Boundary.height
                },
                type: "boundary"
            })
        )
    }

    console.log("Game restarted")
}

function playerInSight(enemy, enemySight) {
    if (distanceToPlayer(enemy) < enemySight) {
        return true
    }
    return false
}

function damagePlayer(){
    playerHealth -= 1
    if(playerHealth >= 0){
        takeDamage = true
        player.cFrame = 0
    }
    else if(deathTime == 0){
        deathTime = Date.now()
    }
}