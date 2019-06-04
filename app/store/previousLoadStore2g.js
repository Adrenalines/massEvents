Ext.define("MassEvents.store.previousLoadStore2g", {
  extend: "Ext.data.Store",
  model: "MassEvents.model.loadStoreModel",
  pageSize: 1000,
  autoLoad: true,
  proxy: {
    type: "ajax",
    url: "./data/load.php",
    extraParams: {
      table_name: "previousLoad",
      kpiType: "2g",
      user: Global.resp.USER
    },
    reader: {
      type: "json",
      rootProperty: "data"
    }
  }
});
