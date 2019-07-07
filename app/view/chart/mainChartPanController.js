Ext.define("MassEvents.view.chart.mainChartPanController", {
  extend: "Ext.app.ViewController",
  alias: "controller.chart-mainchartpan",

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
        refs.AggregationButton.items.items[refs.AggregationButton.getValue()]
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
          refs.AggregationButton.items.items[
            refs.AggregationButton.getValue()
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
