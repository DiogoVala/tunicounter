export default class Card extends Phaser.GameObjects.Image{
    pointerover = false;
    tapped = false;
    constructor(scene, x, y, cardfront, cardback){
        super(scene, x, y, cardfront, cardback);
        scene.add.existing(this)

        this.cardfront = cardfront;
        this.cardback = cardback;

        this.setInteractive();
        this.input.dropZone = true;

        this.card_augmented = scene.add.image(1300, 350, cardfront);
        this.card_augmented.setAlpha(0)
        this.setScale(0.23);
        this.displayHeight = Math.round(this.displayHeight)
        this.displayWidth = Math.round(this.displayWidth)

        scene.input.setDraggable(this);

        this.on('drag', function(pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
        });

        this.on('pointerover', function () {
            this.card_augmented.setAlpha(1);
            this.pointerover = true;
        });
        
        this.on('pointerout', function () {
            this.card_augmented.setTexture(this.texture.key); // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
            this.card_augmented.setAlpha(0);
            this.pointerover = false;
        });

        this.on('pointerdown', function () {
        });

        this.on('dragstart', function () {
            scene.children.bringToTop(this)
            this.input.dropZone = false;
        });

        this.on('dragend', function (dropped) {
            scene.children.bringToTop(this)
            this.input.dropZone = true;
        });

        this.on('drop', function (pointer, dropZone) {
            this.x = dropZone.x;
            this.y = dropZone.y;
        });
    }

    tap(){
        if (!this.tapped){
            this.rotation += 3.14/2;
            this.tapped = true;
        }
        else{
            this.rotation -= 3.14/2;
            this.tapped = false;
        }
    }

    flip(){
        if(this.texture.key == this.cardback){
            this.setTexture(this.cardfront)
            this.card_augmented.setTexture(this.cardfront);
        }
        else{
            this.setTexture(this.cardback)
            this.card_augmented.setTexture(this.cardback);
        }
    }

    scry(){
        if(this.texture.key == this.cardback){
            this.card_augmented.setTexture(this.cardfront);
        }
        else{
            this.card_augmented.setTexture(this.cardback);
        }
    }

    unscry(){
        this.card_augmented.setTexture(this.texture.key);
    }
}