Ext.define("MassEvents.view.trees.mainTreesPanLoad", {
  extend: "Ext.panel.Panel",
  xtype: "treesLoad",
  requires: [
    "MassEvents.view.trees.objectListLoad",
    "MassEvents.view.trees.mainTreesPanController",
    "MassEvents.view.trees.mainTreesPanModel",
    "MassEvents.view.trees.serviceListLoad",
    "MassEvents.view.trees.BTSCellListLoad",
    "MassEvents.view.trees.inputLikeLoad"
  ],

  controller: "trees-maintreespan",
  viewModel: {
    type: "trees-maintreespan"
  },

  layout: {
    type: "border",
    align: "stretch"
  },
  defaults: {
    flex: 1
  },
  items: [
    {
      xtype: "objectListLoad",
      region: "north",
      reference: "mrTreeLoad",
      flex: 0.35
    },
    {
      xtype: "btsCellListLoad",
      region: "center",
      flex: 0.26
    },
    {
      xtype: "inputLikeLoad",
      region: "south",
      flex: 0.04,
      bodyStyle: {
        borderWidth: "0 0 5px 0"
      }
    },
    {
      xtype: "servListLoad",
      region: "south",
      flex: 0.35
    }
  ]
});
