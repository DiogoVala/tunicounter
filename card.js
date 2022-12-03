import animations from './animations.js'

export default class Card extends Phaser.GameObjects.Image{
    pointerover = false
    zoneTag
    previousZone
    objectTag
    clickDuration = 0
    currentGlowAnimation = 0
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
        this.selected = false

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

        this.on('dragstart', function () {
            scene.children.bringToTop(this.glow)
            scene.children.bringToTop(this)
            this.input.dropZone = false
        })

        this.on('drag', function(pointer, dragX, dragY) {
            for(let [cardIdx, card] of this.scene.selectedCards){
                card.updatePosition(dragX, dragY, card.zoneTag)
                card.input.dropZone = false
            }
        })

        this.on('dragend', function () {
            this.input.dropZone = true
            this.showNumCards()
            //effects applied on drop show also be applied on dragend
            //if x,y doesnt move the card is not dropped
            this.setGlowEffect('glowHover')
        })

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1)
            this.setGlowEffect('glowHover')
            this.showNumCards()
            animations.enlargeOnHover(this.scene, [this, this.glow])
            this.pointerover = true
        })
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key) // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0)
            
            this.setGlowEffect(0)

            this.pile_size_text.setAlpha(0)
            animations.reduceOnHover(this.scene, [this, this.scene])
            this.pointerover = false
        })

        this.on('pointerdown', function () {
            this.pile_size_text.setAlpha(0)
            this.selected = true
            if(!scene.selectedCards.has(this.objectTag)){
                scene.selectedCards.set(this.objectTag,this)
            }
        })

        this.on('pointerup', function(){
            this.selected = false
            this.scene.longclicked = false
            this.scene.selectedCards.clear()
        })

        this.on('drop', function (pointer, dropZone) {            
            //if card dropped, now pointer is only hover and not dragging
            this.setGlowEffect('glowHover')

            for(let [cardIdx, card] of this.scene.selectedCards){
                if (dropZone.zoneTag != "board"){
                    // it means we are dropping in a zone or in a pile
                    if(this.scene.isBdown){
                        // if we are sinking the card, we need to fix the pile

                        // sinked card objectTag is now the zoneTag
                        card.updatePosition(dropZone.x, dropZone.y, card.objectTag)
                        this.scene.GOD(card, false)

                        // now we have to fix all the cards in the pile
                        // to follow the new bottom card

                        // make a shallow copy of the cardPile
                        let cardPile = [...this.scene.cardPiles.get(dropZone.zoneTag)] 

                        //fix the zoneTag of each card and update its position on the cardPiles list
                        for(let idx of cardPile){
                            this.scene.cards_on_board[parseInt(idx)].updatePosition(card.x, card.y, card.objectTag)
                            this.scene.GOD(this.scene.cards_on_board[parseInt(idx)],true)
                        }
                    }
                    else{
                        card.updatePosition(dropZone.x, dropZone.y, dropZone.zoneTag)
                        this.scene.GOD(card, true)
                    }   
                }    
                else{
                    //all selected cards are in pile of bottom card
                    //get first key of selectedCards
                    let bottom_cardIdx = this.scene.selectedCards.entries().next().value[0]
                    card.updatePosition(this.x, this.y, bottom_cardIdx)
                    this.scene.GOD(card, true)
                }

                /*if(this.scene.isBdown){
                    this.scene.GOD(card, false)
                    //tenho que chamar o god com o planeontop=true nas outras todas!!
                    let cardPile = this.scene.cardPiles.get(dropZone.zoneTag)
                    for(let idx of cardPile){
                        this.scene.cards_on_board[+idx].updatePosition(card.x, card.y, card.objectTag)
                        this.scene.GOD(this.scene.cards_on_board[+idx],true)
                    }
                }
                else{
                    this.scene.GOD(card, true)
                }*/
                card.input.dropZone = true
                card.selected = false

                //console.log(card.zoneTag)
            }
            this.scene.selectedCards.clear()
            //console.log(this.scene.selectedCards)
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

    setGlowEffect(effectKey){
        //setGlowEffect(0) is used to turnoff glow animation
        if(effectKey == 0){
            this.glow.stop(this.currentGlowAnimation)
            this.glow.setAlpha(0)
            this.currentGlowAnimation = 0
        }

        //only needs to change animation if the new animation is not the current one
        if(this.currentGlowAnimation != effectKey){
            this.glow.setAlpha(1)
            if(this.currentGlowAnimation != 0){ //currentGlowAnimation = 0 means no animation playing, cant stop a non animation
                this.glow.stop(this.currentGlowAnimation)
            }
            this.glow.play(effectKey)
            this.currentGlowAnimation = effectKey
        }
    }
}