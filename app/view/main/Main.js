/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

Ext.define("MassEvents.view.main.Main", {
  extend: "Ext.panel.Panel",
  xtype: "app-main",
  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",
    "MassEvents.view.chart.toolbar",
    "MassEvents.view.main.MainController",
    "MassEvents.view.main.MainModel",
    "MassEvents.view.trees.mainTreesPan",
    "MassEvents.view.trees.mainTreesPanLoad",
    "MassEvents.view.options.mainOptionsPan",
    "MassEvents.view.chart.mainChartPan",
    "MassEvents.view.chart.mainLoadPan"
  ],
  controller: "main",
  viewModel: "main",
  layout: "fit",
  items: {
    xtype: "tabpanel",
    name: "maintemplate",
    items: [
      {
        xtype: "panel",
        name: "loadTab",
        title: "Выгрузка",
        layout: {
          type: "border"
        },
        defaults: {
          border: 2
        },
        items: [
          {
            xtype: "treesLoad",
            flex: 1.2,
            region: "west",
            split: true
          },
          {
            xtype: "load",
            region: "center",
            flex: 4.8
          }
        ]
      },
      {
        xtype: "panel",
        name: "viewTab",
        title: "Представление",
        layout: {
          type: "border"
        },
        defaults: {
          border: 2
        },
        items: [
          {
            xtype: "trees",
            flex: 1.2,
            region: "west",
            split: true
          },
          {
            xtype: "charts",
            region: "center",
            flex: 4,
            reference: "chartsPanel"
          },
          {
            xtype: "options",
            flex: 0.8,
            region: "east"
          }
        ],
        listeners: {
          afterrender: "onRenderMain"
        }
      }
    ]
  }
});
