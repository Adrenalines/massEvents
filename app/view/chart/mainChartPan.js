Ext.define("MassEvents.view.chart.mainChartPan", {
  extend: "Ext.tab.Panel",
  xtype: "charts",
  requires: [
    "MassEvents.view.chart.mainChartPanController",
    "MassEvents.view.chart.mainChartPanModel",
    "MassEvents.view.chart.toolbar"
  ],

  controller: "chart-mainchartpan",
  viewModel: {
    type: "chart-mainchartpan"
  },
  dockedItems: [
    {
      xtype: "chartTbar"
    }
  ]
});
