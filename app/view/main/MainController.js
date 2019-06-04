/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define("MassEvents.view.main.MainController", {
  extend: "Ext.app.ViewController",

  alias: "controller.main",

  onRenderMain: function(panel) {
    /*  Ext.Ajax.request({
              url: './data/load.php',
              method: 'POST',
              timeout: 240000,
              params: {
                  table_name: 'loadStore',
                  kpiType: '2g',
                  obj: "'SLA_OBJECT[77]:MSK_FWCR_C3'",
                  kpis: ['TCH_Traffic']
              },
              success: function(resp, opts) {
                  console.log(resp);
              }

          });*/
  }
});
