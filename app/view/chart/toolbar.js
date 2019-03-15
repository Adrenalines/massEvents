Ext.define('MassEvents.view.chart.toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'chartTbar',
    dock: 'top',
    ui: 'top',
    fit: 1,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'panel',
        name: 'DateValuesPanel',
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
                    margin: '7 0 0 10'
                },
                items: [{
                        icon: 'resources/images/home-icon.png',
                        iconCls: 'background-size-contain',
                        tooltip: 'На гланый портал ДПиОС',
                        handler: function() {
                            window.open('http://10.41.220.5');
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
                        format: 'd/m/Y',
                        value: new Date(new Date() - 86400000 * 30),
                        maxValue: new Date(),
                        grow: true,
                        editable: false
                    },
                    {
                        xtype: 'displayfield',
                        name: 'EndDateLabel',
                        value: 'по:'
                    },
                    {
                        reference: 'endDate',
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        value: new Date(),
                        //                                   maxValue: new Date(),
                        grow: true,
                        editable: false
                    },
                    {
                        xtype: 'displayfield',
                        value: 'Сдвиг(дн.)'
                    },
                    {
                        reference: 'shiftDates',
                        text: '<',
                        inputValue: -1,
                        tooltip: 'Сдвигает дату на 1 день назад',
                        margin: '7 0 0 10',
                        handler: 'onShiftData'
                    },
                    {
                        reference: 'shiftDates',
                        text: '>',
                        inputValue: 1,
                        tooltip: 'Сдвигает дату на 1 день вперед',
                        margin: '7 0 0 0',
                        handler: 'onShiftData'
                    },
                    {
                        xtype: 'label',
                        margin: '11 0 0 10',
                        text: 'Агрегация:'
                    },
                    {
                        reference: 'AgregationButton',
                        xtype: 'segmentedbutton',
                        items: [{
                                text: 'Daily',
                                inputValue: '[-1], [-3], [-7], [-10], [-14], [-30], [-60], [-90]',
                                defaultPeriod: '-30',
                                chartPointInterval: 24,
                                pressed: true
                            },
                            {
                                text: 'Weekly',
                                inputValue: '[-7], [-14], [-30], [-60], [-90], [-180], [-360],[-720]',
                                defaultPeriod: '-90',
                                chartPointInterval: 24 * 7
                            },
                            {
                                text: 'Monthly',
                                inputValue: '[-90], [-180], [-360],[-720]',
                                defaultPeriod: '-90',
                                chartPointInterval: 24 * 7 * 4
                            }
                        ],
                        listeners: {
                            toggle: 'toggleBut'
                        }
                    },
                    {
                        xtype: 'label',
                        reference: 'periodValuesLabel',
                        margin: '11 0 0 10',
                        html: 'Период:'
                    },
                    {
                        xtype: 'segmentedbutton',
                        reference: 'periodValues',
                        defaults: {
                            disabled: true
                        },
                        items: [
                            { text: '1d', inputValue: '-1', disabled: false },
                            { text: '3d', inputValue: '-3', disabled: false },
                            { text: '7d', inputValue: '-7', disabled: false },
                            { text: '10d', inputValue: '-10', disabled: false },
                            { text: '14d', inputValue: '-14', disabled: false },
                            { text: '1m', inputValue: '-30', disabled: false, pressed: true },
                            { text: '2m', inputValue: '-60', disabled: false },
                            { text: '3m', inputValue: '-90', disabled: false },
                            { text: '6m', inputValue: '-180' },
                            { text: '12m', inputValue: '-360' },
                            { text: '24m', inputValue: '-720' }
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
                margin: '5 0 5 5',
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
                margin: '6 10 5 5',
                iconCls: 'background-size-contain',
                icon: 'resources/images/help.png',
                //                         link: '/Help_doc_web/availreg/Help_availReg.docx',
                handler: function(but) {
                    window.open(but.link);
                }
            }
        ]
    }]
});