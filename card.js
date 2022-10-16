export default class Card extends Phaser.GameObjects.Image{
    pointerover = false
    tapped = false
    zoneTag
    previousZone
    objectTag
    clickDuration = 0
    cardPile // To track cards being carried under this
    draggingPile = false
    constructor(scene, x, y, cardfront, cardback, zoneTag, objectTag){
        super(scene, x, y, cardfront, cardback, zoneTag, objectTag)
        this.type = "card"
        scene.add.existing(this)
        
        this.cardfront = cardfront
        this.cardback = cardback
        this.zoneTag = zoneTag
        this.previousZone = zoneTag
        this.objectTag = objectTag

        this.pile_size_text = scene.add.text(this.x, this.y, 1, { font: "60px Arial Black", fill: "#fff" })
        this.pile_size_text.setOrigin(0.5,0.5)
        this.pile_size_text.setStroke("#000",12)

        //  Apply the shadow to the Stroke only
        this.pile_size_text.setShadow(2, 2, "#333333", 2, true, false)
        this.pile_size_text.setAlpha(0)

        this.setScale(0.2)

        this.setInteractive()
        this.input.dropZone = true

        this.card_augmented = scene.add.image(1300, 350, cardfront)
        this.card_augmented.setAlpha(0)
        this.card_augmented.setScale(0.8)

        this.glow = scene.add.image(this.x, this.y, "glow")
        this.glow.setScale(0.2)
        this.glow.setAlpha(0)

        this.displayHeight = Math.round(this.displayHeight)
        this.displayWidth = Math.round(this.displayWidth)

        scene.input.setDraggable(this)

        /* Spawn card in a specific zone */
        if(this.zoneTag != "board"){
            for (var zone of scene.zones) {
                if(zone.zoneTag === this.zoneTag){
                    this.x = zone.x
                    this.y = zone.y
                }
            }
        }
        else{ /* Or spawn at coordinates */
            this.x = x
            this.y = y
        }

        scene.GOD(this)

        this.on('dragstart', function () {
            scene.children.bringToTop(this.glow)
            scene.children.bringToTop(this)
            this.input.dropZone = false
        })

        this.on('drag', function(pointer, dragX, dragY) {
            if(this.scene.clickDuration > 15){
                this.draggingPile = true
                this.cardPile = this.scene.cardPiles.get(this.zoneTag)
                for(var card of this.cardPile){
                    this.scene.cards_on_board[+card].x = dragX
                    this.scene.cards_on_board[+card].y = dragY
                    this.scene.cards_on_board[+card].input.dropZone = false
                }   
            }
            else{
                this.draggingPile = false
                this.cardPile = [this.objectTag]
                this.scene.clickDuration = 0
                this.x = dragX
                this.y = dragY
            }

            this.glow.x = this.x
            this.glow.y = this.y
        })

        this.on('dragend', function () {
            this.draggingPile = false
            this.input.dropZone = true
            this.showNumCards()
        })

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1)

            this.glow.x = this.x
            this.glow.y = this.y
            this.glow.setAlpha(1)

            this.showNumCards()
            this.pointerover = true
        })

        this.on('pointerup', function(){
            this.glow.setTint()
        })
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key) // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0)
            this.glow.setAlpha(0)

            this.pile_size_text.setAlpha(0)
            
            this.pointerover = false
        })

        this.on('pointerdown', function () {
            this.pile_size_text.setAlpha(0)
        })

        this.on('drop', function (pointer, dropZone) {

            var cardPile = this.cardPile.slice()
            console.log(cardPile)
            for(var card of cardPile){
                if (dropZone.zoneTag != "board"){
                    this.scene.cards_on_board[+card].x = dropZone.x 
                    this.scene.cards_on_board[+card].y = dropZone.y
                    this.scene.cards_on_board[+card].zoneTag = dropZone.zoneTag

                    this.glow.x = dropZone.x
                    this.glow.y = dropZone.y 
                }
                else{
                    this.scene.cards_on_board[+card].zoneTag = cardPile[0].toString()

                    this.glow.x = this.x
                    this.glow.y = this.y 
                }
                
                this.scene.GOD(this.scene.cards_on_board[+card])
                this.scene.cards_on_board[+card].previousZone = this.scene.cards_on_board[+card].zoneTag
                this.scene.cards_on_board[+card].input.dropZone = true
            }
            this.glow.setTint()
        })
    }

    tap(){
        const timeline = this.scene.tweens.timeline({
            onComplete: () => {
                timeline.destroy()
            }
        })
        if(!this.tapped){
            timeline.add({
                targets: [this,this.glow],
                rotation: 3.14/2,
                duration: 100
            })
            this.tapped=true
        }
        else{
            timeline.add({
                targets: [this,this.glow],
                rotation: 0,
                duration: 100
            })
            this.tapped=false
        }
        timeline.play()
    }

    flip(){
        const timeline = this.scene.tweens.timeline({
            onComplete: () => {
                timeline.destroy()
            }
        })
        timeline.add({
            targets: this,
            scale: 0.21,
            duration: 50
        })

        timeline.add({
            targets: this,
            scaleX: 0,
            duration: 100,
            delay: 30,
            onComplete: () => {
                if(this.texture.key == this.cardback){
                    this.setTexture(this.cardfront)
                    this.card_augmented.setTexture(this.cardfront)
                }
                else{
                    this.setTexture(this.cardback)
                    this.card_augmented.setTexture(this.cardback)
                }
            }
        })
        timeline.add({
            targets: this,
            scaleX: 0.21,
            duration: 50
        })

        timeline.add({
            targets: this,
            scale: 0.2,
            duration: 50
        })

        timeline.play()
    }

    scry(){
        if(this.texture.key == this.cardback){
            this.card_augmented.setTexture(this.cardfront)
        }
        else{
            this.card_augmented.setTexture(this.cardback)
        }
    }

    unscry(){
        this.card_augmented.setTexture(this.texture.key)
    }

    showNumCards(){
        var pile_size = this.scene.cardPiles.get(this.zoneTag).length
            if (pile_size > 1){
                this.pile_size_text.x = this.x
                this.pile_size_text.y = this.y
                this.pile_size_text.setText(pile_size)
                this.scene.children.bringToTop(this.pile_size_text)
                this.pile_size_text.setAlpha(1)
            }
    }

    pile_glow(){
        this.glow.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000)
    }
}