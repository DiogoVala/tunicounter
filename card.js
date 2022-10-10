export default class Card extends Phaser.GameObjects.Sprite{
    pointerover = false;
    tapped = false;
    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite);
        scene.add.existing(this)

        this.setInteractive();
        this.input.dropZone = true;

        this.card_augmented = scene.add.sprite(1300, 350, sprite);
        this.card_augmented.setFrame(0);
        this.card_augmented.setAlpha(0)
        this.setScale(0.2);
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
            this.card_augmented.setFrame(Number(this.frame.name)); // Se o rato sair do scry antes de lagar o "S", a vista volta ao normal
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
        if(this.frame.name == 0){
            this.setFrame(1);
            this.card_augmented.setFrame(1);
        }
        else{
            this.setFrame(0);
            this.card_augmented.setFrame(0);
        }
    }

    scry(){
        this.card_augmented.setFrame(Number(!this.frame.name));
    }

    unscry(){
        this.card_augmented.setFrame(Number(this.frame.name));
    }
}