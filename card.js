export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setInteractive();
            let card_augmented = scene.add.image(1300, 350, sprite);
            card.setScale(0.2)
            card_augmented.setAlpha(0)
            scene.input.setDraggable(card);
            
            card.on('pointerover', function () {
                card_augmented.setAlpha(1)
            });
        
            card.on('pointerout', function () {
                card_augmented.setAlpha(0)
            });
            
            return card;
        }
    }
}