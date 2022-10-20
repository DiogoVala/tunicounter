import animations from './animations.js'

export default class Card extends Phaser.GameObjects.Image{
    pointerover = false
    zoneTag
    previousZone
    objectTag
    clickDuration = 0
    cardPile // To track cards being carried under this
    draggingPile = false
    AnimationPlaying = false
    constructor(scene, x, y, cardfront, cardback, glow, zoneTag, objectTag){
        super(scene, x, y, cardfront, cardback, glow, zoneTag, objectTag)
        this.type = "card"
        scene.add.existing(this)

        this.glow = scene.add.sprite(x, y, glow).setScale(0.2)
        this.glow.setFrame(1)
        this.glow.setAlpha(0)
        scene.children.bringToTop(this)

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

        this.glow.x = this.x
        this.glow.y = this.y

        scene.GOD(this, true)

        this.on('dragstart', function () {
            scene.children.bringToTop(this.glow)
            scene.children.bringToTop(this)
            this.input.dropZone = false
        })

        this.on('drag', function(pointer, dragX, dragY) {
            if(this.draggingPile){
                //get x,y position of pile (last card of pile always works)
                var aux_card = this.scene.cards_on_board[+this.scene.cardPiles.get(this.zoneTag)[0]]
                this.scene.selectedCards = []
                //to move pile, drag position should be very little
                if(this.x<(aux_card.x+30) && this.x>=(aux_card.x-30) && this.y<(aux_card.y+20) && this.y>=(aux_card.y-20)){

                    for(var cardIdx of this.scene.cardPiles.get(this.zoneTag)){
                        this.scene.selectedCards.push(this.scene.cards_on_board[cardIdx])
                    }
                    for(var card of  this.scene.selectedCards){
                        card.updatePosition(dragX, dragY, this.zoneTag)
                        card.input.dropZone = false
                    }
                }
                else{
                    this.scene.clickDuration = 0
                    this.scene.selectedCards = [this.scene.cards_on_board[+this.objectTag]]
                    this.updatePosition(dragX, dragY, this.zoneTag)
                } 
            }
            else{
                this.scene.selectedCards = [this.scene.cards_on_board[+this.objectTag]]
                this.updatePosition(dragX, dragY, this.zoneTag)
            }
        })

        this.on('dragend', function () {
            this.draggingPile = false
            this.input.dropZone = true
            this.showNumCards()
            this.AnimationPlaying = false
            this.glow.stop('glowTint')
            this.glow.play('glowHover')
        })

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1)
            this.glow.setAlpha(1)
            this.glow.play('glowHover')
            this.showNumCards()
            animations.enlargeOnHover(this.scene, [this, this.glow])
            this.pointerover = true
        })

        this.on('pointerup', function(){
            
        })
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key) // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0)
            this.glow.setAlpha(0)

            this.pile_size_text.setAlpha(0)
            animations.reduceOnHover(this.scene, [this, this.scene])
            this.pointerover = false
        })

        this.on('pointerdown', function () {
            this.pile_size_text.setAlpha(0)
            console.log(this.zoneTag)
        })

        this.on('drop', function (pointer, dropZone) {

            //if card dropped it stopped dragging
            this.draggingPile = false

            for(var card of this.scene.selectedCards){
                if (dropZone.zoneTag != "board"){
                    card.updatePosition(dropZone.x, dropZone.y, dropZone.zoneTag)
                }
                else{
                    card.updatePosition(this.x, this.y, this.scene.selectedCards[0].objectTag.toString())
                }

                if(this.scene.isBdown){
                    this.scene.GOD(card, false)

                    //reorder deck visually
                    var cardPile = scene.cardPiles.get(card.zoneTag).slice()
                    for(var cardIdx of cardPile){
                        scene.children.bringToTop(card)
                    }
                }
                else{
                    this.scene.GOD(card, true)
                }
                card.input.dropZone = true
            }

            //console.log(this.zoneTag)
        })
    }

    tap(){
        if (this.rotation >= 2*Math.PI){
            this.rotation = 0
        }
        this.rotation += Math.PI/2
    }

    flip(){
        if(this.texture.key == this.cardback){
            this.setTexture(this.cardfront)
            this.card_augmented.setTexture(this.cardfront)
        }
        else{
            this.setTexture(this.cardback)
            this.card_augmented.setTexture(this.cardback)
        }
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
        if(this.scene.cardPiles.get(this.zoneTag)){
            var pile_size = this.scene.cardPiles.get(this.zoneTag).length
            if (pile_size > 1){
                this.pile_size_text.x = this.x
                this.pile_size_text.y = this.y
                this.pile_size_text.setText(pile_size)
                this.scene.children.bringToTop(this.pile_size_text)
                this.pile_size_text.setAlpha(1)
            }
        }
    }

    updatePosition(x, y, zoneTag){
        this.x = x
        this.y = y
        this.glow.x = x
        this.glow.y = y
        this.pile_size_text.x = x
        this.pile_size_text.y = y
        this.zoneTag = zoneTag
    }
}