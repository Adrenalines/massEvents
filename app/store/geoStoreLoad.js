Ext.define("MassEvents.store.geoStoreLoad", {
  extend: "Ext.data.TreeStore",
  fields: ["id", "name", "text", "leaf", "checked"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=GEO_LOAD_TREE"
  }
});
