const panelConfig = {
  tabTitle: "Flag Block",
  settings: [
      {id:     "input-setting",
       name:   "Flag icon",
       action: {type:        "input",
                placeholder: "⚑ ",
                onChange:    (evt) => { console.log("Input Changed!", evt); }}},
  ]
};
function flagBlock(uid) {
  let tag = "#[[.flag-block]]"
  //let uid = 'A2COTgrNv'
  let query = `[:find ?s .
                      :in $ ?uid
                      :where 
            [?e :block/uid ?uid]
            [?e :block/string ?s]
            ]`;

  let block_string = window.roamAlphaAPI.q(query,uid);
  console.log(block_string);

  if (block_string.includes(tag)){
    block_string = block_string.replace(tag,'');
    window.roamAlphaAPI.updateBlock({"block": 
                {"uid": uid,
                "string": block_string}})
  }else{
    block_string = block_string + " " + tag
    window.roamAlphaAPI.updateBlock({"block": 
                {"uid": uid,
                "string": block_string}})
  }

  
}
async function onload({extensionAPI}) {
  // set defaults if they dont' exist

  extensionAPI.settings.panel.create(panelConfig);
  
  extensionAPI.setting.ui.commandPalette.addCommand(
    {label: 'Flag Block', 
      callback: () => {
        let block = window.roamAlphaAPI.ui.getFocusedBlock();

      if (block != null){
        flagBlock(block['block-uid'])
      }  
      },
    "disable-hotkey": false,
    // this is the default hotkey, and can be customized by the user. 
    // in most cases, you DO NOT want to be setting a default hotkey
    "default-hotkey": "ctrl-shift-f"})
  roamAlphaAPI.ui.blockContextMenu.addCommand({
    label: "Flag Block",
    callback: (e) => flagBlock(e['block-uid'])
  })
  console.log("load flag block plugin");
}

function onunload() {
  roamAlphaAPI.ui.blockContextMenu.removeCommand({
    label: "Flag Block"
  })
  console.log("unload flag block plugin");
}

export default {
  onload,
  onunload
};
