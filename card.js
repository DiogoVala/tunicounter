export default class Card extends Phaser.GameObjects.Image{
    pointerover = false
    tapped = false
    zoneTag;
    previousZone;
    objectTag;
    clickDuration = 0
    constructor(scene, x, y, cardfront, cardback, zoneTag){
        super(scene, x, y, cardfront, cardback, zoneTag)
        scene.add.existing(this)

        this.cardfront = cardfront
        this.cardback = cardback
        this.zoneTag = zoneTag
        this.previousZone = zoneTag
        this.objectTag = zoneTag

        this.pile_size_text = scene.add.text(this.x, this.y, 1, { font: "74px Arial Black", fill: "#fff" });
        this.pile_size_text.setStroke("#000",12);

        //  Apply the shadow to the Stroke only
        this.pile_size_text.setShadow(2, 2, "#333333", 2, true, false);
        this.pile_size_text.setAlpha(0)


        scene.GOD(this) // Para criar logo uma entry para esta carta

        this.setScale(0.2)

        this.setInteractive()
        this.input.dropZone = true

        this.card_augmented = scene.add.image(1300, 350, cardfront)
        this.card_augmented.setAlpha(0)
        this.card_augmented.setScale(0.8)

        this.displayHeight = Math.round(this.displayHeight)
        this.displayWidth = Math.round(this.displayWidth)

        scene.input.setDraggable(this)

        this.on('dragstart', function () {
            scene.children.bringToTop(this)
            this.input.dropZone = false
        })

        this.on('drag', function(pointer, dragX, dragY) {
            if(this.scene.clickDuration > 20){
                // Mexer a pile toda
                this.x = dragX
                this.y = dragY
            }
            else{
                this.scene.clickDuration = 0
                this.x = dragX
                this.y = dragY
            }
        })

        this.on('dragend', function () {
            this.input.dropZone = true
        })

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1)

            var pile_size = this.scene.cardPiles.get(this.zoneTag).length
            if (pile_size > 1){
                this.pile_size_text.x = this.x-30
                this.pile_size_text.y = this.y-50
                this.pile_size_text.setText(pile_size)
                scene.children.bringToTop(this.pile_size_text)
                this.pile_size_text.setAlpha(1)
            }
            
            this.pointerover = true
        })
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key) // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0)

            this.pile_size_text.setAlpha(0)
            
            this.pointerover = false
        })

        this.on('pointerdown', function () {
            console.log(this.zoneTag)
            this.pile_size_text.setAlpha(0)
        })

        this.on('drop', function (pointer, dropZone) {
            this.previousZone = this.zoneTag
            
            if (dropZone.zoneTag != "board"){
                this.zoneTag = dropZone.zoneTag
                this.x = dropZone.x
                this.y = dropZone.y
                //Chamar o god para mexer a pile toda
            }
            else{
                this.zoneTag = this.objectTag
                //Chamar o god para criar uma lista nova
            }
            this.scene.GOD(this)
        })
    }

    tap(){
        if (!this.tapped){
            this.rotation += 3.14/2
            this.tapped = true
        }
        else{
            this.rotation -= 3.14/2
            this.tapped = false
        }
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
}