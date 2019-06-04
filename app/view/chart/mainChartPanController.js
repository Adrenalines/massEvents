Ext.define("MassEvents.view.chart.mainChartPanController", {
  extend: "Ext.app.ViewController",
  alias: "controller.chart-mainchartpan",

  onShiftData: function(but) {
    var sd = this.lookupReference("startDate"),
      ed = this.lookupReference("endDate"),
      val = but.inputValue,
      sdVal = sd.getValue(),
      sdNewVal = new Date(sdVal.setDate(sdVal.getDate() + parseInt(val))),
      sdVal = new Date(sd.getValue() + parseInt(val)),
      edVal = ed.getValue(),
      edNewVal = new Date(edVal.setDate(edVal.getDate() + parseInt(val))),
      edVal = new Date(ed.getValue() + parseInt(val));
    sd.setValue(sdNewVal);
    ed.setValue(edNewVal);
  },
  toggleBut: function(segmented, button, isPressed) {
    var periodbuttons = this.lookupReference("periodValues");

    periodbuttons.cascade(function(item) {
      if (item.isXType("button")) {
        item.setDisabled(true);
        if (button.inputValue.indexOf("[" + item.inputValue + "]") !== -1) {
          item.setDisabled(false);
        }
        if (item.inputValue === button.defaultPeriod) {
          item.setPressed(true);
        }
      }
    });
  },
  togglePeriodBut: function(segmented, button, isPressed) {
    var enddatefield = this.lookupReference("endDate"),
      startdatefield = this.lookupReference("startDate"),
      adddays = button.inputValue,
      dt = enddatefield.getValue(),
      dInt = 86400000 * Math.abs(adddays);
    startdatefield.setValue(new Date(new Date(dt) - dInt));
  },
  onShiftDataLoad: function(but) {
    var sd = this.lookupReference("startDateLoad"),
      ed = this.lookupReference("endDateLoad"),
      val = but.inputValue,
      sdVal = sd.getValue(),
      sdNewVal = new Date(sdVal.setDate(sdVal.getDate() + parseInt(val))),
      sdVal = new Date(sd.getValue() + parseInt(val)),
      edVal = ed.getValue(),
      edNewVal = new Date(edVal.setDate(edVal.getDate() + parseInt(val))),
      edVal = new Date(ed.getValue() + parseInt(val));
    sd.setValue(sdNewVal);
    ed.setValue(edNewVal);
  },
  toggleButLoad: function(segmented, button, isPressed) {
    var periodbuttons = this.lookupReference("periodValuesLoad");

    periodbuttons.cascade(function(item) {
      if (item.isXType("button")) {
        item.setDisabled(true);
        if (button.inputValue.indexOf("[" + item.inputValue + "]") !== -1) {
          item.setDisabled(false);
        }
        if (item.inputValue === button.defaultPeriod) {
          item.setPressed(true);
        }
      }
    });
  },
  togglePeriodButLoad: function(segmented, button, isPressed) {
    var enddatefield = this.lookupReference("endDateLoad"),
      startdatefield = this.lookupReference("startDateLoad"),
      adddays = button.inputValue,
      dt = enddatefield.getValue(),
      dInt = 86400000 * Math.abs(adddays);
    startdatefield.setValue(new Date(new Date(dt) - dInt));
  },

  getObjectArrays: function(startArray) {
    let finishArray = [];
    Ext.Array.each(startArray, function(item, i) {
      if (item.data.leaf == true && item.data.text != "Идёт загрузка...") {
        finishArray.push(item.data.id);
      }
    });
    return finishArray;
  },

  closureForProgress: function(kpis, objArrQuote, refs) {
    let progress = 0,
      aggregation =
        refs.AgregationButtonLoad.items.items[
          refs.AgregationButtonLoad.getValue()
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
    return {
      setKpiArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gArr;
          case "3g":
            return kpis.kpi3gArr;
          case "4g":
            return kpis.kpi4gArr;
          case "4gShr":
            return kpis.kpi4gShrArr;
        }
      },
      setTableArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gTableHourlyArr;
          case "3g":
            return kpis.kpi3gTableHourlyArr;
          case "4g":
            return kpis.kpi4gTableHourlyArr;
          case "4gShr":
            return kpis.kpi4gShrTableHourlyArr;
        }
      },
      setColumnsArr: function(kpiType) {
        switch (kpiType) {
          case "2g":
            return kpis.kpi2gColumnHourlyArr;
          case "3g":
            return kpis.kpi3gColumnHourlyArr;
          case "4g":
            return kpis.kpi4gColumnHourlyArr;
          case "4gShr":
            return kpis.kpi4gShrColumnHourlyArr;
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
          case "4gShr":
            return MassEvents.app.getLoadStore4gShr();
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
              timeout: 1200000,
              params: {
                obj: object,
                kpiType: kpiType,
                user: Global.resp.USER,
                startDate: startDate,
                endDate: endDate
              },
              success: function(resp1, opts) {
                self.progressByObject(kpiType);
                Ext.Array.each(kpiArr, function(kpi, j) {
                  Ext.Ajax.request({
                    url: Global.getUrl("load", "insertKpi"),
                    method: "POST",
                    timeout: 1200000,
                    params: {
                      obj: object,
                      kpi: kpi,
                      kpiTable: kpiTableArr[j],
                      kpiColumn: kpiColumnsArr[j],
                      kpiType: kpiType,
                      user: Global.resp.USER,
                      startDate: startDate,
                      endDate: endDate
                    },
                    success: function(resp2) {
                      self.progressByObject(kpiType);
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
                        load.deleteEmptyRows();
                        loadProgressBar.updateProgress(
                          1,
                          '<div style="font-size:14px;">' +
                            "Загрузка завершена" +
                            "</div>",
                          true
                        );
                        self.progressByObject(kpiType);
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
            kpiType: kpiType,
            obj: [objArrQuote],
            kpis: [kpiArr],
            user: Global.resp.USER,
            startDate: startDate,
            endDate: endDate
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
        if (kpis.kpi4gShrArr.length > 0) this.progressByObject("4gShr");
      }
    };
  },

  deleteEmptyByTechnology(kpiType) {
    Ext.Ajax.request({
      url: Global.getUrl("load", "deleteEmpty"),
      method: "POST",
      timeout: 240000,
      params: {
        kpiType: kpiType,
        user: Global.resp.USER
      },
      success: function(resp) {
        if (load != undefined) {
          load.refreshGrid();
        }
      }
    });
  },

  deleteEmptyRows: function() {
    this.deleteEmptyByTechnology("2g");
    this.deleteEmptyByTechnology("3g");
    this.deleteEmptyByTechnology("4g");
    this.deleteEmptyByTechnology("4gShr");
  },

  clearTables: function() {
    Ext.Ajax.request({
      url: Global.getUrl("load", "clearTables"),
      method: "POST",
      timeout: 120000,
      params: {
        user: Global.resp.USER
      }
    });
    load.refreshGrid();
  },

  loadKPI: function(button) {
    let slaBefore = Ext.ComponentQuery.query(
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
      kpiBefore = Ext.ComponentQuery.query(
        "treepanel[reference=checkSrvListLoad]"
      )[0],
      kpiContinue = kpiBefore.getChecked(),
      selRegIdsArr = [],
      selRegIdsArr2 = [],
      slaArr = [],
      geoArr = [],
      regionArr = [],
      btsArr = [],
      cellArr = [],
      objArr = [],
      kpis = {
        kpi2gArr: [],
        kpi2gColumnHourlyArr: [],
        kpi2gTableHourlyArr: [],
        kpi2gColumnDailyArr: [],
        kpi2gTableDailyArr: [],
        kpi3gArr: [],
        kpi3gColumnHourlyArr: [],
        kpi3gTableHourlyArr: [],
        kpi3gColumnDailyArr: [],
        kpi3gTableDailyArr: [],
        kpi4gArr: [],
        kpi4gColumnHourlyArr: [],
        kpi4gTableHourlyArr: [],
        kpi4gColumnDailyArr: [],
        kpi4gTableDailyArr: [],
        kpi4gShrArr: [],
        kpi4gShrColumnHourlyArr: [],
        kpi4gShrTableHourlyArr: [],
        kpi4gShrColumnDailyArr: [],
        kpi4gShrTableDailyArr: []
      },
      objArrQuote = [],
      refs = this.getReferences(),
      aggregation =
        refs.AgregationButtonLoad.items.items[
          refs.AgregationButtonLoad.getValue()
        ].text;
    refs.chartSettings = {
      aggr: aggregation,
      startDateLoad: refs.startDateLoad.getValue(),
      endDateLoad: refs.endDateLoad.getValue()
    };
    this.deleteEmptyRows();
    if (
      refs.chartSettings.aggr == "Hourly" &&
      refs.chartSettings.endDateLoad - refs.chartSettings.startDateLoad >
        2700000000
    ) {
      alert("Выбран период больше 30 дней.");
    } else {
      let loadProgressBar = Ext.getCmp("loadBar"),
        progress = 0;
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

      Ext.Array.each(kpiContinue, function(item, i) {
        if (item.data.leaf == true && item.parentNode.data.text == "2G") {
          kpis.kpi2gArr.push(item.data.id);
          kpis.kpi2gTableHourlyArr.push(item.data.tableHourly);
          kpis.kpi2gColumnHourlyArr.push(item.data.columnHourly);
        } else if (
          item.data.leaf == true &&
          item.parentNode.data.text == "3G"
        ) {
          kpis.kpi3gArr.push(item.data.id);
          kpis.kpi3gTableHourlyArr.push(item.data.tableHourly);
          kpis.kpi3gColumnHourlyArr.push(item.data.columnHourly);
        } else if (
          item.data.leaf == true &&
          item.parentNode.data.text == "4G"
        ) {
          kpis.kpi4gArr.push(item.data.id);
          kpis.kpi4gTableHourlyArr.push(item.data.tableHourly);
          kpis.kpi4gColumnHourlyArr.push(item.data.columnHourly);
        } else if (
          item.data.leaf == true &&
          item.parentNode.data.text == "4G_Sharing"
        ) {
          kpis.kpi4gShrArr.push(item.data.id);
          kpis.kpi4gShrTableHourlyArr.push(item.data.tableHourly);
          kpis.kpi4gShrColumnHourlyArr.push(item.data.columnHourly);
        }
      });

      slaArr = this.getObjectArrays(slaContinue);
      regionArr = this.getObjectArrays(regionContinue);
      cellArr = this.getObjectArrays(btsCellContinue);
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
      objArr = slaArr.concat(geoArr, regionArr, btsArr, cellArr);
      Ext.Array.each(objArr, function(item, i) {
        objArrQuote.push("'" + item + "'");
      });
      let progressEnd =
        objArr.length *
        (kpis.kpi2gArr.length +
          kpis.kpi3gArr.length +
          kpis.kpi4gArr.length +
          kpis.kpi4gShrArr.length);
      load = this.closureForProgress(kpis, objArrQuote, refs);
      load.makeColumnsVisible("2g");
      load.makeColumnsVisible("3g");
      load.makeColumnsVisible("4g");
      load.makeColumnsVisible("4gShr");
      load.loadByObject(this, "2g", loadProgressBar, progressEnd, objArr);
      load.loadByObject(this, "3g", loadProgressBar, progressEnd, objArr);
      load.loadByObject(this, "4g", loadProgressBar, progressEnd, objArr);
      load.loadByObject(this, "4gShr", loadProgressBar, progressEnd, objArr);
    }
  },

  renderCharts: function(button) {
    var srvPan = Ext.ComponentQuery.query(
        "treepanel[reference=checkSrvList]"
      )[0],
      srvList = srvPan.getChecked(),
      graphList = [
        "2G Traffic, CSSR, Availability",
        "2G DCR, BCR",
        "2G Cells, Calls",
        "3G SP",
        "3G Data",
        "3G Cells, Calls",
        "3G Data Traffic, THR",
        "4G DPH_UE, CSSR_LTE",
        "4G Traffic, Thr, User_Max",
        "4G VoLTE",
        "4G Sharing",
        "4G Sharing Traffic, Thp"
      ],
      moPan = Ext.ComponentQuery.query("treepanel[reference=slaTree]")[0],
      selReg = moPan.getChecked(),
      srvListNameArr = [[], []],
      selRegIdsArr,
      srvListArr = [],
      refs = this.getReferences(),
      pan = this.getView(),
      panH = pan.getHeight() - 80,
      panW = pan.getWidth() - 19,
      that = this,
      chartPan,
      chart,
      highchart,
      countChartsOnScreen = Ext.ComponentQuery.query(
        "#countChartBut"
      )[0].getValue(),
      renderType = Ext.ComponentQuery.query(
        "radio[name=rbchartortable][checked=true]"
      )[0].inputValue,
      legend =
        Ext.ComponentQuery.query(
          "checkbox[name=LegendsChartShowed][checked=true]"
        )[0] === undefined
          ? false
          : true,
      titles =
        Ext.ComponentQuery.query(
          "checkbox[name=TitlesChartShowed][checked=true]"
        )[0] === undefined
          ? false
          : true,
      xAxisTip =
        Ext.ComponentQuery.query(
          "checkbox[name=xAxisLabelsShowed][checked=true]"
        )[0] === undefined
          ? false
          : true,
      aggregation =
        refs.AgregationButton.items.items[refs.AgregationButton.getValue()]
          .text,
      nowDate =
        aggregation === "Hourly"
          ? Ext.Date.format(new Date(), "H") + ":00:00"
          : "00:00:00",
      chartSettings = {},
      curTab,
      chartSizeObj = this.onCalculatePanelsSize(
        countChartsOnScreen,
        panW,
        panH
      ),
      panForChart = {
        margin: "0 0 0 0",
        border: 5,
        width: chartSizeObj[0],
        height: chartSizeObj[1]
      };
    refs.chartSettings = {
      aggr: aggregation,
      startDate: refs.startDate.getValue(),
      endDate: refs.endDate.getValue()
    };
    Ext.Array.each(pan.items.items, function(item, i) {
      curTab = pan.getActiveTab();
      pan.remove(curTab);
    });
    indexTab = pan.items.length + 1;

    Ext.Array.each(selReg, function(item, i) {
      if (renderType === "chart") {
        // <-- в этом месте добавляется новая вкладка для дальшейшей отрисовки графиков
        newTab = pan.add(
          new Ext.Panel({
            title: selReg[i].data.name,
            flex: 1,
            layout: {
              type: "table",
              columns: chartSizeObj[2],
              align: "stretch"
            },
            closable: true,
            autoScroll: true
          })
        );
      } else if (renderType === "table") {
        newTab = pan.add(
          new Ext.Panel({
            title: selReg[i].data.name,
            flex: 1,
            layout: {
              type: "vbox",
              align: "stretch"
            },
            closable: true,
            autoScroll: true
          })
        );
      }
    });

    for (var j = 0; j < srvList.length; j++) {
      if (srvList[j].data.id == "TCH_Traffic") {
        if (srvListArr.indexOf(graphList[0]) == -1) {
          srvListArr.push(graphList[0]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "SDCCH_Traffic") {
        if (srvListArr.indexOf(graphList[0]) == -1) {
          srvListArr.push(graphList[0]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CSSR") {
        if (srvListArr.indexOf(graphList[0]) == -1) {
          srvListArr.push(graphList[0]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "BSS_Availability_Rate") {
        if (srvListArr.indexOf(graphList[0]) == -1) {
          srvListArr.push(graphList[0]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Drop_Call_Rate") {
        if (srvListArr.indexOf(graphList[1]) == -1) {
          srvListArr.push(graphList[1]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "SDCCH_Blocking_Rate") {
        if (srvListArr.indexOf(graphList[1]) == -1) {
          srvListArr.push(graphList[1]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "TCH_Serv_Blocking_Rate") {
        if (srvListArr.indexOf(graphList[1]) == -1) {
          srvListArr.push(graphList[1]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CELL_Count_2G") {
        if (srvListArr.indexOf(graphList[2]) == -1) {
          srvListArr.push(graphList[2]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Calls_Count_2G") {
        if (srvListArr.indexOf(graphList[2]) == -1) {
          srvListArr.push(graphList[2]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Sp") {
        if (srvListArr.indexOf(graphList[3]) == -1) {
          srvListArr.push(graphList[3]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Drop_Sp") {
        if (srvListArr.indexOf(graphList[3]) == -1) {
          srvListArr.push(graphList[3]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CSSR_Sp") {
        if (srvListArr.indexOf(graphList[3]) == -1) {
          srvListArr.push(graphList[3]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Block_Sp") {
        if (srvListArr.indexOf(graphList[3]) == -1) {
          srvListArr.push(graphList[3]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "RAN_Availability") {
        if (srvListArr.indexOf(graphList[3]) == -1) {
          srvListArr.push(graphList[3]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Drop_Data") {
        if (srvListArr.indexOf(graphList[4]) == -1) {
          srvListArr.push(graphList[4]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CSSR_Data") {
        if (srvListArr.indexOf(graphList[4]) == -1) {
          srvListArr.push(graphList[4]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Block_Data") {
        if (srvListArr.indexOf(graphList[4]) == -1) {
          srvListArr.push(graphList[4]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CELL_Count_3G") {
        if (srvListArr.indexOf(graphList[5]) == -1) {
          srvListArr.push(graphList[5]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Calls_Count_3G") {
        if (srvListArr.indexOf(graphList[5]) == -1) {
          srvListArr.push(graphList[5]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_3G") {
        if (srvListArr.indexOf(graphList[6]) == -1) {
          srvListArr.push(graphList[6]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_DL_3G") {
        if (srvListArr.indexOf(graphList[6]) == -1) {
          srvListArr.push(graphList[6]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_UL_3G") {
        if (srvListArr.indexOf(graphList[6]) == -1) {
          srvListArr.push(graphList[6]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "HSDPA_USER_DC_THR") {
        if (srvListArr.indexOf(graphList[6]) == -1) {
          srvListArr.push(graphList[6]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "HSUPA_USER_THR") {
        if (srvListArr.indexOf(graphList[6]) == -1) {
          srvListArr.push(graphList[6]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "DpH_UE") {
        if (srvListArr.indexOf(graphList[7]) == -1) {
          srvListArr.push(graphList[7]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CSSR_LTE") {
        if (srvListArr.indexOf(graphList[7]) == -1) {
          srvListArr.push(graphList[7]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "LTE_RAN_Avail") {
        if (srvListArr.indexOf(graphList[7]) == -1) {
          srvListArr.push(graphList[7]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_4G") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_DL_4G") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Data_UL_4G") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "UE_Throughput_DL") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "UE_Throughput_UL") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "LTE_User_Max") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CELL_Count_4G") {
        if (srvListArr.indexOf(graphList[8]) == -1) {
          srvListArr.push(graphList[8]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_VoLTE") {
        if (srvListArr.indexOf(graphList[9]) == -1) {
          srvListArr.push(graphList[9]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "DpH_VoLTE_UE") {
        if (srvListArr.indexOf(graphList[9]) == -1) {
          srvListArr.push(graphList[9]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CSSR_VoLTE") {
        if (srvListArr.indexOf(graphList[9]) == -1) {
          srvListArr.push(graphList[9]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "E-RAB_Retainability_Sharing") {
        if (srvListArr.indexOf(graphList[10]) == -1) {
          srvListArr.push(graphList[10]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "InitialEPSBEstabSR_Sharing") {
        if (srvListArr.indexOf(graphList[10]) == -1) {
          srvListArr.push(graphList[10]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "CellAvailability_Sharing") {
        if (srvListArr.indexOf(graphList[10]) == -1) {
          srvListArr.push(graphList[10]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_Sharing") {
        if (srvListArr.indexOf(graphList[11]) == -1) {
          srvListArr.push(graphList[11]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_DL_Sharing") {
        if (srvListArr.indexOf(graphList[11]) == -1) {
          srvListArr.push(graphList[11]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Traff_UL_Sharing") {
        if (srvListArr.indexOf(graphList[11]) == -1) {
          srvListArr.push(graphList[11]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Downlink_Thp_Sharing") {
        if (srvListArr.indexOf(graphList[11]) == -1) {
          srvListArr.push(graphList[11]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      } else if (srvList[j].data.id == "Uplink_Thp_Sharing") {
        if (srvListArr.indexOf(graphList[11]) == -1) {
          srvListArr.push(graphList[11]);
          srvListNameArr[srvListArr.length - 1] = [];
        }
        srvListNameArr[srvListArr.length - 1].push(srvList[j].data.text);
      }
    }

    Ext.Array.each(selReg, function(item, j) {
      if (renderType === "chart") {
        var intId,
          refsArr = [],
          request,
          title;
        chartSettings.legend = legend;
        chartSettings.titles = titles;
        chartSettings.xAxis = xAxisTip;
        chartSettings.pointInterval =
          refs.AgregationButton.items.items[
            refs.AgregationButton.getValue()
          ].chartPointInterval;
        chartSettings.aggr = aggregation;

        Ext.Array.each(srvListArr, function(item, i) {
          checkNameChart = srvListArr[i];
          if (titles) {
            title = srvListArr[i];
          }
          request = {
            srvData: [srvListArr],
            selGraf: item
          };
          selRegIdsArr = "'" + selReg[j].data.id + "'";
          refs.request = request;
          refsArr.push(request);
          curTab = pan.setActiveTab(pan.items.items[j]);
          chartPan = curTab.add(new Ext.Panel(panForChart));
          chart = Charts.getChart(
            srvListNameArr[i],
            chartPan,
            title,
            chartSettings,
            selRegIdsArr,
            item
          );
          highchart = new Highcharts.Chart(chart); // вот таким образом можно добавить кнопку в левый верхний угол
          /*var custombutton = highchart.renderer.button('btn', 10, 10, function() {
                        var sd = onShiftData.lookupReference('startDate')
                        console.log(sd);
                    }).add();*/ highchart.idPan = curTab.getTitle();
          chartPan.setLoading("Загрузка данных..");
          that.onUpdateChart(highchart, refs, selRegIdsArr, chartPan);
        });
      } else if (renderType === "table") {
        var grid,
          store,
          columns = [
            {
              text: "Managed_Object",
              dataIndex: "Managed_Object"
            },
            {
              text: "Stime",
              dataIndex: "STime"
            }
          ];
        Ext.Array.each(srvList, function(item, i) {
          if (item.data.leaf) {
            columns.push({
              text: item.data.id,
              dataIndex: item.data.id
            });
          }
        });
        curTab = pan.setActiveTab(pan.items.items[j]);
        curTab.setTitle(curTab.getTitle() + "_t");
        grid = curTab.add({
          xtype: "grid",
          columns: {
            defaults: {
              flex: 1,
              align: "center",
              filter: {
                type: "number",
                emptyText: "Введите номер..."
              }
            },
            items: columns
          }
        });
        (store = grid.getStore()),
          (store.getProxy().extraParams = {
            startDate: Ext.Date.format(
              refs.chartSettings.startDate,
              "Y-m-d H:i:s"
            ),
            endDate:
              Ext.Date.format(refs.chartSettings.endDate, "Y-m-d ") + nowDate,
            aggregation: aggregation,
            regList: selRegIdsArr
            //  srvType: srvList[0].inputValue.type
          });
        store.load();
      }
    });
  },
  onUpdateChart: function(highchart, refs, regListArr, chartPan) {
    Ext.Ajax.request({
      url: Global.getUrl("chart", "main"),
      method: "POST",
      timeout: 60000,
      params: {
        startDate: Ext.Date.format(refs.chartSettings.startDate, "Y-m-d H:i:s"),
        endDate: Ext.Date.format(refs.chartSettings.endDate, "Y-m-d H:i:s"),
        aggregation: refs.chartSettings.aggr,
        test: refs.request.selGraf,
        regList: regListArr
      },
      success: function(response, opts) {
        var resp = Ext.decode(response.responseText),
          points = resp.points,
          pointStart = resp.point_start * 1000,
          pointEnd = resp.point_end * 1000,
          dates = Date.parse(resp.dates);
        highchart.xAxis[0].update(
          {
            categories: false
          },
          false
        );
        highchart.xAxis[0].setCategories(dates);
        for (var i = 0; i < highchart.series.length; i++) {
          highchart.series[i].setData(points[i], false);
          highchart.series[i].update(
            {
              pointStart: pointStart
            },
            false
          );
          if (i === highchart.series.length - 1) {
            setTimeout(function() {
              highchart.redraw();
              chartPan.setLoading(false);
            }, 1000);
          }
        }
      }
    });
  },
  onCalculatePanelsSize: function(
    countchartsonpage,
    panelswidth,
    panelsheight
  ) {
    var countpanelscolumn = 1,
      countpanelsrows = 1;
    if (countchartsonpage > 1) {
      countpanelscolumn = Math.round(Math.log(countchartsonpage) / Math.log(2));
      countpanelsrows = Math.round(countchartsonpage / countpanelscolumn);
    }
    if (countpanelscolumn * countpanelsrows < countchartsonpage) {
      countpanelscolumn++;
    }
    var childpanelswidth = Math.round(panelswidth / countpanelscolumn) - 2,
      childpanelsheight = Math.round(panelsheight / countpanelsrows) - 2;
    return [
      childpanelswidth,
      childpanelsheight,
      countpanelscolumn,
      countpanelsrows
    ];
  },
  getDayInWeek: function(week, day, year) {
    console.log(week, day, year);
    var w = week || 1,
      n = day || 1,
      y = year || new Date().getFullYear(); //defaults
    var d = new Date(y, 0, 7 * w);
    d.setDate(d.getDate() - (d.getDay() || 7) + n);
    return d;
  }
});
