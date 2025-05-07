const depletedPools = [];

for (const pool in actor.system.powerPoints) {
  if (actor.system.powerPoints[pool].max > 0 &&
    actor.system.powerPoints[pool].value < actor.system.powerPoints[pool].max) {
    depletedPools.push(pool);
  }
}
if (depletedPools.length === 0) {
    ui.notifications.warn("No Power Point pools need refreshing!");
} else if (actor.system.bennies.value < 1) {
    ui.notifications.warn("Not enough Bennies!");
} else if (depletedPools.length === 1) {
  refreshPool(depletedPools[0]);
} else {
  let optionHtml = `<form autocomplete="off">
    <p>Choose a Power Point pool to refresh:</p>
    <fieldset>
      <legend>Power Point pool</legend>`;
      
  let checked = ` checked`;
  
  for (var i = 0; i < depletedPools.length; i++) {
    let poolName = depletedPools[i];
    let poolLabel = poolName.charAt(0).toUpperCase() + poolName.substring(1).toLowerCase();
    
    optionHtml = optionHtml.concat(`<div class="form-group">
        <label>` + poolLabel + `</label>
        <span class="form-fields">
          <input type="radio" id="` + poolName + `" name="pool" value="` + poolName + `"` + checked + ` />
        </span>
      </div>`);
      
      checked = ``;
  }
  optionHtml = optionHtml.concat(`</fieldset>
  </form>`);
  
  let optionBox = new Dialog({
    title: "Refresh Power Points",
    content: optionHtml,
    buttons: {
      yes: {
        label: "Refresh",
        callback: (html) => parsePoolChoice(html),
        icon: `<i class="fas fa-check"></i>`
      },
      no: {
	    label: "Cancel",
        callback: () => console.log('🙁'),
        icon: `<i class="fas fa-times"></i>`
	    }
    }
  });
  
  await optionBox.render(true);
}

async function parsePoolChoice(html) {
  const formElement = html[0].querySelector('form');
  const formData = new FormDataExtended(formElement);
  refreshPool(formData.object.pool);
}

async function refreshPool(pool) {
  let addPP = Math.min(5, actor.system.powerPoints[pool].max - actor.system.powerPoints[pool].value);
  let newPP = actor.system.powerPoints[pool].value + addPP;
  let poolValueProperty = `system.powerPoints.` + pool + `.value`
  actor.spendBenny();
  await actor.update({[poolValueProperty] : newPP});
  ui.notifications.info(addPP + " Power Points restored to " + pool + " pool!");
}