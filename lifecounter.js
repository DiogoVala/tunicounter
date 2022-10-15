export default class LifeCounter extends Phaser.GameObjects.Container{
    pointerover = false
    secondDigit = false
    loDigit
    hiDigit
    notDrag
    constructor(scene, x, y){
        super(scene, x, y)
        this.type = "lifecounter"
        
        var scale = 0.1 // Scale factor for sprites (% of original size)

        this.loDigit = scene.add.sprite(x+314*scale/2, y, 'nums').setScale(scale)
        this.hiDigit = scene.add.sprite(x-314*scale/2, y, 'nums').setScale(scale)

        this.loDigit.setFrame(0)
        this.hiDigit.setFrame(2)

        scene.add.existing(this)
        this.setSize(this.loDigit.displayWidth*2, this.loDigit.displayHeight)
        this.setInteractive()
        scene.input.setDraggable(this)

        this.on('pointerover', function () {
            this.pointerover = true
        })

        this.on('pointerout', function () {
            this.pointerover = false
        })

        this.on('pointerup', function () {
            if(this.notDrag){
                if(this.hiDigit.getBounds().contains(scene.input.x, scene.input.y)){
                    this.decrementLC()
                }
                else if(this.loDigit.getBounds().contains(scene.input.x, scene.input.y)){
                    this.incrementLC()
                }
                this.notDrag = false
            }
        })

        this.on('pointerdown', function(pointer){
            this.notDrag = true
        })

        this.on('dragstart', function(pointer){
            scene.children.bringToTop(this)
        })

        this.on('drag', function (pointer, dragX, dragY) {
            this.notDrag = false
            this.x = dragX
            this.y = dragY
            this.loDigit.x=this.x+314*0.1/2
            this.loDigit.y=this.y
            this.hiDigit.x=this.x-314*0.1/2
            this.hiDigit.y=this.y
        })

        this.on('dragend', function (pointer, dropped) {

        })

    }

    setVal(num){
        if(this.secondDigit){
            this.loDigit.setFrame(num)
            this.secondDigit=false
        }
        else{
            this.hiDigit.setFrame(num)
            this.secondDigit=true
        }
    }
    
    incrementLC(){
        if(this.loDigit.frame.name == 9){
            if(this.hiDigit.frame.name != 9){
                this.hiDigit.setFrame(this.hiDigit.frame.name+1)
            }
            else{
                this.hiDigit.setFrame(0)
            }
            this.loDigit.setFrame(0)
        }
        else{
            this.loDigit.setFrame(this.loDigit.frame.name+1)
        }
    }

    decrementLC(){
        if(this.loDigit.frame.name == 0){
            if(this.hiDigit.frame.name != 0){
                this.hiDigit.setFrame(this.hiDigit.frame.name-1)
            }
            else{
                this.hiDigit.setFrame(9)
            }
            this.loDigit.setFrame(9)
        }
        else{
            this.loDigit.setFrame(this.loDigit.frame.name-1)
        }
    }
}
