Ext.define("MassEvents.view.chart.mainLoadPan", {
  extend: "Ext.tab.Panel",
  xtype: "load",
  requires: [
    "MassEvents.view.chart.mainChartPanController",
    "MassEvents.view.chart.mainChartPanModel",
    "MassEvents.view.chart.toolbarLoad",
    "MassEvents.view.chart.gridLoad",
    "MassEvents.view.chart.previousGridLoad",
    "MassEvents.view.chart.progressBar"
  ],

  controller: "chart-mainchartpan",
  viewModel: {
    type: "chart-mainchartpan"
  },
  dockedItems: [
    {
      xtype: "loadTBar"
    }
  ],
  layout: "fit",
  items: [{ xtype: "loadGrid" }, { xtype: "previousGrid" }],
  tbar: [
    {
      icon: "resources/images/refresh-icon.png",
      iconCls: "background-size-contain",
      xtype: "button",
      iconAlign: "top",
      scale: "medium",
      itemId: "refreshButton",
      tooltip: "Обновить",
      handler: function() {
        if (load != undefined) {
          load.refreshGrid();
        }
        previousStore2g.reload();
        previousStore3g.reload();
        previousStore4g.reload();
        previousStore4gShr.reload();
      }
    },
    {
      icon: "resources/images/download-icon.png",
      iconCls: "background-size-contain",
      scale: "medium",
      itemId: "downloadButton",
      tooltip: "Скачать *.xls",
      handler: function(e) {
        var b = Ext.getCmp("loadBar");
        b.setVisible(true);
        b.updateProgress(
          0.5,
          '<div style="font-size:14px;">' + "Идёт загрузка... (%)" + "</div>",
          true
        );
      }
    },
    {
      icon: "resources/images/clear-icon.png",
      iconCls: "background-size-contain",
      scale: "medium",
      itemId: "clearButton",
      tooltip: "Очистить ранее выгруженное",
      handler: "clearTables"
    },
    {
      xtype: "loadProgressBar",
      id: "loadBar",
      hidden: true,
      listeners: {
        /*    render: function(e) {
                                                    e.setVisible(false);
                                                }*/
      }
    }
  ]
});
