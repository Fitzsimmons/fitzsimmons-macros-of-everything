const DICE_EXPRESSION = "1d6+3"

main()

async function main() {
  let tokens = canvas.tokens.controlled

  if(tokens.length != 1) {
    ui.notifications.error("You must have exactly one token selected when using this macro")
    return
  }

  let actor = tokens[0].actor

  if(!actor) {
    ui.notifications.error("This macro cannot be used unless the selected token has an actor")
    return
  }

  const message = await new Roll(DICE_EXPRESSION).toMessage({"flavor": `granting temporary HP to ${actor.name}:`})
  const newTempHP = Math.max(actor.getRollData().attributes.hp.temp, message.rolls.reduce((t, x) => t + x.total, 0))

  console.log(`Updating ${actor.name} to have ${newTempHP} hitpoints`)
  await actor.update({"system.attributes.hp.temp": newTempHP})
}
