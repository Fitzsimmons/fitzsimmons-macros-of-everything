main(args)

function createDiceOptionsForm(count) {
  let options = "";

  for (var i = count; i >= 1; i--) {
    options += `<option value="${i}">${i}</option>`
  }

  return `<form><select>
    ${options}
  </select></form>
  `
}

async function main(args) {
  let target = await fromUuid(args[0].hitTargetUuids[0] ?? "");
  let self = await fromUuid(args[0].actorUuid ?? "");

  const remainingInPool = self.getRollData().resources.primary.value;
  const maximumSpend = Math.max(1, self.getRollData().abilities.cha.mod + 1);
  const maximumDice = Math.min(remainingInPool, maximumSpend);

  if(maximumDice <= 0) {
    await Dialog.prompt({
      title: "Healing Light",
      content: "Healing Light does not have any dice remaining.",
      label: "OK",
    });

    return;
  }

  const diceOptionsForm = createDiceOptionsForm(maximumDice);

  let diceSelection = await new Promise((resolve, reject) => {
    new Dialog({
      title: "Healing Light",
      content: `How many dice do you want to use? ${diceOptionsForm}`,
      close: reject,
      buttons: {
        cancel: { label: "Cancel", callback: reject },
        ok: { label: "OK", callback: (html) => { 
          const selectElement = html[0].querySelector("select");
          resolve(Number(selectElement.selectedOptions[0].value));
        }},
      }
    }).render(true);
  });


  const healRollMessage = await new Roll(`${diceSelection}d6`).toMessage({"flavor": `${target.name} healed by Healing Light`});
  const healTotal = healRollMessage.rolls.reduce((t, x) => t + x.total, 0);
  console.log(`Would have healed ${healTotal}`); //TODO: actually heal
  
  const resourceRemaining = remainingInPool - diceSelection
  await self.update({"system.resources.primary.value": resourceRemaining});

}
