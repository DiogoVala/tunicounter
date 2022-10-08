import Card from './card.js';
import Dice from './dice.js';

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
    this.load.spritesheet("dice", "assets/dice_sheet.png",  { frameWidth: 128, frameHeight: 128 });
}

var keys, dice, numbers;
var cards_on_board = [];

function create ()
{
    var bg = this.add.image(1280/2-100, 720/2, 'bg');
    bg.setScale(1.5)

    
    cards_on_board.push(new Card(this, 718/2, 420/2, 'arc000'));
    cards_on_board.push(new Card(this, 718/2 + 100, 420/2, 'arc121'));

    dice = new Dice(this,200,200, 'dice')

    keys = this.input.keyboard.addKeys('T,F,R,S');
    numbers = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR,FIVE,SIX');

    var deckZone = this.add.zone(988, 398).setRectangleDropZone(114, 160);
    var pitchZone = this.add.zone(860, 398).setRectangleDropZone(114, 160);
    var graveZone = this.add.zone(988, 228).setRectangleDropZone(114, 160);
    var banishedZone = this.add.zone(988, 570).setRectangleDropZone(114, 160);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {

        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
    
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

    if(Phaser.Input.Keyboard.JustDown(keys.S) || Phaser.Input.Keyboard.JustUp(keys.S)){
        var card = overedCard(cards_on_board);
        if (card != false){
            card.scry();
        }
    }

    if(dice.pointerover){
        if(Phaser.Input.Keyboard.JustDown(keys.R)){
            dice.roll();
        }

        if(Phaser.Input.Keyboard.JustDown(numbers.ONE)){
            dice.setSide(1);
        }
        else if(Phaser.Input.Keyboard.JustDown(numbers.TWO)){
            dice.setSide(2);
        }
        else if(Phaser.Input.Keyboard.JustDown(numbers.THREE)){
            dice.setSide(3);
        }
        else if(Phaser.Input.Keyboard.JustDown(numbers.FOUR)){
            dice.setSide(4);
        }
        else if(Phaser.Input.Keyboard.JustDown(numbers.FIVE)){
            dice.setSide(5);
        }
        else if(Phaser.Input.Keyboard.JustDown(numbers.SIX)){
            dice.setSide(6);
        }
    }

}

function overedCard(cards){
    var return_card = false;
    var card;
    for (card of cards){
        if (card.pointerover){
            return_card = card;
            break;
        }
    }
    
    return return_card;
}