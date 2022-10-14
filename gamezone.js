export default class gameZone extends Phaser.GameObjects.Zone{
    pointerover = false;
    constructor(scene, x, y, width, height, zoneTag){
        super(scene, x, y, width, height, zoneTag);

        this.setDropZone(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), RectangleContains)
        this.setInteractive();
        this.input.dropZone = true;

        this.setOrigin(0,0)
        this.x=x
        this.y=y
        this.zoneTag = zoneTag
        
        this.border = scene.add.rectangle(x, y, width, height);
        this.border.setStrokeStyle(2, 0xF4E991, 1)

        scene.add.existing(this)

        this.on('pointerover', function () {
            this.pointerover = true;
        });
        
        this.on('pointerout', function () {
            this.pointerover = false;
        });

        this.on('dragleave', function (pointer, target) {
        });
        
        this.on('pointerdown', function () {
        });
    }
}

var RectangleContains = function (rect, x, y)
{
    if (rect.width <= 0 || rect.height <= 0)
    {
        return false;
    }
    return (rect.x <= x && rect.x + rect.width >= x && rect.y <= y && rect.y + rect.height >= y);
};