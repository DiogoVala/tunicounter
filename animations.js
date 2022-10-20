var animations = {}
export default animations

animations.enlargeOnHover = function (scene, gameobj_arr){
    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })
    timeline.add({
        targets: gameobj_arr,
        scaleX: 0.205,
        scaleY: 0.205,
        duration: 50,
    })
    timeline.play()
}

animations.reduceOnHover = function(scene, gameobj_arr){
    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })
    timeline.add({
        targets: gameobj_arr,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 50,
    })
    timeline.play()
}

animations.moveCardToPosition = function(scene, card, x, y){
    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })
    timeline.add({
        targets: [card, card.glow],
        x: x,
        y: y,
        duration: 200,
        onComplete: () => {
            card.updatePosition(x, y, card.zoneTag)
        }
    })

    timeline.play()
}

animations.flipAndMoveCardToZone = function(scene, card, zone_x, zone_y, zoneTag){
    //card zone change cant wait for animation to end
    card.zoneTag = zoneTag

    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })
    timeline.add({
        targets: [card, card.glow],
        scale: 0.21,
        duration: 50
    })
    
    timeline.add({
        targets: [card,card.glow],
        scaleX: 0,
        duration: 100,
        delay: 30,
        onComplete: () => {
            if(card.texture.key == card.cardback){
                card.setTexture(card.cardfront)
                card.card_augmented.setTexture(card.cardfront)
            }
            else{
                card.setTexture(card.cardback)
                card.card_augmented.setTexture(card.cardback)
            }
        }
    })
    timeline.add({
        targets: [card,card.glow],
        scaleX: 0.21,
        duration: 50
    })

    timeline.add({
        targets: [card,card.glow],
        scale: 0.2,
        duration: 50
    })

    timeline.add({
        targets: [card,card.glow],
        x: zone_x,
        y: zone_y,
        duration: 200,
        onComplete: () => {
            card.updatePosition(zone_x, zone_y, zoneTag)
        }
    })

    timeline.play()
}

animations.flipCard = function (scene, card, onExitFunction){
    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })
    timeline.add({
        targets: [card, card.glow],
        scale: 0.21,
        duration: 50
    })

    timeline.add({
        targets: [card, card.glow],
        scaleX: 0,
        duration: 100,
        delay: 30,
        onComplete: () => {
            card.flip()
        }
    })
    timeline.add({
        targets: [card,card.glow],
        scaleX: 0.21,
        duration: 50
    })

    timeline.add({
        targets: [card,card.glow],
        scale: 0.2,
        duration: 50,
        onComplete: () => {
            onExitFunction();
        }
    })

    timeline.play()
}

animations.tapCard = function (scene, card){
    const timeline = scene.tweens.timeline({
        onComplete: () => {
            timeline.destroy()
        }
    })

    timeline.add({
        targets: [card, card.glow],
        rotation: card.rotation+Math.PI/2,
        duration: 100,
        onComplete: () => {
            if (this.rotation >= 2*Math.PI){
                this.rotation = 0
            }
        }
    })
    

    timeline.play()
}