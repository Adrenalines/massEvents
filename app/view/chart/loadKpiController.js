Ext.define("MassEvents.view.chart.loadKpiController", {
  extend: "Ext.Mixin",

  closureForProgress: function(kpis, objArrQuote, refs) {
    let progress = 0,
      aggregation =
        refs.AggregationButtonLoad.items.items[
          refs.AggregationButtonLoad.getValue()
        ].text;
    refs.chartSettings = {
      aggr: aggregation,
      startDateLoad: refs.startDateLoad.getValue(),
      endDateLoad: refs.endDateLoad.getValue()
    };
    startDate = Ext.Date.format(
      refs.chartSettings.startDateLoad,
      "Y-m-d H:i:s"
    );
    endDate = Ext.Date.format(refs.chartSettings.endDateLoad, "Y-m-d H:i:s");
    Ext.getCmp("loadGridTable2g").setLoading("Загрузка...");
    Ext.getCmp("loadGridTable3g").setLoading("Загрузка...");
    Ext.getCmp("loadGridTable4g").setLoading("Загрузка...");
    Ext.getCmp("loadGridTableSh").setLoading("Загрузка...");
    return {
      setKpiArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gArr;
          case "3g":
            return kpis.kpi3gArr;
          case "4g":
            return kpis.kpi4gArr;
          case "Sh":
            return kpis.kpiShArr;
        }
      },
      setTableArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gTableArr;
          case "3g":
            return kpis.kpi3gTableArr;
          case "4g":
            return kpis.kpi4gTableArr;
          case "Sh":
            return kpis.kpiShTableArr;
        }
      },
      setColumnsArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gColumnArr;
          case "3g":
            return kpis.kpi3gColumnArr;
          case "4g":
            return kpis.kpi4gColumnArr;
          case "Sh":
            return kpis.kpiShColumnArr;
        }
      },
      setLoadStore: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return MassEvents.app.getLoadStore2g();
          case "3g":
            return MassEvents.app.getLoadStore3g();
          case "4g":
            return MassEvents.app.getLoadStore4g();
          case "Sh":
            return MassEvents.app.getLoadStoreSh();
        }
      },
      makeColumnsVisible: function(kpiType) {
        let grid = Ext.ComponentQuery.query(
            "grid[id=loadGridTable" + kpiType + "]"
          )[0],
          kpiArr = this.setKpiArr(kpiType);
        if (kpiArr.length > 0) {
          Ext.Array.each(kpiArr, function(kpi, i) {
            grid.down("[dataIndex=" + kpi + "]").setVisible(true);
          });
        }
      },
      loadByObject: function(
        load,
        kpiType,
        loadProgressBar,
        progressEnd,
        objArr
      ) {
        let self = this,
          kpiArr = [],
          kpiTableArr = [],
          kpiColumnsArr = [],
          currentProgress;
        kpiArr = this.setKpiArr(kpiType);
        kpiTableArr = this.setTableArr(kpiType);
        kpiColumnsArr = this.setColumnsArr(kpiType);
        if (kpiArr.length > 0) {
          Ext.Array.each(objArr, function(object, i) {
            Ext.Ajax.request({
              url: Global.getUrl("load", "insertObject"),
              method: "POST",
              timeout: 4800000,
              params: {
                obj: object,
                aggregation: refs.chartSettings.aggr[0], // первый символ слов Hourly или Daily
                kpiType: kpiType,
                user: Global.resp.USER,
                startDate: startDate,
                endDate: endDate
              },
              success: function(resp1, opts) {
                Ext.Array.each(kpiArr, function(kpi, j) {
                  Ext.Ajax.request({
                    url: Global.getUrl("load", "insertKpi"),
                    method: "POST",
                    timeout: 4800000,
                    params: {
                      obj: object,
                      aggregation: refs.chartSettings.aggr[0], // первый символ слов Hourly или Daily
                      kpi: kpi,
                      kpiTable: kpiTableArr[j],
                      kpiColumn: kpiColumnsArr[j],
                      kpiType: kpiType,
                      user: Global.resp.USER,
                      startDate: startDate,
                      endDate: endDate
                    },
                    success: function() {
                      progress++;
                      currentProgress = progress / progressEnd;
                      percentCurrentProgress = Math.round(
                        (progress / progressEnd) * 100
                      );
                      if (currentProgress < 1) {
                        loadProgressBar.updateProgress(
                          currentProgress,
                          '<div style="font-size:14px;">' +
                            "Идёт загрузка... (" +
                            percentCurrentProgress +
                            "%)" +
                            "</div>",
                          true
                        );
                      } else {
                        Global.deleteEmptyRows();
                        Ext.getCmp("loadGridTable2g").setLoading(false);
                        Ext.getCmp("loadGridTable3g").setLoading(false);
                        Ext.getCmp("loadGridTable4g").setLoading(false);
                        Ext.getCmp("loadGridTableSh").setLoading(false);
                        load.reloadAllPreviousStores();
                        loadProgressBar.updateProgress(
                          1,
                          '<div style="font-size:14px;">' +
                            "Загрузка завершена" +
                            "</div>",
                          true
                        );
                        self.progressByObject(kpiType);
                        Ext.getCmp("downloadSelectedButton").setDisabled(false);
                        Ext.getCmp("downloadButton").setDisabled(false);
                        Ext.getCmp("clearButton").setDisabled(false);
                        Ext.getCmp("previousLoadTab").setDisabled(false);
                        Ext.getCmp("displayDataButtonLoad").setDisabled(false);
                      }
                    }
                  });
                });
              }
            });
          });
        }
      },
      progressByObject: function(kpiType) {
        let grid = Ext.ComponentQuery.query(
            "grid[id=loadGridTable" + kpiType + "]"
          )[0],
          bar = Ext.ComponentQuery.query(
            "pagingtoolbar[id=loadGridTable" + kpiType + "Bar]"
          )[0],
          kpiArr = this.setKpiArr(kpiType),
          store = this.setLoadStore(kpiType);

        store.setProxy({
          type: "ajax",
          url: "./data/load.php",
          extraParams: {
            table_name: "loadStore",
            aggregation: refs.chartSettings.aggr[0], // первый символ слов Hourly или Daily
            kpiType: kpiType,
            obj: [objArrQuote],
            kpis: [kpiArr],
            user: Global.resp.USER,
            startDate: startDate,
            endDate: endDate,
            xls: "nonXls"
          },
          reader: {
            type: "json",
            rootProperty: "data"
          }
        });
        store.reload();
        grid.setStore(store);
        bar.setStore(store);
      },

      refreshGrid: function() {
        if (kpis.kpi2gArr.length > 0) this.progressByObject("2g");
        if (kpis.kpi3gArr.length > 0) this.progressByObject("3g");
        if (kpis.kpi4gArr.length > 0) this.progressByObject("4g");
        if (kpis.kpiShArr.length > 0) this.progressByObject("Sh");
      },

      setProxyLoadXls: function(store, kpiType) {
        let kpiArr = this.setKpiArr(kpiType);
        store.setProxy({
          type: "ajax",
          url: "./data/load.php",
          extraParams: {
            table_name: "loadStore",
            aggregation: refs.chartSettings.aggr[0], // первый символ слов Hourly или Daily
            kpiType: kpiType,
            obj: [objArrQuote],
            kpis: [kpiArr],
            user: Global.resp.USER,
            startDate: startDate,
            endDate: endDate,
            xls: "xls"
          },
          reader: {
            type: "json",
            rootProperty: "data"
          }
        });
      }
    };
  },

  getArrayByInputLike: function(textInputLike, callback) {
    let objArr = [];
    if (textInputLike.length === 0) {
      callback(objArr);
    } else {
      Ext.Ajax.request({
        url: Global.getUrl("load", "inputLike"),
        method: "POST",
        timeout: 1200000,
        params: {
          obj: textInputLike
        },
        success: function(response) {
          let resp = Ext.decode(response.responseText);
          Ext.Array.each(resp.data, function(item) {
            objArr.push(item.MREG);
          });
          callback(objArr);
        }
      });
    }
  },

  loadKPI: function(button, refs) {
    let self = this,
      slaBefore = Ext.ComponentQuery.query(
        "treepanel[reference=slaTreeLoad]"
      )[0],
      slaContinue = slaBefore.getChecked(),
      geoBefore = Ext.ComponentQuery.query(
        "treepanel[reference=geoTreeLoad]"
      )[0],
      geoContinue = geoBefore.getChecked(),
      regionBefore = Ext.ComponentQuery.query(
        "treepanel[reference=regionTreeLoad]"
      )[0],
      regionContinue = regionBefore.getChecked(),
      btsCellBefore = Ext.ComponentQuery.query(
        "treepanel[reference=btsCellTreeLoad]"
      )[0],
      btsCellContinue = btsCellBefore.getChecked(),
      inputLike = Ext.getCmp("inputLike").getValue(),
      kpiBefore = Ext.ComponentQuery.query(
        "treepanel[reference=checkSrvListLoad]"
      )[0],
      kpiContinue = kpiBefore.getChecked(),
      aggregation =
        refs.AggregationButtonLoad.items.items[
          refs.AggregationButtonLoad.getValue()
        ].text;
    refs.chartSettings = {
      aggr: aggregation,
      startDateLoad: refs.startDateLoad.getValue(),
      endDateLoad: refs.endDateLoad.getValue()
    };
    Global.deleteEmptyRows();
    if (
      slaContinue.length === 0 &&
      geoContinue.length === 0 &&
      regionContinue.length === 0 &&
      btsCellContinue.length === 0 &&
      !inputLike
    ) {
      Ext.Msg.alert("Ошибка", "Не выбрано ни одного объекта.");
    } else if (kpiContinue.length === 0) {
      Ext.Msg.alert("Ошибка", "Не выбрано ни одного KPI.");
    } else if (
      refs.chartSettings.aggr == "Hourly" &&
      refs.chartSettings.endDateLoad - refs.chartSettings.startDateLoad >
        2700000000
    ) {
      Ext.Msg.alert("Ошибка", "Выбран период больше 30 дней.");
    } else if (
      refs.chartSettings.aggr == "Daily" &&
      refs.chartSettings.endDateLoad - refs.chartSettings.startDateLoad >
        31622400000
    ) {
      Ext.Msg.alert("Ошибка", "Выбран период больше 365 дней.");
    } else if (
      slaContinue.length +
        geoContinue.length +
        regionContinue.length +
        btsCellContinue.length >
      5000
    ) {
      Ext.Msg.alert("Ошибка", "Выбрано слишком много объектов.");
    } else {
      button.setLoading(true);
      let textInputLike;
      if (inputLike) {
        textInputLike = Ext.getCmp("textInputLike").getValue();
        textInputLike = textInputLike.replace(/[^a-zA-Zа-яёА-ЯЁ0-9_-\s]/g, "");
        textInputLike = textInputLike.toLowerCase();
      }
      this.getArrayByInputLike(textInputLike, function(inputLikeArr) {
        button.setLoading(false);
        if (
          slaContinue.length === 0 &&
          geoContinue.length === 0 &&
          regionContinue.length === 0 &&
          btsCellContinue.length === 0 &&
          inputLikeArr.length === 0
        ) {
          Ext.Msg.alert("Ошибка", "Нет объектов для выгрузки.");
        } else if (
          slaContinue.length +
            geoContinue.length +
            regionContinue.length +
            btsCellContinue.length +
            inputLikeArr.length >
          5000
        ) {
          Ext.Msg.alert("Ошибка", "Выбрано слишком много объектов.");
        } else {
          let loadProgressBar = Ext.getCmp("loadBar"),
            progress = 0,
            slaArr = [],
            geoArr = [],
            regionArr = [],
            btsArr = [],
            cellArr = [],
            objArr = [],
            kpis = {
              kpi2gArr: [],
              kpi2gColumnArr: [],
              kpi2gTableArr: [],
              kpi3gArr: [],
              kpi3gColumnArr: [],
              kpi3gTableArr: [],
              kpi4gArr: [],
              kpi4gColumnArr: [],
              kpi4gTableArr: [],
              kpiShArr: [],
              kpiShColumnArr: [],
              kpiShTableArr: []
            },
            objArrQuote = [];
          loadProgressBar.setVisible(true);
          loadProgressBar.updateProgress(
            0,
            '<div style="font-size:14px;">' +
              "Идёт загрузка... (" +
              progress +
              "%)" +
              "</div>",
            true
          );
          self.removeTables();
          self.hideColumns();
          Ext.getCmp("downloadSelectedButton").setDisabled(true);
          Ext.getCmp("downloadButton").setDisabled(true);
          Ext.getCmp("clearButton").setDisabled(true);
          Ext.getCmp("previousLoadTab").setDisabled(true);
          Ext.getCmp("displayDataButtonLoad").setDisabled(true);
          Ext.getCmp("loadTabPanel").setActiveTab(Ext.getCmp("loadTab"));
          Ext.Array.each(kpiContinue, function(item, i) {
            if (item.data.leaf == true && item.parentNode.data.text == "2G") {
              kpis.kpi2gArr.push(item.data.id);
              if (refs.chartSettings.aggr == "Hourly") {
                kpis.kpi2gTableArr.push(item.data.tableHourly);
                kpis.kpi2gColumnArr.push(item.data.columnHourly);
              } else {
                kpis.kpi2gTableArr.push(item.data.tableDaily);
                kpis.kpi2gColumnArr.push(item.data.columnDaily);
              }
            } else if (
              item.data.leaf == true &&
              item.parentNode.data.text == "3G"
            ) {
              kpis.kpi3gArr.push(item.data.id);
              if (refs.chartSettings.aggr == "Hourly") {
                kpis.kpi3gTableArr.push(item.data.tableHourly);
                kpis.kpi3gColumnArr.push(item.data.columnHourly);
              } else {
                kpis.kpi3gTableArr.push(item.data.tableDaily);
                kpis.kpi3gColumnArr.push(item.data.columnDaily);
              }
            } else if (
              item.data.leaf == true &&
              item.parentNode.data.text == "4G"
            ) {
              kpis.kpi4gArr.push(item.data.id);
              if (refs.chartSettings.aggr == "Hourly") {
                kpis.kpi4gTableArr.push(item.data.tableHourly);
                kpis.kpi4gColumnArr.push(item.data.columnHourly);
              } else {
                kpis.kpi4gTableArr.push(item.data.tableDaily);
                kpis.kpi4gColumnArr.push(item.data.columnDaily);
              }
            } else if (
              item.data.leaf == true &&
              item.parentNode.data.text == "4G_Sharing"
            ) {
              kpis.kpiShArr.push(item.data.id);
              if (refs.chartSettings.aggr == "Hourly") {
                kpis.kpiShTableArr.push(item.data.tableHourly);
                kpis.kpiShColumnArr.push(item.data.columnHourly);
              } else {
                kpis.kpiShTableArr.push(item.data.tableDaily);
                kpis.kpiShColumnArr.push(item.data.columnDaily);
              }
            }
          });

          if (kpis.kpi2gArr.length != 0) {
            Ext.getCmp("loadTabByTechnology").setActiveTab(Ext.getCmp("tab2g"));
          } else if (kpis.kpi3gArr.length != 0) {
            Ext.getCmp("loadTabByTechnology").setActiveTab(Ext.getCmp("tab3g"));
          } else if (kpis.kpi4gArr.length != 0) {
            Ext.getCmp("loadTabByTechnology").setActiveTab(Ext.getCmp("tab4g"));
          } else if (kpis.kpiShArr.length != 0) {
            Ext.getCmp("loadTabByTechnology").setActiveTab(Ext.getCmp("tabSh"));
          }
          slaArr = self.getObjectArrays(slaContinue);
          regionArr = self.getObjectArrays(regionContinue);
          cellArr = self.getObjectArrays(btsCellContinue);
          Ext.Array.each(btsCellContinue, function(item, i) {
            if (item.data.text.substring(0, 3) == "BTS") {
              btsArr.push(item.data.text);
            }
          });
          Ext.Array.each(geoContinue, function(item, i) {
            if (item.data.leaf == true) {
              geoArr.push(
                "GEOSET[" +
                  item.parentNode.data.text.substring(1, 3) +
                  "]:" +
                  item.data.text
              );
            }
          });
          objArr = slaArr.concat(
            geoArr,
            regionArr,
            btsArr,
            cellArr,
            inputLikeArr
          );
          Ext.Array.each(objArr, function(item, i) {
            objArrQuote.push("'" + item + "'");
          });

          let progressEnd =
            objArr.length *
            (kpis.kpi2gArr.length +
              kpis.kpi3gArr.length +
              kpis.kpi4gArr.length +
              kpis.kpiShArr.length);
          load = self.closureForProgress(kpis, objArrQuote, refs);
          load.makeColumnsVisible("2g");
          load.makeColumnsVisible("3g");
          load.makeColumnsVisible("4g");
          load.makeColumnsVisible("Sh");
          load.loadByObject(self, "2g", loadProgressBar, progressEnd, objArr);
          load.loadByObject(self, "3g", loadProgressBar, progressEnd, objArr);
          load.loadByObject(self, "4g", loadProgressBar, progressEnd, objArr);
          load.loadByObject(self, "Sh", loadProgressBar, progressEnd, objArr);
        }
      });
    }
  }
});
