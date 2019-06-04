var startDate = Ext.create('Ext.form.DateField', {
    name: 'startDate',
    xtype: 'datefield',
    format: 'd/m/Y',
    endDateField: 'enddt', // id of the end date field
    listeners: {
        render: function(datefield) {
            /// code to convert GMT String to date object
            datefield.setValue(new Date());
        }
    }
});

var endDate = Ext.create('Ext.form.DateField', {
    name: 'endDate',
    xtype: 'datefield',
    format: 'd/m/Y',
    endDateField: 'enddt', // id of the end date field
    listeners: {
        render: function(datefield) {
            /// code to convert GMT String to date object
            datefield.setValue(new Date());
        }
    }
});



Ext.define('MassEvents.view.chart.toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'chartTbar',
    dock: 'top',
    ui: 'top',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        name: 'topTrees',
        xtype: 'panel',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            name: 'DateValuesPanel',
            tbar: [{
                xtype: 'label',
                text: 'Период',
                padding: '5 0 5 5',
                style: {
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: 'dimGray'
                }
            }],
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                padding: 10
            },
            items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'button',
                        margin: '7 0 0 2'
                    },
                    items: [{
                            icon: 'resources/images/home-icon.png',
                            iconCls: 'background-size-contain',
                            tooltip: 'На главную страницу портала',
                            margin: '7 3 0 0',
                            handler: function() {
                                window.open('/');
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'StartDateLabel',
                            value: 'Дата с:'
                        },
                        {
                            reference: 'startDate',
                            xtype: 'datefield',
                            format: 'Y-m-d H:00',
                            submitFormat: 'Y-m-d H:00',
                            startDay: 1,
                            //  value: new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0),
                            //  minValue: new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0),
                            //  maxValue: new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0),
                            grow: true,
                            editable: true,
                            listeners: {
                                render: function(datefield) {
                                    var minDate, maxDate;
                                    Ext.Ajax.request({
                                        url: Global.getUrl('load', 'minDate'),
                                        method: 'POST',
                                        timeout: 60000,
                                        success: function(response, opts) {
                                            var resp = Ext.decode(response.responseText);
                                            minDate = resp.data[0].Stime.substring(0, 16);
                                            Ext.Ajax.request({
                                                url: Global.getUrl('load', 'maxDate'),
                                                method: 'POST',
                                                timeout: 60000,
                                                success: function(response, opts) {
                                                    var resp = Ext.decode(response.responseText);
                                                    maxDate = resp.data[0].Stime.substring(0, 16);
                                                    datefield.setValue(new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0));
                                                    datefield.setMinValue(new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0));
                                                    datefield.setMaxValue(new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0));
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'EndDateLabel',
                            value: 'по:'
                        },
                        {
                            reference: 'endDate',
                            xtype: 'datefield',
                            format: 'Y-m-d H:00',
                            submitFormat: 'Y-m-d H:00',
                            startDay: 1,
                            //    value: new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0),
                            //    minValue: new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0),
                            //   maxValue: new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0),
                            grow: true,
                            editable: true,
                            listeners: {
                                render: function(datefield) {
                                    var minDate, maxDate;
                                    Ext.Ajax.request({
                                        url: Global.getUrl('load', 'minDate'),
                                        method: 'POST',
                                        timeout: 60000,
                                        success: function(response, opts) {
                                            var resp = Ext.decode(response.responseText);
                                            minDate = resp.data[0].Stime.substring(0, 16);
                                            Ext.Ajax.request({
                                                url: Global.getUrl('load', 'maxDate'),
                                                method: 'POST',
                                                timeout: 60000,
                                                success: function(response, opts) {
                                                    var resp = Ext.decode(response.responseText);
                                                    maxDate = resp.data[0].Stime.substring(0, 16);
                                                    datefield.setValue(new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0));
                                                    datefield.setMinValue(new Date(minDate.substring(0, 4), minDate.substring(5, 7) - 1, minDate.substring(8, 10), minDate.substring(11, 13), 0, 0, 0));
                                                    datefield.setMaxValue(new Date(maxDate.substring(0, 4), maxDate.substring(5, 7) - 1, maxDate.substring(8, 10), maxDate.substring(11, 13), 0, 0, 0));
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            value: 'Сдвиг(дн.)'
                        },
                        {
                            reference: 'shiftDatesUp',
                            text: '<',
                            inputValue: -1,
                            tooltip: 'Сдвигает дату на 1 день назад',
                            margin: '7 0 0 2',
                            handler: 'onShiftData'
                        },
                        {
                            reference: 'shiftDatesDown',
                            text: '>',
                            inputValue: 1,
                            tooltip: 'Сдвигает дату на 1 день вперед',
                            margin: '7 0 0 0',
                            handler: 'onShiftData'
                        },
                        {
                            xtype: 'label',
                            margin: '11 0 0 4',
                            text: 'Агрегация:'
                        },
                        {
                            reference: 'AgregationButton',
                            xtype: 'segmentedbutton',
                            items: [{
                                    text: 'Hourly',
                                    inputValue: '[-0.041], [-0.125], [-0.25], [-0.5], [-0.75], [-1], [-2], [-3], [-4], [-5]',
                                    defaultPeriod: '-0.041',
                                    chartPointInterval: 1,
                                    pressed: true
                                },
                                {
                                    text: 'Daily',
                                    inputValue: '[-1], [-2], [-3], [-4], [-5]',
                                    defaultPeriod: '-1',
                                    chartPointInterval: 1,
                                }
                            ],
                            listeners: {
                                toggle: 'toggleBut'
                            }
                        },
                        {
                            xtype: 'label',
                            reference: 'periodValuesLabel',
                            margin: '11 0 0 5',
                            html: 'Период:'
                        },
                        {
                            xtype: 'segmentedbutton',
                            reference: 'periodValues',
                            defaults: {
                                disabled: true
                            },
                            items: [
                                { text: '1h', inputValue: '-0.041', disabled: false, pressed: true },
                                { text: '3h', inputValue: '-0.125', disabled: false },
                                { text: '6h', inputValue: '-0.25', disabled: false },
                                { text: '12h', inputValue: '-0.5', disabled: false },
                                { text: '18h', inputValue: '-0.75', disabled: false },
                                { text: '1d', inputValue: '-1', disabled: false },
                                { text: '2d', inputValue: '-2', disabled: false },
                                { text: '3d', inputValue: '-3', disabled: false },
                                { text: '4d', inputValue: '-4', disabled: false },
                                { text: '5d', inputValue: '-5', disabled: false }
                            ],
                            listeners: {
                                toggle: 'togglePeriodBut'
                            }
                        }
                    ]
                },
                {
                    text: 'Показать',
                    reference: 'DisplayDataButton',
                    icon: 'resources/images/chart_stock.png',
                    iconCls: 'background-size-contain',
                    margin: '5 0 0 0',
                    padding: '10 5 10 5',
                    border: 2,
                    style: {
                        borderColor: 'red',
                        borderStyle: 'dotted'
                    },
                    listeners: {
                        click: 'renderCharts'
                    }
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    name: 'HelpMenu',
                    text: 'Справка',
                    margin: '6 5 0 3',
                    padding: '10 5 10 5',
                    iconCls: 'background-size-contain',
                    icon: 'resources/images/help.png',
                    //   link: '/Help_doc_web/availreg/Help_availReg.docx',
                    //    handler: function(but) {
                    //        window.open(but.link);
                    //    }
                }
            ]
        }]
    }]

});