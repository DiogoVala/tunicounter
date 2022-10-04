export default class Card extends Phaser.GameObjects.Sprite{
    pointerover = false;
    tapped = false;
    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite);

        scene.add.existing(this)
        this.setInteractive();
        this.card_augmented = scene.add.sprite(1300, 350, sprite);
        
        this.card_augmented.setAlpha(0)
        this.setScale(0.2);
        scene.input.setDraggable(this);

        this.on('pointerover', function () {

            this.card_augmented.setAlpha(1);
            this.pointerover = true;
        });
        
        this.on('pointerout', function () {
            this.card_augmented.setAlpha(0);
            this.pointerover = false;
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
}