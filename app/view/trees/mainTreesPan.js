Ext.define('MassEvents.view.trees.mainTreesPan', {
    extend: 'Ext.panel.Panel',
    xtype: 'trees',
    requires: [
        'MassEvents.view.trees.objectList',
        'MassEvents.view.trees.mainTreesPanController',
        'MassEvents.view.trees.mainTreesPanModel',
        'MassEvents.view.trees.serviceList',
        'MassEvents.view.trees.BTSCellList'
    ],

    controller: 'trees-maintreespan',
    viewModel: {
        type: 'trees-maintreespan'
    },

    layout: {
        type: 'border',
        align: 'stretch'
    },
    defaults: {
        flex: 1
    },
    items: [{
            xtype: 'objectList',
            region: 'north',
            reference: 'mrTree',
            flex: 1.5
        },
        {
            xtype: 'btsCellList',
            region: 'center',
            flex: 1.2
        },
        {
            xtype: 'servList',
            region: 'south',
            flex: 1.2
        }
    ]
});