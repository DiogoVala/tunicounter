import Card from './card.js';
import Dice from './dice.js';
import LifeCounter from './lifecounter.js';

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

function preload ()
{
    this.load.image('bg', 'assets/FABPlayMat.webp');
    this.load.spritesheet("arc000", "assets/ARC000.png",  { frameWidth: 452, frameHeight: 648 });
    this.load.spritesheet("arc121", "assets/ARC121.png",  { frameWidth: 452, frameHeight: 648 });
    this.load.spritesheet("dice", "assets/dice_sheet.png",  { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet("nums", "assets/nums.png",  { frameWidth: 314, frameHeight: 500 });
    this.gameWidth = this.sys.game.canvas.width
    this.gameHeight = this.sys.game.canvas.height
}

var keys, dice, numbers, lifecounter;
var cards_on_board = [];
var active_card;
var keyEvent, newKeyDown, newKeyUp;

function create ()
{
    
    var bg = this.add.image(1280/2-100, 720/2, 'bg');
    bg.setScale(1.5)
    
    cards_on_board.push(new Card(this, 718/2, 420/2, 'arc000'));
    cards_on_board.push(new Card(this, 718/2 + 100, 420/2, 'arc121'));

    dice = new Dice(this,200,200, 'dice')

    lifecounter = new LifeCounter(this, 520, 290)

    keys = this.input.keyboard.addKeys('T,F,R,S');
    numbers = this.input.keyboard.addKeys('ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE');

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

    this.input.keyboard.on('keydown', function (event) { 
        keyEvent = event.key;
        newKeyDown = true;
    });

    this.input.keyboard.on('keyup', function (event) { 
        keyEvent = event.key;
        newKeyUp = true;
    });

}

function update (time)
{   
    active_card = overedCard(cards_on_board);
    
    if(newKeyDown){
        var key = keyEvent.toLowerCase()
        switch (key) {
            case  't':
                if (active_card != false){
                    active_card.tap();
                }
                break;
            case 'f':
                if (active_card != false){
                    active_card.flip();
                }
            break;
            case 's':
                if (active_card != false){
                    active_card.scry();
                }
            break;
            case 'r':
                if(dice.pointerover){
                    dice.roll();
                }
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                if(dice.pointerover){
                    dice.setSide(+key)
                }
            case '7':
            case '8':
            case '9':
            case '0':
                if(lifecounter.pointerover){
                    lifecounter.setVal(+key);
                }
            break;
            default:
            break;
        }
        newKeyDown=false;
    }

    if(newKeyUp){
        var key = keyEvent.toLowerCase()
        switch (key) {
            case 's':
                if (active_card != false){
                    active_card.unscry();
                }
            break;
            default:
            break;
        }
        newKeyUp=false;
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