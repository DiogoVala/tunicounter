
class AugmentedCard extends Phaser.GameObjects.Image {
    constructor(scene, x, y, cardfront) {
        super(scene, x, y, cardfront);
        scene.add.existing(this);
        this.setAlpha(0)
        this.setScale(0.8);
    }
    show(card_face){
        this.setTexture(card_face);
        this.setAlpha(1);
    }
    hide(){
        this.setAlpha(0);
    }
}

export default class Card extends Phaser.GameObjects.Image {
    pointerover = false;
    current_zone;
    previous_zone;
    object_global_tag;
    currentGlowAnimation = 0;

    constructor(scene, x, y, cardfront, cardback, glow, current_zone, object_global_tag) {
        super(scene, x, y, cardfront);

        this.setScale(0.2); // Change this to be dynamic
        this.setInteractive();
        this.input.dropZone = true;
        scene.add.existing(this);
        scene.children.bringToTop(this);
        scene.input.setDraggable(this);

        this.cardfront = cardfront;
        this.cardback = cardback;
        this.current_zone = current_zone;
        this.previous_zone = current_zone;
        this.object_global_tag = object_global_tag;

        this.card_augmented = new AugmentedCard(scene, 1300, 350, cardfront)

        this.displayHeight = Math.round(this.displayHeight);
        this.displayWidth = Math.round(this.displayWidth);
        
        this.addEventListeners();
    }

    addEventListeners() {
        this.on('dragstart', this.onDragStart);
        this.on('drag', this.onDrag);
        this.on('dragend', this.onDragEnd);
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
        this.on('pointerdown', this.onPointerDown);
        this.on('pointerup', this.onPointerUp);
        this.on('drop', this.onDrop);
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
    }

    onDragStart() {
        this.scene.children.bringToTop(this);
    }

    onDrag(pointer, dragX, dragY) {
        this.updatePosition(dragX, dragY)
    }

    onDragEnd() {
    }

    onPointerOver() {
        this.card_augmented.show(this.texture.key)
        this.pointerover = true;
    }

    onPointerOut() {
        this.card_augmented.hide()
        this.pointerover = false;
    }

    onPointerDown() {
        this.selected = true;
    }

    onPointerUp() {
        this.selected = false;
    }

    onDrop(pointer, gameObject, dropZone) {
    }

    tap() {
        this.rotation = (this.rotation >= 2 * Math.PI) ? 0 : this.rotation + Math.PI / 2;
    }

    flip() {
        if (this.texture.key === this.cardback) {
            this.setTexture(this.cardfront);
            this.card_augmented.setTexture(this.cardfront);
        } else {
            this.setTexture(this.cardback);
            this.card_augmented.setTexture(this.cardback);
        }
    }

    scry() {
        this.card_augmented.setTexture(this.texture.key === this.cardback ? this.cardfront : this.cardback);
    }

    unscry() {
        this.card_augmented.setTexture(this.texture.key);
    }
}
