var oppacity = 1

function Draw(devTools){
    var toDraw = [];

    toDraw.push(player)

    for(var i = 0; i < enemies.length; i++){
        toDraw.push(enemies[i])
    }

    toDraw.push(boss)

    toDraw.sort((a,b) => {
        if(a.position.y + a.size.height < b.position.y + b.size.height){
            return -1
        }
        else{
            return 1
        }   
    })

    background.draw(offSet)

    for(var i = 0; i < toDraw.length; i++){
        toDraw[i].draw(offSet)
    }


    foreground.draw(offSet)

    //c.fillRect(boss.position.x + offSet.X + boss.extraOffset.x, boss.position.y + offSet.Y + boss.extraOffset.y, boss.size.width, boss.size.height)

    if(devTools){
        //Colliders
        boundaries.forEach(boundary => {
            boundary.draw(background)
        })

        //Triggers
        triggers.forEach(boundary => {boundary.draw(background)})

        //Players attack box
        if(attack){
            c.fillStyle = "rgba(255,0,0,0.5)"
            c.fillRect(playerHitArea.x + offSet.X , playerHitArea.y + offSet.Y , playerHitArea.width, playerHitArea.height)
        }

        //Enemy attack box
        for(var i = 0; i < enemies.length; i++){
            c.fillStyle = "rgba(255,0,0,0.5)"
            if(enemies[i].state == "Attack"){
                c.fillRect(enemyHitArea.x + offSet.X , enemyHitArea.y + offSet.Y , enemyHitArea.width, enemyHitArea.height)
            }
        }
        //Boss attack box
        c.fillRect(bossHitArea.x + offSet.X , bossHitArea.y + offSet.Y , bossHitArea.width, bossHitArea.height)


        //Players collider
        c.fillStyle = "rgba(0,0,255,0.5)"
        c.fillRect(player.position.x + 30 + offSet.X , player.position.y +25 + offSet.Y , player.size.width + playerHitBox.width, player.size.height + playerHitBox.height)

        //Bosses and enemies colliders
        c.fillStyle = "rgba(0,255,0,0.5)"
        for(var i = 0; i < enemies.length; i++){
            c.fillRect(enemies[i].position.x + 30 + offSet.X , enemies[i].position.y + 30 + offSet.Y , enemies[i].size.width - 60, enemies[i].size.height - 40)
        }
        c.fillRect(boss.position.x + bossHitBox.x + offSet.X , boss.position.y + bossHitBox.y + offSet.Y , bossActualSize + bossHitBox.width, bossActualSize + bossHitBox.height)

        document.getElementById("playerPos").innerHTML = "Player Position: " + player.position.x + ", " + player.position.y
        document.getElementById("bossPos").innerHTML = "Boss Position: " + (boss.position.x + (bossAnimation["DownIdle"].height - player.size.width / 2)) + ", " + (boss.position.y + (bossAnimation["DownIdle"].height - player.size.height / 2))
    }

    var tempHealth = playerHealth

    for(var i = 0; i < playerMaxHealth; i++){
        if(tempHealth > 0){
            c.drawImage(images[4], 10 + (i * 40), 10, 40, 40)
            tempHealth--
        }
        else{
            c.drawImage(images[5], 10 + (i * 40), 10, 40, 40)
        }
    }

    if(inArena && (boss.state != "Death" || oppacity >= 0)){
        if(boss.state == "Death"){
            oppacity -= 0.02
        }
        c.globalAlpha = oppacity
        if(oppacity > 0){
            c.drawImage(images[3], canvas.width/2 - images[3].width/2 * 3, canvas.height - 50, images[3].width * 3, images[3].height * 3)
        }
        c.drawImage
        (
            images[2], 
            9,
            0,
            images[2].width- 2 * 9,
            images[2].height,
            canvas.width/2 - images[2].width / 2 * 3 + 27,
            canvas.height - 50, 
            (images[2].width * 3 - 2 * 27) / bossMaxHealth * boss.health , 
            images[2].height * 3,
        )
        c.globalAlpha = 1
    }
}