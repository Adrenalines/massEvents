Ext.define("MassEvents.store.regionStoreLoad", {
  extend: "Ext.data.TreeStore",
  fields: ["id", "name", "text", "leaf", "checked"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=REGION_LOAD_TREE"
  }
});
