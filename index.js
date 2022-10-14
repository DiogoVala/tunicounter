import Card from './card.js';
import Dice from './dice.js';
import LifeCounter from './lifecounter.js';
import gameZone from './gamezone.js';

var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    draggable: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/FABPlayMat.webp');
    this.load.image("cardback", "assets/back.png");
    this.load.image("arc000", "assets/ARC000.png");
    this.load.image("arc121", "assets/ARC121.png",);

    this.load.spritesheet("dice", "assets/dice_sheet.png",  { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet("nums", "assets/nums.png",  { frameWidth: 314, frameHeight: 500 });
}

var keys, dice, numbers, lifecounter;
var cards_on_board = [];
var active_card;
var keyEvent, newKeyDown, newKeyUp;


function create ()
{
    var clickDuration = 0;
    var objectTag = 100;

    var bg = this.add.image(1280/2-100, 720/2, 'bg');
    bg.setScale(1.5)

    dice = new Dice(this,200,200, 'dice')

    lifecounter = new LifeCounter(this, 520, 290)

    keys = this.input.keyboard.addKeys('T,F,R,S');
    numbers = this.input.keyboard.addKeys('ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE');

    var deckZone = new gameZone(this, 988, 398, 114, 160, "deck")
    var pitchZone = new gameZone(this, 859, 398, 114, 160, "pitch")
    var graveZone = new gameZone(this, 988, 228, 114, 160, "grave")
    var banishedZone = new gameZone(this, 988, 570, 114, 160, "banished")
    var board = new gameZone(this, bg.displayWidth/2, bg.displayHeight/2+35, bg.displayWidth, bg.displayHeight, "board")
    var zones = [deckZone, pitchZone, graveZone, banishedZone, board]

    this.children.sendToBack(board)

    var cardPiles = new Map();

    this.input.keyboard.on('keydown', function (event) { 
        keyEvent = event.key;
        newKeyDown = true;
    });

    this.input.keyboard.on('keyup', function (event) { 
        keyEvent = event.key;
        newKeyUp = true;
    });

    this.GOD = function(card){

        /* Remove from previous list */
        if(cardPiles.has(card.previousZone)){
            var list = cardPiles.get(card.previousZone)
            var idx = list.indexOf(card.objectTag)
            list.splice(idx,1)
            if (list.length === 0){
                cardPiles.delete(card.previousZone)
            }
        }

        /* Add to new (existing) list */
        if(cardPiles.has(card.zoneTag)){
            var list = cardPiles.get(card.zoneTag)
            list.push(card.objectTag)
            cardPiles.set(card.zoneTag, list)
        } 
        /* Create a new list */
        else{
            cardPiles.set(card.zoneTag, [card.objectTag])
        }
        console.log(cardPiles)
    }

    //As cartas têm de ser criadas no fim, senão ainda não sabem o que é a função scene.GOD() -.-
    cards_on_board.push(new Card(this, 718/2, 420/2, 'arc000', 'cardback', (++objectTag).toString()));
    cards_on_board.push(new Card(this, 718/2 + 100, 420/2, 'arc121','cardback', (++objectTag).toString()));
    cards_on_board.push(new Card(this, 718/2 + 200, 420/2, 'arc121','cardback', (++objectTag).toString()));
    cards_on_board.push(new Card(this, 718/2 + 300, 420/2, 'arc121','cardback', (++objectTag).toString()));
    cards_on_board.push(new Card(this, 718/2 + 400, 420/2, 'arc121','cardback', (++objectTag).toString()));

}

function update (time)
{   
    //console.log(this.input.activePointer.x, this.input.activePointer.y)
    if(this.input.activePointer.isDown){
        this.clickDuration++;
    }
    else{
        this.clickDuration = 0;
    }

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

