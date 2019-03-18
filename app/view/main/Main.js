/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MassEvents.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'MassEvents.view.main.MainController',
        'MassEvents.view.main.MainModel',
        'MassEvents.view.trees.mainTreesPan',
        'MassEvents.view.options.mainOptionsPan',
        'MassEvents.view.chart.mainChartPan'
    ],

    controller: 'main',
    viewModel: 'main',
    layout: {
        type: 'border',
        //align: 'stretch'
    },
    defaults: {
        border: 2
    },
    items: [{
            xtype: 'trees',
            flex: 0.23,
            region: 'west'
        },
        {
            xtype: 'charts',
            region: 'center',
            flex: 1,
            //               layout: 'vbox',
            reference: 'chartsPanel'
        },
        {
            xtype: 'options',
            flex: 0.2,
            region: 'east'
        },
    ],
    listeners: {
        afterrender: 'onRenderMain'
    }
});