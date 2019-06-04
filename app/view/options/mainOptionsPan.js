Ext.define('MassEvents.view.options.mainOptionsPan', {
    extend: 'Ext.panel.Panel',
    xtype: 'options',
    requires: [
        'MassEvents.view.options.mainOptionsPanController',
        'MassEvents.view.options.mainOptionsPanModel'
    ],
    bind: {
        title: '{title}'
    },
    controller: 'options-mainoptionspan',
    viewModel: {
        type: 'options-mainoptionspan'
    },
    collapsed: false,
    collapsible: true,
    collapseFirst: false,
    hideCollapseTool: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        margin: '5 10 5 10'
    },
    items: [{
            xtype: 'fieldset',
            bind: {
                title: '{countChartbut.title}'
            },
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            },
            items: [{
                xtype: 'segmentedbutton',
                itemId: 'countChartBut',
                ui: 'toolbar',
                items: [
                    { text: '1', value: 1 },
                    { text: '2', value: 2 },
                    { text: '4', value: 4, pressed: true },
                    { text: '6', value: 6 },
                    { text: '9', value: 9 },
                    { text: '12', value: 12 },
                    { text: '16', value: 16 }
                ],
                margin: '10 5 10 0'
            }]
        },
        {
            xtype: 'fieldset',
            bind: {
                title: '{elRender.title}'
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'checkboxfield',
                flex: 1
            },
            margin: '10',
            items: [{
                    bind: {
                        boxLabel: '{elRender.titles}'
                    },
                    name: 'TitlesChartShowed',
                    checked: true
                },
                {
                    bind: {
                        boxLabel: '{elRender.legend}'
                    },
                    name: 'LegendsChartShowed',
                    checked: true
                },
                {
                    bind: {
                        boxLabel: '{elRender.xAxisLabelsShowed}'
                    },
                    name: 'xAxisLabelsShowed',
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Визуализация',
            name: 'visualEl',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'checkboxfield',
                flex: 1
            },
            items: [{
                    xtype: 'radio',
                    name: 'rbchartortable',
                    bind: {
                        boxLabel: '{renderer.chart}'
                    },
                    inputValue: 'chart',
                    margin: '0 0 0 0',
                    checked: true
                },
                {
                    xtype: 'radio',
                    name: 'rbchartortable',
                    bind: {
                        boxLabel: '{renderer.table}'
                    },
                    inputValue: 'table'
                }
            ]
        },
        {
            xtype: 'fieldset',
            bind: {
                title: '{help.title}'
            },
            layout: {
                type: 'vbox',
                padding: '5 0 10 10'
            },
            defaultType: 'button',
            items: [{
                text: 'Версия ПО: ' + Global.getLastChange().version,
                handler: 'onAboutClick'
            }]
        }

    ]
});