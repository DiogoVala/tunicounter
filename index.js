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

    this.load.spritesheet("dice", "assets/dice_sheet.png",  { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet("nums", "assets/nums.png",  { frameWidth: 314, frameHeight: 500 })
}

var keys, dice, numbers, lifecounter, cardPiles
var cards_on_board = []
var active_card
var keyEvent, newKeyDown, newKeyUp
var objectTag = 0

function create ()
{
    this.clickDuration = 0
    var objectTag = 0

    var bg = this.add.image(1280/2-100, 720/2, 'bg')
    bg.setScale(1.5)

    dice = new Dice(this,200,200, 'dice')

    lifecounter = new LifeCounter(this, 420, 590)

    keys = this.input.keyboard.addKeys('T,F,R,S')
    numbers = this.input.keyboard.addKeys('ZERO,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE')

    //add dummy drop zones
    var head = new gameZone(this, 92, 228, 114, 160, "head")
    var chest = new gameZone(this, 92, 398, 114, 160, "chest")
    var arms = new gameZone(this, 220, 398, 114, 160, "arms")
    var legs = new gameZone(this, 92, 569, 114, 160, "legs")
    var weapon1 = new gameZone(this, 410, 398, 114, 160, "weapon1")
    var hero = new gameZone(this, 539, 398, 114, 160, "hero")
    var weapon2 = new gameZone(this, 666, 398, 114, 160, "weapon2")
    var arsenal = new gameZone(this, 539, 569, 114, 160, "arsenal")

    var graveZone = new gameZone(this, 988, 228, 114, 160, "grave")
    var deckZone = new gameZone(this, 988, 398, 114, 160, "deck")
    var pitchZone = new gameZone(this, 859, 398, 114, 160, "pitch")
    var banishedZone = new gameZone(this, 988, 569, 114, 160, "banished")
    var board = new gameZone(this, bg.displayWidth/2, bg.displayHeight/2+35, bg.displayWidth, bg.displayHeight, "board")
    var zones = [deckZone, pitchZone, graveZone, banishedZone, board]

    this.children.sendToBack(board)

    this.cardPiles = new Map()
    this.cards_on_board = []

    this.input.keyboard.on('keydown', function (event) { 
        keyEvent = event.key
        newKeyDown = true
    })

    this.input.keyboard.on('keyup', function (event) { 
        keyEvent = event.key
        newKeyUp = true
    })

    this.input.on('dragend', function (pointer, gameObject, dropped) {
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
        //console.log(this.cardPiles)
    }

    //As cartas têm de ser criadas no fim, senão ainda não sabem o que é a função scene.GOD() -.-
    this.cards_on_board.push(new Card(this, 718/2, 420/2, 'ARC000', 'cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 100, 420/2, 'ELE000-CF','cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 200, 420/2, 'EVR000-CF','cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 300, 420/2, 'MON000-CF','cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 400, 420/2, 'UPR000','cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 500, 420/2, 'WTR000-CF','cardback', (objectTag++).toString()))
    this.cards_on_board.push(new Card(this, 718/2 + 600, 420/2, 'CRU000-CF', 'cardback', (objectTag++).toString()))
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

    active_card = overedCard(this.cards_on_board)
    
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
            case 's':
                if (active_card != false){
                    active_card.scry()
                }
            break
            case 'r':
                if(dice.pointerover){
                    dice.roll()
                }
                else if(active_card != false){
                    shufflePile(this, active_card.zoneTag)
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
                    lifecounter.setVal(+key)
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

