Ext.define('MassEvents.view.trees.objectList', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'objectList',
    reference: 'objectList',
    title: "Дерево МО",
    items: [{
        xtype: 'checkboxgroup',
        reference: 'moTree',
        columns: 1,
        vertical: true,
        margin: '5 0 0 5',
        defaults: {
            name: 'check',
            checked: true,
            style: {
                'font-size': '11px'
            }
        },
        items: [{
            boxLabel: 'ALL',
            inputValue: {
                Name: 'ALL',
                Id: '0000'
            }
        }]
    }],
    listeners: {}
});