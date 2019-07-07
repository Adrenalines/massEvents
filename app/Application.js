/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define("MassEvents.Application", {
  extend: "Ext.app.Application",
  name: "MassEvents",
  // requires: ["MassEvents.view.chart.mainChartPanController"],
  stores: [
    "MassEvents.store.loadStore2g",
    "MassEvents.store.loadStore3g",
    "MassEvents.store.loadStore4g",
    "MassEvents.store.loadStoreSh",
    "MassEvents.store.previousLoadStore2g",
    "MassEvents.store.previousLoadStore3g",
    "MassEvents.store.previousLoadStore4g",
    "MassEvents.store.previousLoadStoreSh",
    "MassEvents.store.previousLoadStoreXls2g",
    "MassEvents.store.previousLoadStoreXls3g",
    "MassEvents.store.previousLoadStoreXls4g",
    "MassEvents.store.previousLoadStoreXlsSh"
  ],

  launch: function() {
    let self = this;
    // TODO - Launch the application
    Ext.Ajax.request({
      url: "./data/auth.php",
      params: {},
      scope: this,
      success: function(r) {
        let response = Ext.decode(r.responseText);
        Global.resp = response.USER;
        Global.deleteEmptyRows();
      }
    });
    window.load = undefined;
  },

  onAppUpdate: function() {
    Ext.Msg.alert(
      "Модуль обновлен!",
      'В модуль внесены изменения. Для корректной работы модуля его необходимо обновить, нажав "OK".',
      function() {
        window.location.reload();
      }
    );
  },

  getLoadStore2g: function() {
    return this.getStore("MassEvents.store.loadStore2g");
  },

  getLoadStore3g: function() {
    return this.getStore("MassEvents.store.loadStore3g");
  },

  getLoadStore4g: function() {
    return this.getStore("MassEvents.store.loadStore4g");
  },

  getLoadStoreSh: function() {
    return this.getStore("MassEvents.store.loadStoreSh");
  },

  getPreviousLoadStore2g: function() {
    return this.getStore("MassEvents.store.previousLoadStore2g");
  },

  getPreviousLoadStore3g: function() {
    return this.getStore("MassEvents.store.previousLoadStore3g");
  },

  getPreviousLoadStore4g: function() {
    return this.getStore("MassEvents.store.previousLoadStore4g");
  },

  getPreviousLoadStoreSh: function() {
    return this.getStore("MassEvents.store.previousLoadStoreSh");
  },

  getPreviousLoadStoreXls2g: function() {
    return this.getStore("MassEvents.store.previousLoadStoreXls2g");
  },

  getPreviousLoadStoreXls3g: function() {
    return this.getStore("MassEvents.store.previousLoadStoreXls3g");
  },

  getPreviousLoadStoreXls4g: function() {
    return this.getStore("MassEvents.store.previousLoadStoreXls4g");
  },

  getPreviousLoadStoreXlsSh: function() {
    return this.getStore("MassEvents.store.previousLoadStoreXlsSh");
  }
});
