export default class gameObject extends Phaser.GameObjects.Image{
    pointerover = false
    constructor(scene, x, y, texture, scale){
        super(scene, x, y, texture, scale)
        this.type = "object"
        scene.add.existing(this)

        this.on('pointerover', function () {
            this.pointerover = true
        })

        this.on('pointerout', function () {
            this.pointerover = false
        })
    }
}