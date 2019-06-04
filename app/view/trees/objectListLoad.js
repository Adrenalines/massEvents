var slaStoreLoad = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=SLA_LOAD_TREE',
    }
});

var geoStoreLoad = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=GEO_LOAD_TREE'
    }
});

var regionStoreLoad = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=REGION_LOAD_TREE',
        success: function(response) {
            console.log(Ext.decode(response.responseText));
        }
    }
});

Ext.define('MassEvents.view.trees.objectListLoad', {
    requires: 'MassEvents.view.trees.SearchToolbar',
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'objectListLoad',
    reference: 'objectListLoad',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
                xtype: 'label',
                text: 'Объекты',
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
                handler: function(e) {
                    var tree;
                    if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTreeLoad') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=slaTreeLoad]')[0];
                    } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTreeLoad') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=geoTreeLoad]')[0];
                    } else {
                        tree = Ext.ComponentQuery.query('treepanel[reference=regionTreeLoad]')[0];
                    }
                    tree.getRootNode().cascadeBy(function(childNode) {
                        this.set('checked', true);
                    });
                }
            }, {
                xtype: 'button',
                icon: 'resources/images/cancel-icon.png',
                iconCls: 'background-size-contain',
                tooltip: 'Снять выделение',
                handler: function(e) {
                    var tree;
                    if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTreeLoad') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=slaTreeLoad]')[0];
                    } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTreeLoad') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=geoTreeLoad]')[0];
                    } else {
                        tree = Ext.ComponentQuery.query('treepanel[reference=regionTreeLoad]')[0];
                    }
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
                    click: function(e) {
                        var tree;
                        if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTreeLoad') {
                            tree = Ext.ComponentQuery.query('treepanel[reference=slaTreeLoad]')[0];
                        } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTreeLoad') {
                            tree = Ext.ComponentQuery.query('treepanel[reference=geoTreeLoad]')[0];
                        } else {
                            tree = Ext.ComponentQuery.query('treepanel[reference=regionTreeLoad]')[0];
                        }
                        if (e.pressed) {
                            e.setTooltip('Свернуть');
                            e.setIcon('resources/images/hiddenall-icon.png');
                            tree.expandAll();
                        } else {
                            e.setTooltip('Развернуть');
                            e.setIcon('resources/images/showall-icon.png');
                            tree.collapseAll();
                        }
                    }
                }
            },
            {
                xtype: 'button',
                icon: 'resources/images/refresh-icon.png',
                iconCls: 'background-size-contain',
                itemId: 'refreshButton',
                tooltip: 'Обновить',
                height: 20,
                handler: function(e) {
                    slaStoreLoad.reload();
                    geoStoreLoad.reload();
                    regionStoreLoad.reload();
                }
            }
        ]
    }, {
        xtype: 'toolbar',
        items: [{
            xtype: 'SearchToolbar',
            name: 'objectListLoadSearchToolbar',
            width: '100%',
            sourceSearch: true, // добавлять или нет возможность выбора поля для поиска
            style: {
                border: 0,
                background: 'none'
            }
        }]
    }],
    items: [{
        name: 'topTreesLoad',
        xtype: 'tabpanel',
        region: 'center',
        flex: 3,
        layout: {
            type: 'fit'
        },
        items: [{
                xtype: 'treepanel',
                id: 'slaTreeLoad',
                name: 'slaTreeLoad',
                reference: 'slaTreeLoad',
                rootVisible: false,
                title: 'SLA',
                store: slaStoreLoad,
                listeners: {
                    checkchange: function(node, checked, eOpts) {
                        if (node.hasChildNodes()) {
                            node.eachChild(function(childNode) {
                                childNode.set('checked', checked);
                                if (childNode.hasChildNodes()) {
                                    childNode.eachChild(function(childChildNode) {
                                        childChildNode.set('checked', checked);
                                    });
                                }
                            });
                        }
                    }
                }
            },
            {
                xtype: 'treepanel',
                id: 'geoTreeLoad',
                name: 'geoTreeLoad',
                reference: 'geoTreeLoad',
                rootVisible: false,
                title: 'Геоюниты',
                store: geoStoreLoad,
                listeners: {
                    checkchange: function(node, checked, eOpts) {
                        if (node.hasChildNodes()) {
                            node.eachChild(function(childNode) {
                                childNode.set('checked', checked);
                                if (childNode.hasChildNodes()) {
                                    childNode.eachChild(function(childChildNode) {
                                        childChildNode.set('checked', checked);
                                    });
                                }
                            });
                        }
                    }
                }
            },
            {
                xtype: 'treepanel',
                id: 'regionTreeLoad',
                name: 'regionTreeLoad',
                reference: 'regionTreeLoad',
                rootVisible: false,
                title: 'Регионы',
                store: regionStoreLoad,
                listeners: {
                    checkchange: function(node, checked, eOpts) {
                        if (node.hasChildNodes()) {
                            node.eachChild(function(childNode) {
                                childNode.set('checked', checked);
                            });
                        }
                    }
                }
            }
        ],
        listeners: {
            tabchange: function(e) {
                let cellButton = Ext.ComponentQuery.query('button[itemId=arrowButtonCell]')[0];
                // e.setDisabled(false);
                if (e.getActiveTab().name == 'slaTreeLoad') {
                    cellButton.setDisabled(true);
                } else {
                    cellButton.setDisabled(false);
                }
            }
        }
    }],
    bbar: [{
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            icon: 'resources/images/arrow-icon.png',
            iconCls: 'background-size-contain',
            itemId: 'arrowButtonLoad',
            tooltip: 'BTS and CELL inside',
            height: 20,
            handler: 'arrowButtonClick'
        },
        {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            itemId: 'arrowButtonCell',
            tooltip: 'CELL',
            text: 'CELL',
            disabled: true,
            enableToggle: true,
            pressed: true
        }
    ]
});