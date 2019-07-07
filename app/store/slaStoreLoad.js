Ext.define("MassEvents.store.slaStoreLoad", {
  extend: "Ext.data.TreeStore",
  fields: ["id", "name", "text", "leaf", "checked"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=SLA_LOAD_TREE"
  }
});
