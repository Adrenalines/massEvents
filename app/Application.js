/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define("MassEvents.Application", {
  extend: "Ext.app.Application",

  name: "MassEvents",

  stores: [
    "MassEvents.store.loadStore2g",
    "MassEvents.store.loadStore3g",
    "MassEvents.store.loadStore4g",
    "MassEvents.store.loadStore4gShr"
  ],

  launch: function() {
    // TODO - Launch the application
    Ext.Ajax.request({
      url: "./data/auth.php",
      params: {},
      scope: this,
      success: function(r) {
        var response = Ext.decode(r.responseText);
        Global.resp = response.USER;
        Ext.Ajax.request({
          url: Global.getUrl("load", "deleteEmpty"),
          method: "POST",
          timeout: 60000,
          params: {
            user: Global.resp.USER
          }
        });
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

  getLoadStore4gShr: function() {
    return this.getStore("MassEvents.store.loadStore4gShr");
  }
});
