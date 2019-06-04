Ext.define('Charts', {
    singleton: true,
    colors: ['#009900', '#000099', '#FF3333', '#006699', '#FFCCCC', '#CCCC00', '#00CCCC', '#99CCFF', '#FF9900', '#663333', '#336633',
        '#66FFCC', '#FF6600', '#333333', '#99CCCC', '#CC6600', '#FF00CC', '#333300', '#33CCCC', '#9966CC', '#00FFFF', '#99FFCC', '#336666',
        '#990066', '#666666', '#660066', '#9999CC', '#660066', '#33FF33', '#CC9999', '#660033', '#0099CC', '#CC0066', '#006699', '#663366'
    ],
    getRandomColor: function(number) {
        var color,
            colorSet = this.colors;
        color = colorSet[number];
        return color;
    },
    getKpiChart: function(chartPan, reg, aggr, srvName) {
        return {
            chart: {
                zoomType: 'xy',
                animation: true,
                renderTo: chartPan.getEl().dom.firstChild, // запихиваем графики на уровень ниже из-за особенностей фреймворка
                aggr: aggr,
                srv: srvName
            },
            credits: {
                enabled: false
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
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
                            }
                        ]
                    }
                }
            },
            series: []
        };
    },
    getXAxis: function(visible) {
        var result = [];
        result = [{
            categories: [],
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e. %b'
            },
            visible: visible,
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
                series = {};
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
    getSeries: function(nameRegList, idsRegList, aggr) {
        var result = [],
            that = this;
        Ext.Array.each(nameRegList, function(item, i) {
            if ((nameRegList[i] == 'Трафик на каналах TCH, Эрл') ||
                (nameRegList[i] == 'Трафик на каналах SDCCH, Эрл') ||
                (nameRegList[i] == 'Процент обрывов соединений (DCR)') ||
                (nameRegList[i] == 'Traff_Sp, Erl') ||
                (nameRegList[i] == 'Drop_Data') ||
                (nameRegList[i] == 'Block_Data') ||
                (nameRegList[i] == 'HSDPA_USER_DC_THR, Kbit/s') ||
                (nameRegList[i] == 'HSUPA_USER_THR, Kbit/s') ||
                (nameRegList[i] == 'DpH_UE') ||
                (nameRegList[i] == 'UE_Throughput_DL, Kbit/s') ||
                (nameRegList[i] == 'UE_Throughput_UL, Kbit/s') ||
                (nameRegList[i] == 'LTE_User_Max') ||
                (nameRegList[i] == 'Cell_Count_4G') ||
                (nameRegList[i] == 'Traff_VoLTE') ||
                (nameRegList[i] == 'E-RAB Retainability_Sharing') ||
                (nameRegList[i] == 'Downlink Thp_Sharing') ||
                (nameRegList[i] == 'Uplink Thp_Sharing')) {
                s = 1;
            } else {
                s = 0;
            }
            var srv = item,
                serie;
            serie = {
                type: 'spline',
                marker: {
                    radius: 1.2,
                    symbol: 'circle'
                },
                animation: false,
                color: that.getRandomColor(i),
                name: srv,
                regionId: idsRegList[i],
                yAxis: s,
                zIndex: 100,
                data: []

            };
            result.push(serie);
        });
        return result;
    },
    getTooltip: function(tipType) {
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
            xDateFormat: '%d-%m-%Y %H:%M',
            shared: shared,
            enabled: enabled,
            crosshairs: { width: 2 },
            headerFormat: '<span style="font-size: 8px">{point.key}</span><br/>',
            borderWidth: 1,
            shadow: false,
            style: {
                wordWrap: "break-word",
                width: 0,
                fontSize: '0.8em'
            }
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
    getTitle: function(enabled, reg) {
        var title;
        title = {
            enabled: enabled,
            text: reg,
            y: 15,
            style: {
                fontWeight: 'bold',
                fontSize: '14px'
            }
        };
        return title;
    },
    getChart: function(nameRegList, chartPan, reg, chartSettings, idsRegList, srvName) {
        var chart = this.getKpiChart(chartPan, reg, chartSettings.aggr, srvName);
        chart.xAxis = this.getXAxis(chartSettings.xAxis);
        if (srvName == '2G Traffic, CSSR, Availability') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'CSSR, BSS_Availability_Rate' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'Трафик на каналах TCH, SDCCH' },
                opposite: true
            }];
        } else if (srvName == '2G DCR, BCR') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'BCR_серв., Процент блокировок на SDCCH' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'DCR' },
                opposite: true
            }];
        } else if (srvName == '3G SP') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'CSSR_Sp, Drop_Sp, Block_Sp, RAN_Availability' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'Traff_Sp' },
                opposite: true
            }];
        } else if (srvName == '3G Data') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'CSSR_Data' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'Drop_Data, Block_Data' },
                opposite: true
            }];
        } else if (srvName == '3G Data Traffic, THR') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'Traff_Data, KB' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'THR, Kbit/s' },
                opposite: true
            }];
        } else if (srvName == '4G DPH_UE, CSSR_LTE') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'CSSR_LTE, LTE_RAN_Avail' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'DpH_UE' },
                opposite: true
            }];
        } else if (srvName == '4G Traffic, Thr, User_Max') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'Traff_Data, KB' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'UE_Thr, LTE_User_Max, CELL_Count_4G' },
                opposite: true
            }];
        } else if (srvName == '4G VoLTE') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'CSSR_VoLTE, DpH_VoLTE_UE' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'Traff_VoLTE' },
                opposite: true
            }];
        } else if (srvName == '4G Sharing') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'InitialEPSBEstabSR_Sharing, CellAvailability_Sharing' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'E-RAB Retainability_Sharing' },
                opposite: true
            }];
        } else if (srvName == '4G Sharing Traffic, Thp') {
            chart.yAxis = [{
                labels: { format: '{value}' },
                title: { text: 'Traff_Sharing' }
            }, {
                labels: { format: '{value}' },
                title: { text: 'Thp_Sharing' },
                opposite: true
            }];
        } else {
            chart.yAxis = this.getYaxis();
        }
        chart.plotOptions = this.getPlotOptions(chartSettings.pointInterval);
        chart.series = this.getSeries(nameRegList, idsRegList, chartSettings.aggr);
        chart.tooltip = this.getTooltip(chartSettings.tooltip);
        chart.legend = this.getLegend(chartSettings.legend);
        chart.title = this.getTitle(chartSettings.titles, reg);
        return chart;
    }
});