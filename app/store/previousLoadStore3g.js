Ext.define("MassEvents.store.previousLoadStore3g", {
  extend: "Ext.data.Store",
  model: "MassEvents.model.loadStoreModel",
  pageSize: 1000,
  autoLoad: true,
  proxy: {
    type: "ajax",
    url: "./data/load.php",
    extraParams: {
      table_name: "previousLoad",
      kpiType: "3g",
      user: Global.resp.USER
    },
    reader: {
      type: "json",
      rootProperty: "data"
    }
  }
});
