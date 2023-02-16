const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.imageSmoothingEnabled = false;

var devTools = false;

colliders.forEach((collider) => {
        boundaries.push(
            new Boundary({
                position:{
                    x: collider[1] * Boundary.width, 
                    y: collider[0] * Boundary.height
                },
                type: "boundary"
            })
        )
})

penis.forEach((collider) => {
    triggers.push(
        new Boundary({
            position:{
                x: collider[1] * Boundary.width, 
                y: collider[0] * Boundary.height
            },
            type: "trigger"
        })
    )
})

//console.log(boundaries)

var start = false;

var fps = 8;
var period = 1000

var fpsInterval, lastDrawTime, frameCount, lastSampleTime;

var imageURLs = ["./img/castle.png","./img/foreground.png","./img/UI/BossHealthbar.png","./img/UI/BossHealthbarEmpty.png","./img/UI/Heart.png","./img/UI/EmptyHeart.png"]

images = []
count = imageURLs.length;


//Check if background is loaded
for(var i = 0; i < imageURLs.length; i++) {
    var img = new Image();
    images.push(img);
    
    img.onload = onloadHandler;
    img.src = imageURLs[i];
    
    if(img.complete && img != undefined){
        onloadHandler().bind(img);  
    }
}

var foreground = null;
var background = null;

var length = 0;

var offSet = {}

function onloadHandler() {
    /// optionally: "this" contains current image just loaded
    count--;
    if (count === 0){
        //Background
        background = new Sprite({
            position: {
                x: -395,
                y: -2600
            },
            image: images[0],
            size: {
                width: images[0].width * 2,
                height: images[0].height * 2
            },
            cut:{
                sx:0,
                sy:0,
                ex:images[0].width,
                ey:images[0].height
            },
            cFrame: 1,
            mFrame: 1,
            curAnim: images[0],
        })

        foreground = new Sprite({
            position: {
                x: -395,
                y: -2600
            },
            image: images[1],
            size: {
                width: images[1].width * 2,
                height: images[1].height * 2
            },
            cut:{
                sx:0,
                sy:0,
                ex:images[1].width,
                ey:images[1].height
            },
            cFrame: 1,
            mFrame: 1,
            curAnim: images[1],
        })

        start = true
    }
}

function everyoneReady(){
    if(start && playerReady && enemiesReady && bossReady){
        return true
    }
    return false
}

function animate(){
    window.requestAnimationFrame(animate)

    var now = window.performance.now();
    var elapsed = now - lastDrawTime;
    if (everyoneReady())
    {
        offSet.X = (canvas.width - player.size.width) / 2 - player.position.x;
        offSet.Y = (canvas.height - player.size.height) / 2 - player.position.y;
        //console.log(offSet.X, offSet.Y)
        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
            // Get ready for next frame by setting lastDrawTime=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            lastDrawTime = now - (elapsed % fpsInterval);
            frameCount++;

            //Update everyones animations
            if(playerHealth <= 0 && player.cFrame != player.mFrame){
                changeFrame(player)
            }
            else if(playerHealth > 0){
                changeFrame(player)
            }
            if(boss.state == "Death" && boss.cFrame != boss.mFrame){
                changeFrame(boss)
            }
            else if(boss.state != "Death"){
                changeFrame(boss)
            }
            enemies.forEach(enemy => {
                if(enemy.state == "Death" && enemy.cFrame != enemy.mFrame){
                    changeFrame(enemy)
                }
                else if(enemy.state != "Death"){
                    changeFrame(enemy)
                }
            });
        }

        checkArenaEnter()    

        playerController()

        for(var i = 0; i < enemies.length; i++)
        {
            enemyController(enemies[i])
        }

        if(inArena){
            bossController()
        }

        Draw(devTools)
        if(deathTime != 0 && deathTime + 1000 < Date.now()){
            restartGame()
        }
    }
}

function changeFrame(animated)
{
    if(animated.cFrame >= animated.mFrame)
    {
        animated.cFrame = 1
    }
    else
    {
        animated.cFrame++
    }
}

function startAnimating(fps, sampleFreq) {
    fpsInterval = sampleFreq / fps;
    lastDrawTime = performance.now();
    lastSampleTime = lastDrawTime;
    frameCount = 0;
    
    animate();
}

startAnimating(fps,period)