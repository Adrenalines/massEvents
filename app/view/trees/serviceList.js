Ext.define('MassEvents.view.trees.serviceList', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'servList',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
                xtype: 'label',
                text: 'Список KPI',
                margin: '5 0 0 5',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            { xtype: 'tbfill' }, {
                xtype: 'button',
                icon: 'resources/images/ok-icon.png',
                iconCls: 'background-size-contain',
                tooltip: 'Выбрать все',
                handler: function() {
                    var tree = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0];
                    tree.getRootNode().cascadeBy(function(childNode) {
                        this.set('checked', true);
                    });
                }
            }, {
                xtype: 'button',
                icon: 'resources/images/cancel-icon.png',
                iconCls: 'background-size-contain',
                tooltip: 'Снять выделение',
                handler: function() {
                    var tree = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0];
                    tree.getRootNode().cascadeBy(function(childNode) {
                        this.set('checked', false);
                    });
                }
            }, {
                xtype: 'button',
                icon: 'resources/images/showall-icon.png',
                iconCls: 'background-size-contain',
                tooltip: 'Развернуть',
                enableToggle: true,
                align: 'right',
                listeners: {
                    click: function(element) {
                        var tree = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0];
                        if (element.pressed) {
                            element.setTooltip('Свернуть');
                            element.setIcon('resources/images/hiddenall-icon.png');
                            tree.expandAll();
                        } else {
                            element.setTooltip('Развернуть');
                            element.setIcon('resources/images/showall-icon.png');
                            tree.collapseAll();
                        }
                    }
                }
            }
        ]
    }, {
        xtype: 'toolbar',
        items: [{
            xtype: 'SearchToolbar',
            name: 'serviceListSearchToolbar',
            width: '100%',
            sourceSearch: true, // добавлять или нет возможность выбора поля для поиска
            style: {
                border: 0,
                background: 'none'
            }
        }]
    }],
    items: [{
        xtype: 'treepanel',
        rootVisible: false,
        id: 'checkSrvList',
        name: 'checkSrvList',
        reference: 'checkSrvList',
        store: new Ext.data.TreeStore({
            fields: [
                'id',
                'name',
                'text',
                'leaf',
                'checked'
            ],
            proxy: {
                type: 'ajax',
                url: './data/KPIData.json'
            }
        }),
        folderSort: false,
        listeners: {
            checkchange: function(node, checked, eOpts) {
                if (node.hasChildNodes()) {
                    node.eachChild(function(childNode) {
                        childNode.set('checked', checked);
                    });
                }
            }
        }
    }],
    bbar: [{
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        itemId: 'massEventsButton',
        text: 'МАСС. МЕР.',
        border: 1,
        margin: '0 5 5 0',
        style: {
            borderColor: '#3358ff',
            borderStyle: 'solid'
        },
        handler: function(e) {
            btsCellStore.reload();
        }
    }, {
        xtype: 'button',
        itemId: 'swapButton',
        text: 'SWAP',
        border: 1,
        margin: '0 5 5 5',
        style: {
            borderColor: '#3358ff',
            borderStyle: 'solid'
        },
        handler: function(e) {
            btsCellStore.reload();
        }
    }, {
        xtype: 'button',
        itemId: 'qualityButton',
        text: 'QUALITY',
        border: 1,
        margin: '0 0 5 5',
        style: {
            borderColor: '#3358ff',
            borderStyle: 'solid'
        },
        handler: function(e) {
            btsCellStore.reload();
        }
    }, {
        xtype: 'tbfill'
    }]
});