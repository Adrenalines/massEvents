Ext.define('Visualisation.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.tab.Panel'
    ],
    //ui: 'top',
    xtype: 'visualisationpanel',
    listeners: {
        render: function(element) {
            var btn = Ext.ComponentQuery.query('[reference=DisplayDataButton]')[0];
            if (timeliness_net_alert.globals.Constants.loaded_stores == timeliness_net_alert.globals.Constants.total_stores && !timeliness_net_alert.globals.Constants.charts_is_loading) {
                timeliness_net_alert.globals.Constants.charts_is_loading = true;
                btn.fireEvent('click', btn);
            }
        }
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            layout: 'fit',
            items: [
                {
                    xtype: 'panel',
                    name: 'DateValuesPanel',
                    scrollable: true,
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        xtype: 'button',
                        padding: 10
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaults: {
                                xtype: 'button',
                                margin: '7 0 0 10'
                            },
                            items: [
                                {
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
                                    format: 'd/m/Y',
                                    submitFormat: 'Y-m-d',
                                    startDay: 1,
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
                                    submitFormat: 'Y-m-d',
                                    startDay: 1,
                                    value: new Date(),
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
                                    handler: function(element) {
                                        var parent = element.up('visualisationpanel');
                                        parent.shiftData(element);
                                    }
                                },
                                {
                                    reference: 'shiftDates',
                                    text: '>',
                                    inputValue: 1,
                                    tooltip: 'Сдвигает дату на 1 день вперед',
                                    margin: '7 0 0 0',
                                    handler: function(element) {
                                        var parent = element.up('visualisationpanel');
                                        parent.shiftData(element);
                                    }
                                },
                                {
                                    xtype: 'label',
                                    margin: '11 0 0 10',
                                    text: 'Агрегация:'
                                },
                                {
                                    reference: 'AgregationButton',
                                    xtype: 'segmentedbutton',
                                    items: [
                                        {
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
                                        toggle: function(element, button, isPressed) {
                                            var periodbuttons = element.up().child('[reference=periodValues]');
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
                                        }
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
                                        {
                                            text: '1d',
                                            inputValue: '-1',
                                            disabled: false
                                        },
                                        {
                                            text: '3d',
                                            inputValue: '-3',
                                            disabled: false
                                        },
                                        {
                                            text: '7d',
                                            inputValue: '-7',
                                            disabled: false
                                        },
                                        {
                                            text: '10d',
                                            inputValue: '-10',
                                            disabled: false
                                        },
                                        {
                                            text: '14d',
                                            inputValue: '-14',
                                            disabled: false
                                        },
                                        {
                                            text: '1m',
                                            inputValue: '-30',
                                            disabled: false,
                                            pressed: true
                                        },
                                        {
                                            text: '2m',
                                            inputValue: '-60',
                                            disabled: false
                                        },
                                        {
                                            text: '3m',
                                            inputValue: '-90',
                                            disabled: false
                                        },
                                        {
                                            text: '6m',
                                            inputValue: '-180'
                                        },
                                        {
                                            text: '12m',
                                            inputValue: '-360'
                                        },
                                        {
                                            text: '24m',
                                            inputValue: '-720'
                                        }
                                    ],
                                    listeners: {
                                        toggle: function(element, button, isPressed) {
                                            var enddatefield = element.up().down('[reference=endDate]'),
                                                startdatefield = element.up().down('[reference=startDate]'),
                                                adddays = button.inputValue,
                                                dt = enddatefield.getValue(),
                                                dInt = 86400000 * Math.abs(adddays);
                                            startdatefield.setValue(new Date(new Date(dt) - dInt));
                                        }
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
                            }
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            text: 'Текущие отчеты',
                            name: 'link',
                            margin: '6 0 5 5',
                            tooltip: 'Выгрузить текущий отчет в формате Excel',
                            menu: new Ext.menu.Menu({
                                items: [
                                    {
                                        text: 'Недельный отчет',
                                        fieldInStaticJson: 'current_report_url_weekly',
                                        url: '',
                                        listeners: {
                                            beforerender: function(element) {
                                                var parent = element.up('visualisationpanel');
                                                parent.loadUrlForButton(element);
                                            }
                                        },
                                        handler: function(but) {
                                            window.open(but.url);
                                        }
                                    },
                                    {
                                        text: 'Месячный отчет',
                                        fieldInStaticJson: 'current_report_url_monthly',
                                        url: '',
                                        listeners: {
                                            beforerender: function(element) {
                                                var parent = element.up('visualisationpanel');
                                                parent.loadUrlForButton(element);
                                            }
                                        },
                                        handler: function(but) {
                                            window.open(but.url);
                                        }
                                    }
                                ]
                            })
                        },
                        {
                            margin: '6 0 5 5',
                            name: 'link',
                            disabled: false,
                            icon: 'resources/images/weeklyqualityreports-icon.png',
                            tooltip: 'Архив отчетов в формате Excel',
                            iconCls: 'background-size-contain',
                            fieldInStaticJson: 'archive_report_url',
                            url: '',
                            listeners: {
                                beforerender: function(element) {
                                    var parent = element.up('visualisationpanel');
                                    parent.loadUrlForButton(element);
                                }
                            },
                            handler: function(but) {
                                window.open(but.url);
                            }
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
                            fieldInStaticJson: 'help_doc_url',
                            url: '',
                            listeners: {
                                beforerender: function(element) {
                                    var parent = element.up('visualisationpanel');
                                    parent.loadUrlForButton(element);
                                }
                            },
                            handler: function(but) {
                                window.open(but.url);
                            }
                        }
                    ]
                }
            ]
        }
    ],
    shiftData: function(but) {
        var sd = but.up().child('[reference=startDate]'),
            ed = but.up().child('[reference=endDate]'),
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
    loadUrlForButton: function(element) {
        Ext.Ajax.request({
            url: './static.json',
            method: 'GET',
            success: function(response, opts) {
                var data = Ext.decode(response.responseText);
                element.url = data[element.fieldInStaticJson];
            }
        });
    }
});

