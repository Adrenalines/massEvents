Ext.define("MassEvents.store.previousLoadStore4gShr", {
  extend: "Ext.data.Store",
  model: "MassEvents.model.loadStoreModel",
  pageSize: 1000,
  autoLoad: true,
  proxy: {
    type: "ajax",
    url: "./data/load.php",
    extraParams: {
      table_name: "previousLoad",
      kpiType: "4gShr",
      user: Global.resp.USER
    },
    reader: {
      type: "json",
      rootProperty: "data"
    }
  }
});
