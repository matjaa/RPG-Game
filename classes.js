class Sprite {
    constructor({position, image, size, cut, cFrame, mFrame}){
        this.position = position
        this.image = image
        this.size = size
        this.cut = cut
        this.cFrame = cFrame
        this.mFrame = mFrame
        this.curAnim = ""
    }

    draw(offSet){ 
        if (this.curAnim != this.image){
            this.curAnim = this.image
            this.cFrame = 1
        }
        c.drawImage
        (
            this.image, 
            this.cut.sx + this.cut.ex * (this.cFrame - 1),
            this.cut.sy,
            this.cut.ex + this.cut.sx * this.cFrame,
            this.cut.ey,
            this.position.x + offSet.X, 
            this.position.y + offSet.Y, 
            this.size.width, 
            this.size.height
        )
    }
}

class Enemy {
    constructor({position, image, size, cut, cFrame, mFrame, state, direction, speed, health, lastAttack}){
        this.position = position
        this.image = image
        this.size = size
        this.cut = cut
        this.cFrame = cFrame
        this.mFrame = mFrame
        this.curAnim = ""
        this.state = state
        this.direction = direction
        this.speed = speed
        this.health = health
        this.lastAttack = lastAttack
    }

    draw(offSet){ 
        if (this.curAnim != this.image){
            this.curAnim = this.image
            this.cFrame = 1
        }
        c.drawImage
        (
            this.image, 
            this.cut.sx + this.cut.ex * (this.cFrame - 1),
            this.cut.sy,
            this.cut.ex + this.cut.sx * this.cFrame,
            this.cut.ey,
            this.position.x + offSet.X, 
            this.position.y + offSet.Y, 
            this.size.width, 
            this.size.height
        )
    }
}

class Boss extends Enemy {
    constructor({extraOffset,speed,frameChange, ...args}){
        super(args)
        this.extraOffset = extraOffset
        this.speed = speed
        this.frameChange = frameChange
    }
    draw(offSet){
        if (this.curAnim != this.image){
            this.curAnim = this.image
            this.cFrame = 1
            getCorrectSize()
        }

        c.drawImage
        (
            this.image, 
            this.cut.sx + this.cut.ex * (this.cFrame - 1),
            this.cut.sy,
            this.cut.ex + this.cut.sx * this.cFrame,
            this.cut.ey,
            this.position.x + offSet.X + this.extraOffset.x,
            this.position.y + offSet.Y + this.extraOffset.y, 
            this.size.width, 
            this.size.height
        )
    }
  }
  

class Boundary{
    static width = 64;
    static height = 64;

    constructor({position,type}){
        this.position = position;
        this.width = 64;
        this.height = 64;
        this.type = type;
    }

    draw(background){
        if(this.type == "trigger"){
            c.fillStyle = "green";
        }
        else if(this.type == "boundary"){
            c.fillStyle = "red";
        }
        else{
            c.fillStyle = "blue";
        }
        c.fillRect(
            this.position.x + background.position.x + offSet.X, 
            this.position.y + background.position.y + offSet.Y, 
            this.width,
            this.height
        );
    }
}