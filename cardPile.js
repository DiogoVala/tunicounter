import animations from './animations.js';

const GLOW_HOVER = 'glowHover';
const ZONE_BOARD = 'board';

export default class Card extends Phaser.GameObjects.Image {
    pointerover = false;
    current_zone;
    previous_zone;
    object_global_tag;
    currentGlowAnimation = 0;

    constructor(scene, x, y, cardfront, cardback, glow, current_zone, object_global_tag) {
        super(scene, x, y, cardfront, cardback, glow, current_zone, object_global_tag);

        scene.add.existing(this);

        // this.glow = scene.add.sprite(x, y, glow).setScale(0.2);
        // this.glow.setFrame(1);
        // this.glow.setAlpha(0);
        scene.children.bringToTop(this);

        this.cardfront = cardfront;
        this.cardback = cardback;
        this.current_zone = current_zone;
        this.previous_zone = current_zone;
        this.object_global_tag = object_global_tag;
        this.selected = false;

        this.pile_size_text = scene.add.text(this.x, this.y, '1', { 
            font: "60px Arial Black", 
            fill: "#fff" 
        });
        this.pile_size_text.setOrigin(0.5, 0.5);
        this.pile_size_text.setStroke("#000", 12);
        this.pile_size_text.setShadow(2, 2, "#333333", 2, true, false);
        this.pile_size_text.setAlpha(0);

        this.setScale(0.2);
        this.setInteractive();
        this.input.dropZone = true;

        this.card_augmented = scene.add.image(1300, 350, cardfront);
        this.card_augmented.setAlpha(0);
        this.card_augmented.setScale(0.8);

        this.displayHeight = Math.round(this.displayHeight);
        this.displayWidth = Math.round(this.displayWidth);
        scene.input.setDraggable(this);

        if (this.current_zone !== ZONE_BOARD) {
            for (let zone of scene.zones) {
                if (zone.current_zone === this.current_zone) {
                    this.updateCardElementsPosition(zone.x, zone.y);
                }
            }
        } else {
            this.updateCardElementsPosition(x, y);
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.on('dragstart', this.onDragStart, this);
        this.on('drag', this.onDrag, this);
        this.on('dragend', this.onDragEnd, this);
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('drop', this.onDrop, this);
    }

    updateCardElementsPosition(x, y) {
        this.x = x;
        this.y = y;
        // this.glow.setPosition(x, y);
        this.pile_size_text.setPosition(x, y);
    }

    updatePosition(x, y, current_zone) {
        this.updateCardElementsPosition(x, y);
        this.current_zone = current_zone;
    }

    setGlowEffect = (effectKey = 0) => {
        if (effectKey === 0) {
            // this.glow.stop(this.currentGlowAnimation);
            // this.glow.setAlpha(0);
            this.currentGlowAnimation = 0;
        } else if (this.currentGlowAnimation !== effectKey) {
            // this.glow.setAlpha(1);
            if (this.currentGlowAnimation !== 0) {
                // this.glow.stop(this.currentGlowAnimation);
            }
            // this.glow.play(effectKey);
            this.currentGlowAnimation = effectKey;
        }
    }

    showNumCards() {
        const pile = this.scene.cardPiles.get(this.current_zone);
        if (pile && pile.length > 1) {
            this.pile_size_text.setText(pile.length);
            this.scene.children.bringToTop(this.pile_size_text);
            this.pile_size_text.setAlpha(1);
        } else {
            this.pile_size_text.setAlpha(0);
        }
    }

    onDragStart() {
        //this.scene.children.bringToTop(this.glow);
        this.scene.children.bringToTop(this);
        this.input.dropZone = false;
    }

    onDrag(pointer, dragX, dragY) {
        for (let [cardIdx, card] of this.scene.selectedCards) {
            card.updatePosition(dragX, dragY, card.current_zone);
            card.input.dropZone = false;
        }
    }

    onDragEnd() {
        this.input.dropZone = true;
        this.showNumCards();
        this.setGlowEffect(GLOW_HOVER);
    }

    onPointerOver() {
        this.card_augmented.setAlpha(1);
        this.setGlowEffect(GLOW_HOVER);
        this.showNumCards();
        //animations.enlargeOnHover(this.scene, [this, this.glow]);
        this.pointerover = true;
    }

    onPointerOut() {
        this.card_augmented.setTexture(this.texture.key);
        this.card_augmented.setAlpha(0);
        this.setGlowEffect(0);
        this.pile_size_text.setAlpha(0);
        //animations.reduceOnHover(this.scene, [this, this.scene]);
        this.pointerover = false;
    }

    onPointerDown() {
        this.pile_size_text.setAlpha(0);
        this.selected = true;
        if (!this.scene.selectedCards.has(this.object_global_tag)) {
            this.scene.selectedCards.set(this.object_global_tag, this);
        }
    }

    onPointerUp() {
        this.selected = false;
        this.scene.longclicked = false;
        this.scene.selectedCards.clear();
    }

    onDrop(pointer, dropZone) {
        this.setGlowEffect(GLOW_HOVER);

        for (let [cardIdx, card] of this.scene.selectedCards) {
            if (dropZone.current_zone !== ZONE_BOARD) {
                if (this.scene.isBdown) {
                    card.updatePosition(dropZone.x, dropZone.y, card.object_global_tag);
                    this.scene.handleCardDrop(card, false);

                    let cardPile = [...this.scene.cardPiles.get(dropZone.current_zone)];
                    for (let idx of cardPile) {
                        this.scene.cards_on_board[parseInt(idx)].updatePosition(card.x, card.y, card.object_global_tag);
                        this.scene.handleCardDrop(this.scene.cards_on_board[parseInt(idx)], true);
                    }
                } else {
                    card.updatePosition(dropZone.x, dropZone.y, dropZone.current_zone);
                    this.scene.handleCardDrop(card, true);
                }
            } else {
                let bottom_cardIdx = this.scene.selectedCards.entries().next().value[0];
                card.updatePosition(this.x, this.y, bottom_cardIdx);
                this.scene.handleCardDrop(card, true);
            }
            card.input.dropZone = true;
            card.selected = false;
        }
        this.scene.selectedCards.clear();
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
