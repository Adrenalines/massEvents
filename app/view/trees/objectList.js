var slaStore = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=NEW_GR_TREE',
    }
});

var geoStore = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=NEW_GR_TREE',
    }
});

var regionStore = new Ext.data.TreeStore({
    fields: [
        'id',
        'name',
        'text',
        'leaf',
        'checked'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=NEW_GR_TREE',
    }
});

Ext.define('MassEvents.view.trees.objectList', {
    requires: 'MassEvents.view.trees.SearchToolbar',
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'objectList',
    reference: 'objectList',
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
                    if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTree') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=slaTree]')[0];
                    } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTree') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=geoTree]')[0];
                    } else {
                        tree = Ext.ComponentQuery.query('treepanel[reference=regionTree]')[0];
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
                    if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTree') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=slaTree]')[0];
                    } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTree') {
                        tree = Ext.ComponentQuery.query('treepanel[reference=geoTree]')[0];
                    } else {
                        tree = Ext.ComponentQuery.query('treepanel[reference=regionTree]')[0];
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
                        if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'slaTree') {
                            tree = Ext.ComponentQuery.query('treepanel[reference=slaTree]')[0];
                        } else if (e.ownerCt.ownerCt.items.items[0].getActiveTab().id == 'geoTree') {
                            tree = Ext.ComponentQuery.query('treepanel[reference=geoTree]')[0];
                        } else {
                            tree = Ext.ComponentQuery.query('treepanel[reference=regionTree]')[0];
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
                    slaStore.reload();
                    geoStore.reload();
                    regionStore.reload();
                }
            }
        ]
    }, {
        xtype: 'toolbar',
        items: [{
            xtype: 'SearchToolbar',
            name: 'objectListSearchToolbar',
            width: '100%',
            sourceSearch: true, // добавлять или нет возможность выбора поля для поиска
            style: {
                border: 0,
                background: 'none'
            }
        }]
    }],
    items: [{
        name: 'topTrees',
        xtype: 'tabpanel',
        region: 'center',
        flex: 3,
        layout: {
            type: 'fit'
        },
        items: [{
                xtype: 'treepanel',
                id: 'slaTree',
                name: 'slaTree',
                reference: 'slaTree',
                rootVisible: false,
                title: 'SLA',
                store: slaStore,
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
                id: 'geoTree',
                name: 'geoTree',
                reference: 'geoTree',
                rootVisible: false,
                title: 'Геоюниты',
                store: geoStore,
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
                id: 'regionTree',
                name: 'regionTree',
                reference: 'regionTree',
                rootVisible: false,
                title: 'Регионы',
                store: regionStore,
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
        ]
    }],
    bbar: [{
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        icon: 'resources/images/arrow-icon.png',
        iconCls: 'background-size-contain',
        itemId: 'arrowButton',
        tooltip: 'Обновить',
        height: 20,
        handler: function(e) {
            slaStore.reload();
        }
    }, {
        xtype: 'tbfill'
    }]
});