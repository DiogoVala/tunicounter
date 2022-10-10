export default class Dice extends Phaser.GameObjects.Sprite{
    pointerover = false;
    tapped = false;
    constructor(scene, x, y, sprite){
        super(scene, x, y, sprite);

        scene.add.existing(this)
        this.setInteractive();

        this.setScale(0.5);
        scene.input.setDraggable(this);

        scene.anims.create({
            key: 'roll',
            frames: scene.anims.generateFrameNames('dice'),
            frameRate: 15,
            yoyo: true,
            repeat: 1,
            repeatDelay: 0
        });

        this.on('pointerover', function () {
            this.pointerover = true;
        });
        
        this.on('pointerout', function () {
            this.pointerover = false;
        });

        this.on('dragstart', function () {
            scene.children.bringToTop(this);
        });

        this.on('animationcomplete', function () {
            this.setSide(Math.floor(Math.random()*6)+1);
            this.setAlpha(1);
        });

        this.on('drag', function(pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
        });
        
        this.on('drop', function (pointer, dropZone) {
            this.x = dropZone.x;
            this.y = dropZone.y;
        });
    }

    setSide(num){
        this.setFrame(num-1);
    }

    roll(){
        this.setAlpha(0.5);
        this.play('roll');
    }

}
