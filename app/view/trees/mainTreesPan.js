Ext.define('MassEvents.view.trees.mainTreesPan', {
    extend: 'Ext.panel.Panel',
    xtype: 'trees',
    requires: [
        'MassEvents.view.trees.mainTreesPanController',
        'MassEvents.view.trees.mainTreesPanModel',

        'MassEvents.view.trees.serviceList',
        'MassEvents.view.trees.objectList'
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
        //          border: 2,
        flex: 1
    },
    items: [{
            xtype: 'objectList',
            region: 'center',
            reference: 'mrTree'
        },
        {
            xtype: 'servList',
            region: 'south'
                //               split: true
        }
    ]
});