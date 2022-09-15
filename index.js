import Card from './card.js';

var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    draggable: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var keys;

function preload ()
{
    this.load.image('bg', 'assets/FABPlayMat.webp');
    this.load.image('card', 'assets/ARC121.jpg');
    this.load.image('card1', 'assets/ARC000.jpg');
}


function create ()
{
    var bg = this.add.image(1280/2-100, 720/2, 'bg');
    bg.setScale(1.5)

    var card = new Card(this)
    card.render(718/2, 420/2, 'card')

    var card1 = new Card(this)
    card1.render(718/2+100, 420/2, 'card1')
    /*var card = this.add.image(718/2, 420/2, 'card').setInteractive();
    card_new = this.add.image(1300, 350, 'card');
    card_new.setAlpha(0)
    keys = this.input.keyboard.addKeys('F');

    card.setScale(0.2)
    bg.setScale(1.5)
    this.input.setDraggable(card);

    card.on('pointerover', function () {
        card_new.setAlpha(1)
    });

    card.on('pointerout', function () {
        card_new.setAlpha(0)
    });*/

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });


    
}

function update ()
{

}