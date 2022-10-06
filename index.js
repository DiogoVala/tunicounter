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
    this.load.spritesheet("arc000", "assets/ARC000.png",  { frameWidth: 452, frameHeight: 648 });
    this.load.spritesheet("arc121", "assets/ARC121.png",  { frameWidth: 452, frameHeight: 648 });
}

var keys;
var card, card1;
var pointerover = false;
var cards_on_board = [];
function create ()
{
    var bg = this.add.image(1280/2-100, 720/2, 'bg');
    bg.setScale(1.5)

    
    cards_on_board.push(new Card(this, 718/2, 420/2, 'arc000'));
    cards_on_board.push(new Card(this, 718/2 + 100, 420/2, 'arc121'));

    keys = this.input.keyboard.addKeys('T,F');
   
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
            
}

function update ()
{   
    if(Phaser.Input.Keyboard.JustDown(keys.T)){
        var card = overedCard(cards_on_board);
        if (card != false){
            card.tap();
        }
    }

    if(Phaser.Input.Keyboard.JustDown(keys.F)){
        var card = overedCard(cards_on_board);
        if (card != false){
            card.flip();
        }
    }
}

function overedCard(cards){
    var return_card = false;

    for (card of cards){
        if (card.pointerover){
            return_card = card;
            break;
        }
    }
    
    return return_card;
}