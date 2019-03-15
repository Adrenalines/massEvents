Ext.define('MassEvents.view.chart.mainChartPanController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.chart-mainchartpan',
    onShiftData: function(but) {
        var sd = this.lookupReference('startDate'),
            ed = this.lookupReference('endDate'),
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
        var periodbuttons = this.lookupReference('periodValues');

        periodbuttons.cascade(function(item) {
            if (item.isXType('button')) {
                item.setDisabled(true);
                if (button.inputValue.indexOf('[' + item.inputValue + ']') !== -1) {
                    item.setDisabled(false);
                }
                if (item.inputValue === button.defaultPeriod) {
                    item.setPressed(true);
                }
            }
        });
    },
    togglePeriodBut: function(segmented, button, isPressed) {
        var enddatefield = this.lookupReference('endDate'),
            startdatefield = this.lookupReference('startDate'),
            adddays = button.inputValue,
            dt = enddatefield.getValue(),
            dInt = 86400000 * Math.abs(adddays);
        startdatefield.setValue(new Date(new Date(dt) - dInt));
    },
    renderCharts: function(button) {
        var srvPan = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0],
            srvList = srvPan.getChecked(),
            moPan = Ext.ComponentQuery.query('checkboxgroup[reference=moTree]')[0],
            selReg = moPan.getChecked(),
            srvListNameArr = [],
            selRegIdsArr,
            srvListArr = [],
            refs = this.getReferences(),
            pan = this.getView(),
            panH = pan.getHeight() - 80,
            panW = pan.getWidth() - 19,
            that = this,
            chartPan, chart, highchart,
            countChartsOnScreen = Ext.ComponentQuery.query('#countChartBut')[0].getValue(),
            hintsType = Ext.ComponentQuery.query('radio[name=hints][checked=true]')[0].inputValue,
            renderType = Ext.ComponentQuery.query('radio[name=rbchartortable][checked=true]')[0].inputValue,
            tabType = Ext.ComponentQuery.query('radio[name=rbNeworCurrentTab][checked=true]')[0].inputValue,
            legend = Ext.ComponentQuery.query('checkbox[name=LegendsChartShowed][checked=true]')[0] === undefined ? false : true,
            target = Ext.ComponentQuery.query('checkbox[name=target][checked=true]')[0] === undefined ? false : true,
            onlyTarget = Ext.ComponentQuery.query('checkbox[name=onlyTarget][checked=true]')[0] === undefined ? false : true,
            xAxisTip = Ext.ComponentQuery.query('checkbox[name=xAxisLabelsShowed][checked=true]')[0] === undefined ? false : true,
            topIncShow = Ext.ComponentQuery.query('checkbox[name=topIncShowed][checked=true]')[0] === undefined ? false : true,
            aggregation = refs.AgregationButton.items.items[refs.AgregationButton.getValue()].text,
            nowDate = aggregation === 'Hourly' ? Ext.Date.format(new Date(), 'H') + ':00:00' : '00:00:00',
            chartSettings = {},
            indexTab, curTab,
            chartSizeObj = this.onCalculatePanelsSize(countChartsOnScreen, panW, panH),
            newTab,
            panForChart = {
                margin: '0 0 0 0',
                border: 5,
                width: chartSizeObj[0],
                height: chartSizeObj[1]
            };
        refs.chartSettings = {
            aggr: aggregation,
            startDate: aggregation === 'Weekly' ? that.getDayInWeek(Ext.Date.getWeekOfYear(refs.startDate.getValue(), 0, refs.startDate.getValue().getFullYear()), 1, refs.startDate.getValue().getFullYear()) : refs.startDate.getValue(),
            endDate: aggregation === 'Weekly' ? that.getDayInWeek(Ext.Date.getWeekOfYear(refs.endDate.getValue(), 0, refs.endDate.getValue().getFullYear()), 1, refs.endDate.getValue().getFullYear()) : refs.endDate.getValue()
        };
        Global.clearIntervals();
        if (tabType === 'currentTab') {
            curTab = pan.getActiveTab();
            pan.remove(curTab);
        }
        indexTab = pan.items.length + 1;
        topIncShow = aggregation === 'Hourly' ? topIncShow : false;
        if (renderType === 'chart') { // <-- в этом месте добавляется новая вкладка для дальшейшей отрисовки графиков
            newTab = pan.add(new Ext.Panel({
                title: indexTab, //+ '_' + srvPan.type,
                flex: 1,
                layout: {
                    type: 'table',
                    columns: chartSizeObj[2],
                    align: 'stretch'
                },
                closable: true,
                autoScroll: true
            }));
        } else if (renderType === 'table') {
            newTab = pan.add(new Ext.Panel({
                title: indexTab, //+ '_' + srvPan.type,
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                closable: true,
                autoScroll: true
            }));
        }
        curTab = pan.setActiveTab(newTab);
        Ext.Array.each(srvList, function(item) {
            //console.log(item);
            //srvListArr.push(item.inputValue.sName);
            srvListArr.push(item.data.id);
            srvListNameArr.push(item.data.text);
        });
        if (renderType === 'chart') {
            var intId, refsArr = [],
                request, title;
            chartSettings.tooltip = hintsType;
            chartSettings.legend = legend;
            chartSettings.xAxis = xAxisTip;
            chartSettings.pointInterval = refs.AgregationButton.items.items[refs.AgregationButton.getValue()].chartPointInterval;
            chartSettings.aggr = aggregation;

            Ext.Array.each(srvList, function(item, i) {

                checkNameChart = srvList[i].data.id;
                title = srvList[i].data.text;
                request = {
                    srvData: [srvListArr],
                    selGraf: item.data.id

                };
                selRegIdsArr = selReg[0].inputValue.Name;
                refs.request = request;
                refsArr.push(request);
                chartPan = curTab.add(new Ext.Panel(panForChart));

                if (checkNameChart == "first_chart") {
                    srvListNameArr = ["Объем данных на входе MD, Гбайт", "Объем данных на выходе MD, Гбайт"];
                } else if (checkNameChart == "second_chart" || checkNameChart == "third_chart") {
                    srvListNameArr = ["INPUT_BYTES_DISPLAY", "HRS"];
                } else if (checkNameChart == "fourth_chart") {
                    srvListNameArr = ["Ins_Upd_Del"];
                } else if (checkNameChart == "fifth_chart") {
                    srvListNameArr = ["ORADATA", "ORADATASSD", "ORADATAFAST"];
                } else if (checkNameChart == "six_chart") {
                    srvListNameArr = ["SIZE TB", "USEDSIZE TB"];
                }

                chart = Charts.getChart(srvListNameArr, chartPan, title, chartSettings, selRegIdsArr, item.data.id, false);


                /*    if (item.data.id == "third_chart") {


                        highchart = new Highcharts.Chart({
                            chart: {
                                type: 'spline',
                                zoomType: 'xy',
                                animation: true,
                                renderTo: chartPan.getEl().dom.firstChild, // запихиваем графики на уровень ниже из-за осоенностей фреймворка
                                //aggr: aggr,
                                //srv: srvName,
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                x: -20,
                                style: {
                                    fontSize: "12px",
                                    fontWeight: 'bold'
                                },
                                text: 'Время выполнения и размер DB FULL, Тбайт'
                            },
                            tooltip: {
                                xDateFormat: '%d-%m-%Y ',
                                shared: true,
                                crosshairs: true,
                                headerFormat: '<span style="font-size: 8px">{point.key}</span><br/>',
                                borderWidth: 1,
                                shadow: false,
                                style: {
                                    wordWrap: "break-word",
                                    width: 0,
                                    fontSize: '0.8em'
                                }
                            },
                            xAxis: {
                                tickInterval: 24 * 3600 * 1000,
                                type: 'datetime',
                                visible: false,
                                labels: {
                                    style: {
                                        fontFamily: 'Tahoma'
                                    },
                                    rotation: -45
                                }
                            },
                            yAxis: [{
                                labels: { format: '{value} TB' },
                                title: { text: 'TB' }
                            }, {
                                labels: { format: '{value} HRs' },
                                title: { text: 'HRs' },
                                opposite: true
                            }],
                            exporting: {
                                buttons: {
                                    contextButton: {
                                        menuItems: [{
                                            text: 'jpeg',
                                            onclick: function() {
                                                this.exportChart({ type: 'image/jpeg' });
                                            }
                                        }, {
                                            text: 'png',
                                            onclick: function() {
                                                this.exportChart({ type: 'image/png' });
                                            }
                                        }, {
                                            text: 'pdf',
                                            onclick: function() {
                                                this.exportChart({ type: 'application/pdf' });
                                            }
                                        }, {
                                            text: 'xls',
                                            onclick: function() {
                                                var titleforexcel = this.title.textStr;

                                                var itemDelimiter = ';',
                                                    lineDelimiter = '\n';
                                                var rows = [],
                                                    i = 0,
                                                    j, row, date;
                                                rows[0] = ['Дата'];

                                                Ext.Array.each(this.series, function(item, i) {

                                                    if (item.type !== 'column')
                                                        rows[0].push(item.name);
                                                    Ext.Array.each(item.data, function(data, j) {
                                                        j = j + 1;
                                                        if (typeof(rows[j]) === "undefined") {
                                                            rows[j] = [];
                                                        }
                                                        if (i === 0) {
                                                            switch (aggr) {
                                                                case 'Hourly':
                                                                    date = Ext.Date.format(new Date(data.category - 10800000), 'Y-m-d H:i:s');
                                                                    break;
                                                                case 'Daily':
                                                                    date = Ext.Date.format(new Date(data.category), 'Y-m-d ');
                                                                    break;
                                                                default:
                                                                    date = data.category;
                                                                    break;
                                                            }
                                                            rows[j].push(date);
                                                        }
                                                        rows[j].push(String(data.y));
                                                    });
                                                });
                                                j = rows.length;
                                                rows[0] = rows[0].join(itemDelimiter);
                                                for (row = 1; row < j; row++) {
                                                    rows[row] = rows[row].join(itemDelimiter);
                                                }
                                                rows = rows.join(lineDelimiter);
                                                Ext.Ajax.request({
                                                    url: '/resources/phpcommon/export_chart_txt.php',
                                                    method: 'POST',
                                                    params: { csv: rows },
                                                    success: function(response, options) {
                                                        var paramsWin = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=0,height=0,left=-1000,top=-1000';
                                                        var doc = window.open('/resources/phpcommon/export_chart_xls.php?titletxt=' + response.responseText + '&title=' + titleforexcel, '_self');
                                                        doc.document.close();
                                                    },
                                                    failure: function(response, options) {
                                                        alert('Error with download excel.');
                                                    }
                                                });
                                            }
                                        }]
                                    }
                                }
                            },
                            series: [{
                                name: "INPUT_BYTES_DISPLAY",
                                type: 'spline',
                                marker: { radius: 1.2, symbol: 'circle' },
                                color: "#3333FF",
                                data: []
                            }, {
                                name: "HRS",
                                yAxis: 1,
                                type: 'spline',
                                marker: { radius: 1.2, symbol: 'circle' },
                                color: "#666600",
                                data: []
                            }]
                        });

                        highchart.idPan = curTab.getTitle();
                        chartPan.setLoading('Загрузка данных..');
                        that.onUpdateChartNew(highchart, refs, selRegIdsArr, true, false, chartPan);

                    } else {*/

                highchart = new Highcharts.Chart(chart);

                /*var custombutton = highchart.renderer.button('btn', 10, 10, function() {
                    var sd = onShiftData.lookupReference('startDate')
                    console.log(sd);
                }).add();*/ // вот таким образом можно добавить кнопку в левый верхний угол 


                highchart.idPan = curTab.getTitle();
                chartPan.setLoading('Загрузка данных..');
                that.onUpdateChart(highchart, refs, selRegIdsArr, true, false, chartPan);
                //console.log('вкладка созда1на ' + new Date());

                //  }
            });


            //777777777
            chartPan = curTab.add(new Ext.Panel({

                margin: '0 0 0 0',
                border: 0,
                layout: 'fit',
                width: chartSizeObj[0],
                height: chartSizeObj[1],
                items: [{
                    layout: 'card',
                    id: 'myTestCardLayout',
                    activeItem: 0, // index or id
                    // bbar: ['->', {
                    //     id: 'card-prev',
                    //     text: '&laquo; Previous',

                    // },{
                    //     id: 'card-next',
                    //     text: 'Next &raquo;',
                    //     handler: function(but){
                    //         var panel = button.up('panel');

                    //         panel.layout.setActiveItem(1);
                    //     }
                    // }],
                    items: [{
                        id: 'card-0',
                        //html: 'Step 1'
                        html: '<div><h1>1</h1></div>'
                    }, {
                        id: 'card-1',
                        html: 'Step 2'
                    }, {
                        id: 'card-2',
                        html: 'Step 3'
                    }],

                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [{
                            text: '<- Go to prev',
                            handler: function(button) {
                                //console.log(button);
                                //var panel = button.up('panel');
                                //panel.layout.setActiveItem(0);
                                var layout = button.up('panel').getLayout();
                                if (layout.getPrev()) {
                                    layout.prev();
                                }
                            }
                        }, '->', {
                            text: 'Go to next ->',
                            handler: function(button) {
                                //var panel = button.up('panel');
                                var layout = button.up('panel').getLayout();
                                if (layout.getNext()) {
                                    layout.next();
                                }
                                //panel.layout.setActiveItem(1);
                            }
                        }]
                    }]
                }]

            }));




        } else if (renderType === 'table') {
            var grid, store,
                columns = [{
                    align: 'left',
                    text: 'Дата',
                    dataIndex: 'DATE'
                }, {
                    align: 'left',
                    text: 'Регион',
                    dataIndex: 'REGION',
                    filter: {
                        type: 'string',
                        emptyText: 'Введите регион...'
                    }
                }];
            Ext.Array.each(srvList, function(item, i) {
                if (target) {
                    if (item.inputValue.target) {
                        columns.push({
                            text: item.boxLabel,
                            dataIndex: 'DATA0'
                        });
                        columns.push({
                            text: item.boxLabel + ', Целевое',
                            dataIndex: 'DATA1'
                        });
                        columns.push({
                            text: item.boxLabel + ', Допустимое',
                            dataIndex: 'DATA2'
                        });
                    }
                } else {
                    columns.push({
                        text: item.boxLabel,
                        dataIndex: item.data.id
                    });
                }
            });
            curTab.setTitle(curTab.getTitle() + '_t');
            grid = curTab.add({
                xtype: 'gridInc',
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center',
                        filter: {
                            type: 'number',
                            emptyText: 'Введите номер...'
                        }
                    },
                    items: columns
                }
            });
            store = grid.getStore(),
                store.getProxy().extraParams = {
                    startDate: Ext.Date.format(refs.chartSettings.startDate, 'Y-m-d H:i:s'),
                    endDate: Ext.Date.format(refs.chartSettings.endDate, 'Y-m-d ') + nowDate,
                    aggregation: aggregation,
                    regList: [selRegIdsArr],
                    srvType: srvList[0].inputValue.type,
                    target: target
                };
            store.load();
        }
    },
    onUpdateChart: function(highchart, refs, regListArr, start, target, chartPan) {
        var type = target ? 'target' : 'main';
        twolines = "BEFORE_MEDIATION,AFTER_MEDIATION";
        Ext.Ajax.request({
            url: Global.getUrl('chart', type),
            method: 'POST',
            timeout: 60000,
            params: {
                startDate: Ext.Date.format(refs.chartSettings.startDate, 'Y-m-d H:i:s'),
                endDate: Ext.Date.format(refs.chartSettings.endDate, 'Y-m-d H:i:s'),
                aggregation: refs.chartSettings.aggr,
                srv: twolines,
                test: refs.request.selGraf,
                regList: [regListArr],
                countKpi: 1
            },
            success: function(response, opts) {

                var resp = Ext.decode(response.responseText),
                    points = resp.points,
                    pointStart = resp.point_start * 1000,
                    pointEnd = resp.point_end * 1000,
                    dates = resp.dates;

                highchart.xAxis[0].update({
                    categories: refs.chartSettings.aggr === 'Weekly' || refs.chartSettings.aggr === 'Monthly' ? dates : false
                }, false);

                for (var i = 0; i < highchart.series.length; i++) {
                    highchart.xAxis[0].setCategories(dates);
                    highchart.series[i].setData(points[i], false);
                    highchart.series[i].update({
                        pointStart: refs.chartSettings.aggr === 'Weekly' || refs.chartSettings.aggr === 'Monthly' ? 0 : pointStart
                    }, false);
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

    onUpdateChartNew: function(highchart, refs, regListArr, start, target, chartPan) {

        var type = target ? 'target' : 'main';

        Ext.Ajax.request({


            //url: './data/megachart.php',
            url: Global.getUrl('chart', type),
            method: 'POST',
            timeout: 60000,
            params: {
                startDate: Ext.Date.format(refs.chartSettings.startDate, 'Y-m-d H:i:s'),
                endDate: Ext.Date.format(refs.chartSettings.endDate, 'Y-m-d H:i:s'),
                test: refs.request.selGraf
            },

            success: function(response, opts) {
                var resp = Ext.decode(response.responseText),

                    import_data0 = resp.import_data0;
                import_data1 = resp.import_data1;
                console.log(refs.chartSettings.startDate);

                highchart.series[0].setData(import_data0, false);
                highchart.series[1].setData(import_data1, false);

                setTimeout(function() {
                    highchart.redraw();
                    chartPan.setLoading(false);
                }, 1000);
            }
        });
    },

    onCalculatePanelsSize: function(countchartsonpage, panelswidth, panelsheight) {
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
        return [childpanelswidth, childpanelsheight, countpanelscolumn, countpanelsrows];
    },
    getDayInWeek: function(week, day, year) {
        console.log(week, day, year);
        var w = week || 1,
            n = day || 1,
            y = year || new Date().getFullYear(); //defaults
        var d = new Date(y, 0, 7 * w);
        d.setDate(d.getDate() - (d.getDay() || 7) + n);
        return d
    }
});