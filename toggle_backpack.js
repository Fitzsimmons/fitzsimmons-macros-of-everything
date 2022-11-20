main()

async function main() {
  let tokens = canvas.tokens.controlled

  if(tokens.length != 1) {
    ui.notifications.error("You may only have one token selected when using this macro")
    return
  }

  let actor = tokens[0].actor

  if(!actor) {
    ui.notifications.error("This macro cannot be used unless the selected token has an actor")
    return
  }

  let categorys = actor.getFlag("inventory-plus", "categorys")
  let backpackKey = Object.keys(categorys).find(x => categorys[x].label == "Backpack")
  let backpack = categorys[backpackKey]

  if(!backpack) {
    ui.notifications.error("Character does not have a custom category called 'Backpack'")
    return
  }

  backpack.ignoreWeight = !backpack.ignoreWeight

  actor.setFlag("inventory-plus", "categorys", categorys)
}
