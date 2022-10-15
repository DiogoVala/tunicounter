import Card from './card.js'
import Dice from './dice.js'
import LifeCounter from './lifecounter.js'
import gameZone from './gamezone.js'

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
}

var game = new Phaser.Game(config)

function preload ()
{
    this.load.image("bg", 'assets/FABPlayMat.webp')
    this.load.image("cardback",     "assets/back.png")
    this.load.image("ARC000",       "assets/ARC000.png")
    this.load.image("CRU000-CF",    "assets/CRU000-CF.png")
    this.load.image("ELE000-CF",    "assets/ELE000-CF.png",)
    this.load.image("EVR000-CF",    "assets/EVR000-CF.png",)
    this.load.image("MON000-CF",    "assets/MON000-CF.png",)
    this.load.image("UPR000",       "assets/UPR000.png",)
    this.load.image("WTR000-CF",    "assets/WTR000-CF.png",)
    this.load.image("UPR182-CF",    "assets/UPR182-CF.png",)
    this.load.image("WTR150-CF",    "assets/WTR150-CF.png",)

    this.load.spritesheet("dice", "assets/dice_sheet.png",  { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet("nums", "assets/nums.png",  { frameWidth: 314, frameHeight: 500 })
}

var keyEvent, newKeyDown, newKeyUp
var keys, numbers

function create ()
{
    /* Private Variables */
    var objectTag = 0

    /* Public Variables*/
    this.clickDuration = 0
    this.zones = []
    this.cardPiles = new Map()
    this.cards_on_board = []

    var bg = this.add.image(1280/2-100, 720/2, 'bg').setScale(1.5)

    /* Game objects */
    this.dice = new Dice(this,200,200, 'dice')
    this.lifecounter = new LifeCounter(this, 420, 590)

    /* Keyboard inputs */
    keys = this.input.keyboard.addKeys('T,F,R,S')
    numbers = this.input.keyboard.addKeys('ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE')

    /* Game Zones */
    this.zones.push(new gameZone(this, 92, 228, 114, 160, "head"))
    this.zones.push(new gameZone(this, 92, 398, 114, 160, "chest"))
    this.zones.push(new gameZone(this, 220, 398, 114, 160, "arms"))
    this.zones.push(new gameZone(this, 92, 569, 114, 160, "legs"))
    this.zones.push(new gameZone(this, 410, 398, 114, 160, "weapon1"))
    this.zones.push(new gameZone(this, 539, 398, 114, 160, "hero"))
    this.zones.push(new gameZone(this, 666, 398, 114, 160, "weapon2"))
    this.zones.push(new gameZone(this, 539, 569, 114, 160, "arsenal"))
    this.zones.push(new gameZone(this, 988, 228, 114, 160, "grave"))
    this.zones.push(new gameZone(this, 988, 398, 114, 160, "deck"))
    this.zones.push(new gameZone(this, 859, 398, 114, 160, "pitch"))
    this.zones.push(new gameZone(this, 988, 569, 114, 160, "banished"))

    var board = new gameZone(this, bg.displayWidth/2, bg.displayHeight/2+35, bg.displayWidth, bg.displayHeight, "board")
    this.children.sendToBack(board)
    this.zones.push(board)

    this.input.keyboard.on('keydown', function (event) { 
        keyEvent = event.key
        newKeyDown = true
    })

    this.input.keyboard.on('keyup', function (event) { 
        keyEvent = event.key
        newKeyUp = true
    })

    this.input.on('dragend', function (pointer, gameObject, dropped) {
        if(gameObject.type == "card")
            if(!dropped){
                var cardPile = this.scene.cardPiles.get(gameObject.zoneTag).slice()
                for(var card of cardPile){
                    this.scene.cards_on_board[+card].x = gameObject.input.dragStartX
                    this.scene.cards_on_board[+card].y = gameObject.input.dragStartY
                }   
            }
    })

    this.GOD = function(card){

        /* Remove from previous list */
        if(this.cardPiles.has(card.previousZone)){
            var list = this.cardPiles.get(card.previousZone)
            var idx = list.indexOf(card.objectTag)
            if(idx >= 0 ){ // Por algum motivo isto estava a ser -1 às vezes e o splice dava merda
                list.splice(idx,1)
            }
            if (list.length === 0){
                this.cardPiles.delete(card.previousZone)
            }
        }

        /* Add to new (existing) list */
        if(this.cardPiles.has(card.zoneTag)){
            var list = this.cardPiles.get(card.zoneTag)
            list.push(card.objectTag)
            this.cardPiles.set(card.zoneTag, list)
        } 
        /* Create a new list */
        else{
            this.cardPiles.set(card.zoneTag, [card.objectTag])
        }
    }


    var cardToSpawn = ['ARC000', 'ELE000-CF', 'EVR000-CF', 'MON000-CF', 'UPR000', 'WTR000-CF', 'CRU000-CF']
    for(var card of cardToSpawn){
        this.cards_on_board.push(new Card(this, 718/2, 420/2, card, 'cardback', "deck", (objectTag++).toString()))
    }

    for(var card of cardToSpawn){
        this.cards_on_board.push(new Card(this, 718/2, 420/2, card, 'cardback', "pitch", (objectTag++).toString()))
    }

    this.cards_on_board.push(new Card(this, 718/2, 420/2, 'UPR182-CF', 'cardback', "head", (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2, 420/2, 'WTR150-CF', 'cardback', "chest", (objectTag++).toString()))

}

function update (time)
{   
    //console.log(this.input.activePointer.x, this.input.activePointer.y)
    if(this.input.activePointer.isDown){
        this.clickDuration++
    }
    else{
        this.clickDuration = 0
    }

    var active_card = overedCard(this.cards_on_board)
    
    if(newKeyDown){
        var key = keyEvent.toLowerCase()
        switch (key) {
            case  't':
                if (active_card != false){
                    if(active_card.draggingPile){
                        tapPile(this, active_card)
                    }
                    else{
                        active_card.tap()
                    }
                }
                break
            case 'f':
                if (active_card != false){
                    if(active_card.draggingPile){
                        flipPile(this, active_card)
                    }
                    else{
                        active_card.flip()
                    }
                }
                break
            break
            case 's':
                if (active_card != false){
                    active_card.scry()
                }
            break
            case 'r':
                if(this.dice.pointerover){
                    this.dice.roll()
                }
                else if(active_card != false){
                    shufflePile(this, active_card.zoneTag)
                }
                break
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                if(this.dice.pointerover){
                    this.dice.setSide(+key)
                }
            case '7':
            case '8':
            case '9':
            case '0':
                if(this.lifecounter.pointerover){
                    this.lifecounter.setVal(+key)
                }
            break
            case '+':
                if(this.dice.pointerover){
                    this.dice.increaseSize()
                }
                break
            case '-':
                if(this.dice.pointerover){
                    this.dice.decreaseSize()
                }
                break
            default:
            break
        }
        newKeyDown=false
    }

    if(newKeyUp){
        var key = keyEvent.toLowerCase()
        switch (key) {
            case 's':
                if (active_card != false){
                    active_card.unscry()
                }
            break
            default:
            break
        }
        newKeyUp=false
    }
}

function overedCard(cards){
    var return_card = false
    var card
    for (card of cards){
        if (card.pointerover){
            return_card = card
            break
        }
    }
    
    return return_card
}

function flipPile(scene, active_card){
    var cardPile = scene.cardPiles.get(active_card.zoneTag).slice()
    for(var card of cardPile){
        scene.cards_on_board[+card].flip()
    }   
}

function tapPile(scene, active_card){
    var cardPile = scene.cardPiles.get(active_card.zoneTag).slice()
    for(var card of cardPile){
        scene.cards_on_board[+card].tap()
    }   
}

function shufflePile(scene, zoneTag){
    var list = scene.cardPiles.get(zoneTag)

    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
    for(var card of list){
        scene.children.bringToTop(scene.cards_on_board[+card])
    }   
    scene.cards_on_board[+card].showNumCards() // Só para ficar bonito
    scene.cardPiles.set(zoneTag, list)
}

