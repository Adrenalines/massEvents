Ext.define("MassEvents.store.kpiStore", {
  extend: "Ext.data.TreeStore",
  id: "kpiStore",
  fields: [
    "id",
    "text",
    "tableHourly",
    "columnHourly",
    "tableDaily",
    "columnDaily",
    "leaf",
    "checked"
  ],
  proxy: {
    type: "ajax",
    url: "./data/KPIData.json"
  }
});
