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
                        tooltip: 'На главную страницу портала',
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
                        value: new Date(new Date() - 86400000),
                        maxValue: new Date(),
                        grow: true,
                        editable: true
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
                        value: new Date(),
                        grow: true,
                        editable: true
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
                                text: 'Hourly',
                                inputValue: '[-1], [-3], [-6], [-12], [-18], [-24], [-48], [-72], [-96], [-120], [-148]',
                                defaultPeriod: '-1',
                                chartPointInterval: 1,
                                pressed: true
                            },
                            {
                                text: 'Daily',
                                inputValue: '[-24], [-48], [-72], [-96], [-120], [-148]',
                                defaultPeriod: '-24',
                                chartPointInterval: 24,

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
                            { text: '1h', inputValue: '-1', disabled: false, pressed: true },
                            { text: '3h', inputValue: '-3', disabled: false },
                            { text: '6h', inputValue: '-6', disabled: false },
                            { text: '12h', inputValue: '-12', disabled: false },
                            { text: '18h', inputValue: '-18', disabled: false },
                            { text: '1d', inputValue: '-24', disabled: false },
                            { text: '2d', inputValue: '-48', disabled: false },
                            { text: '3d', inputValue: '-72', disabled: false },
                            { text: '4d', inputValue: '-96', disabled: false },
                            { text: '5d', inputValue: '-120', disabled: false },
                            { text: '6d', inputValue: '-148', disabled: false }
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
                link: '/Help_doc_web/availreg/Help_availReg.docx',
                handler: function(but) {
                    window.open(but.link);
                }
            }
        ]
    }]
});