Ext.define("MassEvents.view.chart.loadMainController", {
  extend: "Ext.app.ViewController",
  alias: "controller.loadmain",
  mixins: {
    loadKpiController: "MassEvents.view.chart.loadKpiController"
  },

  downloadXlsPressed: function(but) {
    let tab = but.up("panel").getActiveTab();
    if (tab.getTitle() == "Прогресс выгрузки") {
      if (load != undefined) {
        this.downloadXlsAll(but, "load");
      }
    } else {
      this.downloadXlsAll(but, "previous");
    }
  },

  downloadXlsSelectedPressed: function(but) {
    let tab = but.up("panel").getActiveTab();
    if (tab.getTitle() == "Прогресс выгрузки") {
      if (load != undefined) {
        this.downloadXls(but);
      }
    } else {
      this.downloadXls(but);
    }
  },

  setProxyPreviousXls: function(store, kpiType) {
    let aggButton = Ext.getCmp("AggregationButtonLoad"),
      aggregation = aggButton.items.items[aggButton.getValue()].text;
    store.setProxy({
      type: "ajax",
      url: "./data/load.php",
      extraParams: {
        table_name: "previousLoad",
        aggregation: aggregation[0],
        kpiType: kpiType,
        user: Global.resp.USER,
        xls: "xls"
      },
      reader: {
        type: "json",
        rootProperty: "data"
      }
    });
  },

  setStoreXls: function(kpiType) {
    switch (kpiType) {
      case "2g":
        return MassEvents.app.getPreviousLoadStoreXls2g();
      case "3g":
        return MassEvents.app.getPreviousLoadStoreXls3g();
      case "4g":
        return MassEvents.app.getPreviousLoadStoreXls4g();
      case "Sh":
        return MassEvents.app.getPreviousLoadStoreXlsSh();
    }
  },

  setSpinnerButton: function(but) {
    but.disabled = true;
    but.setTooltip("Загрузка...");
    but.setIcon("resources/images/spinner-icon.gif");
    but.setBorder(false);
  },

  backDownloadButton: function(but) {
    if (but != undefined) {
      but.disabled = false;
      but.setBorder(true);
      if (but.getId() === "downloadSelectedButton") {
        but.setTooltip("Скачать *.xls (только то, что в таблице ниже)");
        but.setIcon("resources/images/download-selected-icon.png");
      } else {
        but.setTooltip("Скачать всё *.xls");
        but.setIcon("resources/images/download-icon.png");
      }
    }
  },

  setCsvByTechnology: function(store, grid) {
    let rec = [],
      csv = "",
      itemDelimiter = ";",
      lineDelimiter = "{123!}",
      title = "",
      columns = grid.getColumns(),
      nonEmptyColumns = [];
    for (let column of columns) {
      if (column.fullColumnIndex >= 1) {
        store.each(function(record, idx) {
          if (
            record.get(column.dataIndex) !== "" &&
            record.get(column.dataIndex) !== undefined
          ) {
            nonEmptyColumns.push(column);
            return false;
          }
        });
      }
    }
    let colCount = nonEmptyColumns.length;
    for (let i = 0; i < colCount; i++) {
      title = nonEmptyColumns[i].text;
      title = title.replace("<br />", " ");
      csv += title + itemDelimiter;
    }
    csv = csv.substr(0, csv.length - 1);
    csv += lineDelimiter;

    for (var j = 0; j < store.getCount(); j++) {
      rec = store.getAt(j);

      for (let i = 0; i < colCount; i++) {
        csv += rec.get(nonEmptyColumns[i].dataIndex) + itemDelimiter;
      }
      csv = csv.substr(0, csv.length - 1);
      csv += lineDelimiter;
    }
    csv = csv.substr(0, csv.length - 6);
    return csv;
  },

  downloadXlsAll: function(but, type) {
    this.setSpinnerButton(but);

    let self = this,
      stores = {
        store2g: this.setStoreXls("2g"),
        store3g: this.setStoreXls("3g"),
        store4g: this.setStoreXls("4g"),
        storeSh: this.setStoreXls("Sh")
      };
    if (type == "previous") {
      this.setProxyPreviousXls(stores.store2g, "2g");
      this.setProxyPreviousXls(stores.store3g, "3g");
      this.setProxyPreviousXls(stores.store4g, "4g");
      this.setProxyPreviousXls(stores.storeSh, "Sh");
    } else {
      load.setProxyLoadXls(stores.store2g, "2g");
      load.setProxyLoadXls(stores.store3g, "3g");
      load.setProxyLoadXls(stores.store4g, "4g");
      load.setProxyLoadXls(stores.storeSh, "Sh");
    }
    stores.store2g.load();
    stores.store2g.on({
      load: function() {
        stores.store3g.load();
      }
    });
    stores.store3g.on({
      load: function() {
        stores.store4g.load();
      }
    });
    stores.store4g.on({
      load: function() {
        stores.storeSh.load();
      }
    });
    stores.storeSh.on({
      load: function() {
        let csv = "",
          sheetDelimiter = "{sheet!}";
        csv = self.setCsvByTechnology(
          stores.store2g,
          Ext.getCmp("previousGridTable2g")
        );
        csv +=
          sheetDelimiter +
          self.setCsvByTechnology(
            stores.store3g,
            Ext.getCmp("previousGridTable3g")
          );
        csv +=
          sheetDelimiter +
          self.setCsvByTechnology(
            stores.store4g,
            Ext.getCmp("previousGridTable4g")
          );
        csv +=
          sheetDelimiter +
          self.setCsvByTechnology(
            stores.storeSh,
            Ext.getCmp("previousGridTableSh")
          );
        let winidWin = "Table",
          wintitle = "Data";

        Ext.Ajax.request({
          url: "./data/export_chart_txt.php",
          method: "POST",
          params: { csv: csv },
          success: function(response, options) {
            let doc = window.open(
              "./data/export_xls.php?titletxt=" +
                response.responseText +
                "&title=" +
                wintitle +
                "&cN=" +
                winidWin,
              "_self"
            );
            doc.document.close();
            stores.store2g.destroy();
            stores.store3g.destroy();
            stores.store4g.destroy();
            stores.storeSh.destroy();
            setTimeout(function() {
              self.backDownloadButton(but);
            }, 6000);
          },
          failure: function(response, options) {
            stores.store2g.destroy();
            stores.store3g.destroy();
            stores.store4g.destroy();
            stores.storeSh.destroy();
            alert("!!");
            self.backDownloadButton(but);
          }
        });
      }
    });
  },

  downloadXls: function(but) {
    this.setSpinnerButton(but);
    let self = this,
      grid = but
        .up("tabpanel")
        .getActiveTab()
        .down("tabpanel")
        .getActiveTab()
        .down("grid"),
      store = grid.getStore(),
      csv = this.setCsvByTechnology(store, grid),
      sheetDelimiter = "{sheet!}";
    if (
      store.getId() === "MassEvents.store.loadStore3g" ||
      store.getId() === "MassEvents.store.previousLoadStore3g"
    ) {
      csv = sheetDelimiter + csv;
    } else if (
      store.getId() === "MassEvents.store.loadStore4g" ||
      store.getId() === "MassEvents.store.previousLoadStore4g"
    ) {
      csv = sheetDelimiter + sheetDelimiter + csv;
    } else if (
      store.getId() === "MassEvents.store.loadStoreSh" ||
      store.getId() === "MassEvents.store.previousLoadStoreSh"
    ) {
      csv = sheetDelimiter + sheetDelimiter + sheetDelimiter + csv;
    }

    let winidWin = "Table",
      wintitle = "Data";

    Ext.Ajax.request({
      url: "./data/export_chart_txt.php",
      method: "POST",
      params: { csv: csv },
      success: function(response, options) {
        let doc = window.open(
          "./data/export_xls.php?titletxt=" +
            response.responseText +
            "&title=" +
            wintitle +
            "&cN=" +
            winidWin,
          "_self"
        );
        doc.document.close();
        setTimeout(function() {
          self.backDownloadButton(but);
        }, 2000);
      },
      failure: function(response, options) {
        alert("!!");
        self.backDownloadButton(but);
      }
    });
  },

  clearTablesWindow: function() {
    let self = this;
    let acceptWindow = Ext.create("Ext.window.Window", {
      title: "Очистить всё ранее выгруженное?",
      modal: true,
      width: 300,
      height: 70,
      items: [
        {
          xtype: "button",
          text: "ОК",
          style: "margin-left:30px; margin-top:10px; width:80px;",
          handler: function(e) {
            self.clearTables();
            Ext.WindowManager.getActive().close();
          }
        },
        {
          xtype: "button",
          text: "Отмена",
          style: "margin-left:70px; margin-top:10px; width:80px;",
          handler: function(e) {
            Ext.WindowManager.getActive().close();
          }
        }
      ]
    });
    acceptWindow.show();
  },

  clearTables: function() {
    let self = this;
    Ext.Ajax.request({
      url: Global.getUrl("load", "clearTables"),
      method: "POST",
      timeout: 120000,
      params: {
        user: Global.resp.USER
      },
      success: function() {
        self.removeTables();
        self.hideColumns();
      }
    });
  },

  removeTables: function() {
    Ext.getCmp("loadGridTable2g")
      .getStore()
      .removeAll();
    Ext.getCmp("loadGridTable3g")
      .getStore()
      .removeAll();
    Ext.getCmp("loadGridTable4g")
      .getStore()
      .removeAll();
    Ext.getCmp("loadGridTableSh")
      .getStore()
      .removeAll();
    Ext.getCmp("previousGridTable2g")
      .getStore()
      .removeAll();
    Ext.getCmp("previousGridTable3g")
      .getStore()
      .removeAll();
    Ext.getCmp("previousGridTable4g")
      .getStore()
      .removeAll();
    Ext.getCmp("previousGridTableSh")
      .getStore()
      .removeAll();
  },

  hideColumnsByTechnology: function(grid) {
    let columns = grid.getColumns();
    for (let column of columns) {
      if (column.fullColumnIndex >= 3) {
        column.setHidden(true);
      }
    }
  },

  hideColumns: function() {
    this.hideColumnsByTechnology(Ext.getCmp("loadGridTable2g"));
    this.hideColumnsByTechnology(Ext.getCmp("loadGridTable3g"));
    this.hideColumnsByTechnology(Ext.getCmp("loadGridTable4g"));
    this.hideColumnsByTechnology(Ext.getCmp("loadGridTableSh"));
    this.hideColumnsByTechnology(Ext.getCmp("previousGridTable2g"));
    this.hideColumnsByTechnology(Ext.getCmp("previousGridTable3g"));
    this.hideColumnsByTechnology(Ext.getCmp("previousGridTable4g"));
    this.hideColumnsByTechnology(Ext.getCmp("previousGridTableSh"));
  },

  previousStoreLoad: function(e) {
    let aggButton = Ext.getCmp("AggregationButtonLoad"),
      aggregation = aggButton.items.items[aggButton.getValue()].text,
      bar = e.up("panel").down("pagingtoolbar"),
      store = this.setPreviousLoadStore(e.id.slice(-2));
    e.setLoading("Загрузка...");
    let columns = e.getColumns();
    for (let column of columns) {
      if (column.fullColumnIndex >= 3) {
        column.setHidden(true);
      }
    }
    store.setProxy({
      type: "ajax",
      url: "./data/load.php",
      extraParams: {
        table_name: "previousLoad",
        aggregation: aggregation[0],
        kpiType: e.id.slice(-2),
        user: Global.resp.USER,
        xls: "nonXls"
      },
      reader: {
        type: "json",
        rootProperty: "data"
      }
    });
    store.on({
      load: function(store, records, success) {
        let columns = e.getColumns();
        for (let column of columns) {
          if (column.fullColumnIndex >= 3) {
            store.each(function(record, idx) {
              if (record.get(column.dataIndex) !== "") {
                column.setHidden(false);
                return false;
              }
            });
          }
        }
      }
    });
    bar.setStore(store);
    e.setStore(store);
    store.load();
    e.setLoading(false);
  },

  setPreviousLoadStore: function(kpiType) {
    switch (kpiType) {
      case "2g":
        return MassEvents.app.getPreviousLoadStore2g();
      case "3g":
        return MassEvents.app.getPreviousLoadStore3g();
      case "4g":
        return MassEvents.app.getPreviousLoadStore4g();
      case "Sh":
        return MassEvents.app.getPreviousLoadStoreSh();
    }
  },

  reloadAllPreviousStores: function() {
    this.previousStoreLoad(Ext.getCmp("previousGridTable2g"));
    this.previousStoreLoad(Ext.getCmp("previousGridTable3g"));
    this.previousStoreLoad(Ext.getCmp("previousGridTable4g"));
    this.previousStoreLoad(Ext.getCmp("previousGridTableSh"));
  },

  reloadAllStores: function() {
    if (load != undefined) {
      load.refreshGrid();
    }
    this.reloadAllPreviousStores();
  },

  getObjectArrays: function(startArray) {
    let finishArray = [];
    Ext.Array.each(startArray, function(item, i) {
      if (item.data.leaf == true && item.data.text != "Идёт загрузка...") {
        finishArray.push(item.data.text);
      }
    });
    return finishArray;
  }
});
