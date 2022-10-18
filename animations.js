var animations = {}
export default animations

animations.enlargeCardOnHover = function (scene, gameobj_arr){
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

animations.reduceCardOnHover = function(scene, gameobj_arr){
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