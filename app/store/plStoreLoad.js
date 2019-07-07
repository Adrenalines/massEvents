Ext.define("MassEvents.store.plStoreLoad", {
  extend: "Ext.data.TreeStore",
  fields: ["id", "name", "text", "expandRegion", "leaf"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=PL_LOAD_TREE"
  }
});
