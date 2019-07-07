Ext.define("MassEvents.view.chart.mainLoadPan", {
  extend: "Ext.tab.Panel",
  xtype: "load",
  id: "loadTabPanel",
  requires: [
    "MassEvents.view.chart.loadMainController",
    "MassEvents.view.chart.toolbarLoad",
    "MassEvents.view.chart.gridLoad",
    "MassEvents.view.chart.previousGridLoad",
    "MassEvents.view.chart.progressBar"
  ],
  controller: "loadmain",
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
      scale: "medium",
      itemId: "refreshButton",
      tooltip: "Обновить",
      text: "Обновить",
      handler: "reloadAllStores"
    },
    {
      icon: "resources/images/download-selected-icon.png",
      iconCls: "background-size-contain",
      xtype: "button",
      scale: "medium",
      itemId: "downloadSelectedButton",
      id: "downloadSelectedButton",
      tooltip: "Скачать *.xls (только то, что в таблице ниже)",
      text: "Скачать",
      handler: "downloadXlsSelectedPressed"
    },
    {
      icon: "resources/images/download-icon.png",
      iconCls: "background-size-contain",
      xtype: "button",
      scale: "medium",
      itemId: "downloadButton",
      id: "downloadButton",
      tooltip: "Скачать всё *.xls",
      text: "Скачать всё",
      handler: "downloadXlsPressed"
    },
    {
      icon: "resources/images/clear-icon.png",
      iconCls: "background-size-contain",
      xtype: "button",
      scale: "medium",
      itemId: "clearButton",
      id: "clearButton",
      tooltip: "Очистить ранее выгруженное",
      text: "Очистить",
      handler: "clearTablesWindow"
    },
    {
      xtype: "loadProgressBar",
      id: "loadBar",
      hidden: true,
      listeners: {}
    }
  ]
});
