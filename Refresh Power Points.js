const depletedPools = [];

for (const pool in actor.system.powerPoints) {
  if (actor.system.powerPoints[pool].max > 0 &&
    actor.system.powerPoints[pool].value < actor.system.powerPoints[pool].max) {
    depletedPools.push(actor.system.powerPoints[pool]);
  }
}
if (depletedPools.length === 0) {
    ui.notifications.warn("No Power Point pools need refreshing!");
} else if (actor.system.bennies.value < 1) {
    ui.notifications.warn("Not enough Bennies!");
} else {
  for (const pool in actor.system.powerPoints) {
    if (actor.system.powerPoints[pool].max > 0 &&
      actor.system.powerPoints[pool].value < actor.system.powerPoints[pool].max) {
      let addPP = Math.min(5, actor.system.powerPoints[pool].max - actor.system.powerPoints[pool].value);
      let newPP = actor.system.powerPoints[pool].value + addPP;
      let poolValue = `system.powerPoints.` + pool + `.value`
      actor.spendBenny();
      await actor.update({[poolValue] : newPP});
      ui.notifications.info(addPP + " Power Points restored to " + pool + " pool!");
    }
  }
}