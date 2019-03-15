Ext.define('Charts', {
    singleton: true,
    colors: ['#3333FF', '#666600', '#990033', '#990099', '#FF0000', '#CCCC00', '#FF9999', '#99CCFF', '#FF9900', '#663333', '#336633',
        '#66FFCC', '#FF6600', '#333333', '#99CCCC', '#CC6600', '#FF00CC', '#333300', '#33CCCC', '#9966CC', '#00FFFF', '#99FFCC', '#336666',
        '#990066', '#666666', '#660066', '#9999CC', '#660066', '#33FF33', '#CC9999', '#660033', '#0099CC', '#CC0066', '#006699', '#663366'
    ],
    getRandomColor: function(number) {
        var color,
            colorSet = this.colors;
        color = colorSet[number];
        return color;
    },
    getTargetSerieColor: function(name, num) {
        //          console.log(name, num);
        var color;
        switch (num) {
            case 0:
                color = 'yellow'
                break;
            case 1:
                color = 'red'
                break;

        }
        return color;
    },
    getSerieColor: function(name, num, target) {
        var color;
        switch (name) {
            case 'Дальний Восток':
                color = '#00FFFE'
                break;
            case 'Поволжье':
                color = '#009900'
                break;
            case 'Северо-Запад':
                color = '#DE8400'
                break;
            case 'Урал':
                color = '#FF33CC'
                break;
            case 'Юг':
                color = '#38EA00'
                break;
            case 'Сибирь':
                color = '#9F8AB8'
                break;
            case 'Центр':
                color = '#FF0000'
                break;
            case 'Москва и Московская область':
                color = '#0000FF'
                break;
            case 'БЕР':
                color = '#CC3300'
                break;
            case 'Стратегический':
                color = '#0000FF'
                break;
            case 'Стабильный':
                color = '#00FFFE'
                break;
            case 'Сильный':
                color = '#38EA00'
                break;
            case 'Регионы роста':
                color = '#FF33CC'
                break;
            case 'Паритетный лидер':
                color = '#FF0000'
                break;
            default:
                color = this.getRandomColor(num);
        }
        if (target) {
            color = '#0000FF';
        }
        return color;
    },
    getKpiChart: function(chartPan, reg, aggr, srvName, target) {
        return {
            chart: {
                zoomType: 'xy',
                animation: true,
                renderTo: chartPan.getEl().dom.firstChild, // запихиваем графики на уровень ниже из-за осоенностей фреймворка
                aggr: aggr,
                srv: srvName,
                //                    backgroundColor: target ? "green" : "#FFFFFF"
            },
            credits: {
                //                    text: 'Портал ДПиОС ЕЦУС',
                //                    href: '/allmodules/',
                //                    position: {
                //                         align: 'left',
                //                         x: 10
                //                    }
                enabled: false
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            title: {
                x: -20,
                style: {
                    fontSize: "12px",
                    fontWeight: 'bold'
                },
                text: reg
            },
            labels: {},
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [{
                                text: 'jpeg',
                                onclick: function() {
                                    this.exportChart({ type: 'image/jpeg' });
                                }
                            },
                            {
                                text: 'png',
                                onclick: function() {
                                    this.exportChart({ type: 'image/png' });
                                }
                            },
                            {
                                text: 'pdf',
                                onclick: function() {
                                    this.exportChart({ type: 'application/pdf' });
                                }
                            },
                            {
                                text: 'xls',
                                onclick: function() {
                                    var titleforexcel = this.title.textStr;

                                    var itemDelimiter = ';',
                                        lineDelimiter = '\n';
                                    var rows = [],
                                        i = 0,
                                        j, row, date;
                                    rows[0] = ['Дата'];
                                    //                                             rows[0][0] = "Регион";
                                    //                                             rows[0][1] = 'test1';
                                    //                                             rows[0][2] = "Проценты";
                                    //                                             console.log(this, rows);
                                    //                                             console.log(this.series[0].data);
                                    //                                             rows[0][0]='Дата'
                                    Ext.Array.each(this.series, function(item, i) {
                                        //                                                  console.log(item);
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
                                    //                                             console.log(rows, j);
                                    //                                             for (chart in this.series[0].points) {
                                    //                                                  if (typeof (rows[i]) === "undefined") {
                                    //                                                       rows[i] = [];
                                    //                                                  }
                                    //                                                  rows[i][0] = this.series[0].points[chart].name;
                                    //                                                  rows[i][1] = this.series[0].points[chart].y;
                                    //                                                  rows[i][2] = this.series[0].points[chart].percentage;
                                    //                                                  i++;
                                    //                                             }
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
                            }
                        ]
                    }
                }
            },
            series: []
        };
    },
    getXAxis: function(visible, target) {
        var result = [];
        result = [{
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e. %b'
            },
            visible: target ? true : visible,
            tickPixelInterval: 120
        }];
        return result;
    },
    getYaxis: function() {
        var result = [];
        result = [{
            gridLineColor: '#B7BFDA',
            gridLineDashStyle: 'Dash',
            title: {
                text: null
            },
            min: null,
            //                    min: 0,
            //                    plotLines: [{
            //                              value: 0,
            //                              width: 1,
            //                              color: '#808080'
            //                         }],
            lineWidth: 1
        }];
        return result;
    },
    getPlotOptions: function(pointInterval) {
        var result = [],
            series;
        switch (pointInterval) {
            case 24 * 7 * 4:
            case 24 * 7:
                series = {
                    //                         pointIntervalUnit: 'month'
                };
                break;
            default:
                series = {
                    pointInterval: 60 * 60 * 1000 * pointInterval
                };
                break;
        };
        result = {
            areaspline: {
                lineWidth: 1.2,
                marker: {
                    symbol: 'circle',
                    radius: 2.5
                }
            },
            spline: {
                lineWidth: 2,
                marker: {
                    symbol: 'circle',
                    radius: 2.5
                }
            },
            column: {
                stacking: 'normal',
                grouping: false,
                shadow: true,
                pointPadding: -0.2
            },
            series: series
        };
        return result;
    },
    getSeries: function(nameRegList, idsRegList, aggr, target) {
        var result = [],
            that = this,
            targetArr = ['Целевое значение', 'Допустимое значение'];
        Ext.Array.each(nameRegList, function(item, i) {
            var srv = item,
                serie;
            serie = {
                type: 'spline',
                marker: {
                    //                              enabled: false,
                    radius: 1.2,
                    symbol: 'circle'
                },
                animation: false,
                color: that.getSerieColor(item, i, target),
                name: srv,
                regionId: idsRegList[i],
                tooltip: {
                    //                         valueSuffix: ' Шт.'
                },
                yAxis: 0,
                zIndex: 100,
                data: [],
                events: {
                    click: function(event) {
                        var that = this,
                            time = aggr === 'Weekly' || aggr === 'Monthly' ? event.point.category : event.point.x / 1000,
                            timeTitle = aggr === 'Weekly' || aggr === 'Monthly' ? event.point.category : Ext.Date.format(new Date(event.point.x), 'Y-m-d'),
                            srv = that.chart.options.chart.srv;
                        if ((aggr === 'Daily') & (srv === 'S_DOWNTIME_SUM')) {
                            Ext.create('Ext.window.Window', {
                                width: 1280,
                                height: 720,
                                border: false,
                                modal: true,
                                closable: false,
                                title: 'Топ инцидентов по региону ' + that.name + ' за ' + timeTitle + '. Суммарное время простоя в часах - ' + event.point.y,
                                paramsForReg: {
                                    aggr: aggr,
                                    regId: that.options.regionId,
                                    time: time,
                                    downtime: event.point.y
                                },
                                layout: {
                                    type: 'fit'
                                },
                                items: [{
                                    xtype: 'incidents',
                                    buttons: [{
                                            text: 'Открыть в Remedy',
                                            listeners: {
                                                click: function() {
                                                    var grid = Ext.ComponentQuery.query('grid[reference=incidentList]')[0],
                                                        incNum = grid.getSelection()[0].data.REQUEST_ID;
                                                    //                                                                           console.log(grid.getSelection());
                                                    window.open("http://remedy.msk.mts.ru/arsys/forms/remedy-prom/I2%3AIncidents/Default+Administrator+View/?eid=" + incNum);

                                                }
                                            }
                                        },
                                        {
                                            text: 'Выход',
                                            listeners: {
                                                click: function() {
                                                    this.up('window').close();
                                                }
                                            }
                                        }
                                    ]
                                }]
                            }).show();
                        }
                    }
                }
            };
            result.push(serie);
            if (target) {
                Ext.Array.each(targetArr, function(item, i) {
                    //                         console.log(item, i);
                    result.push({
                        type: 'area',
                        marker: {
                            enabled: false,
                            //                         radius: 0,
                            //                         symbol: 'circle'
                        },
                        animation: false,
                        color: that.getTargetSerieColor(item, i),
                        name: item,
                        yAxis: 0,
                        showInLegend: false,
                        data: [],
                        zIndex: i
                    });
                });
            }
        });
        return result;
    },
    getTooltip: function(tipType, target) {
        var tooltip, shared = true,
            enabled = true;
        switch (tipType) {
            case 'noshared':
                shared = false;
                break;
            case 'disabled':
                enabled = false;
                break;
        }
        tooltip = {
            xDateFormat: '%d-%m-%Y ',
            shared: target ? false : shared,
            enabled: enabled,
            crosshairs: { width: 2 },
            headerFormat: '<span style="font-size: 8px">{point.key}</span><br/>',
            //                    pointFormat: '{point.name}',
            //               shape: 'square',
            borderWidth: 1,
            shadow: false,
            style: {
                wordWrap: "break-word",
                width: 0,
                fontSize: '0.8em'
            }
            //               formatter: function(){
            //                    console.log(this);
            //               }
        };
        return tooltip;
    },
    getLegend: function(enabled) {
        var legend;
        legend = {
            enabled: enabled,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0,
            itemStyle: {
                fontWeight: 'normal'
            }
        };
        return legend;
    },
    getChart: function(nameRegList, chartPan, reg, chartSettings, idsRegList, srvName, target) {
        var chart = this.getKpiChart(chartPan, reg, chartSettings.aggr, srvName, target);
        //          chart.colors = this.getColorsForTech(kpi);
        //          chart.colors = this.getChartColors();
        chart.xAxis = this.getXAxis(chartSettings.xAxis, target);
        chart.yAxis = this.getYaxis();
        chart.plotOptions = this.getPlotOptions(chartSettings.pointInterval);
        chart.series = this.getSeries(nameRegList, idsRegList, chartSettings.aggr, target);
        chart.tooltip = this.getTooltip(chartSettings.tooltip, target);
        chart.legend = this.getLegend(chartSettings.legend);
        return chart;
    },
    getColorsForTech: function(kpi) {
        var colors;
        switch (kpi) {
            case '2G':
            case '2G_CORE':
                colors = ['#99FFCC', '#006633', '#33CC99', '#009933', '#CC33FF', '#FF3300', '#FF9966'];
                break;
            case '3G':
            case '3G_CORE':
                colors = ['#99FFFF', '#0066CC', '#33CCFF', '#0000FF', '#CC33FF', '#FF3300', '#FF9966'];
                break;
            case '4G':
            case '4G_CORE':
                colors = ['#FFCCFF', '#CC66CC', '#6699FF', '#FF66FF', '#CC33FF', '#FF3300', '#FF9966'];
                break;
        }
        return colors;
    }
});