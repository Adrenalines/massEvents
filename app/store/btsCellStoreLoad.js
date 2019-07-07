Ext.define("MassEvents.store.btsCellStoreLoad", {
  extend: "Ext.data.TreeStore",
  storeId: "btsCellStore",
  fields: ["id", "name", "text", "expandRegion", "expandBts", "leaf"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=BTS_CELL_LOAD_TREE"
  }
});
