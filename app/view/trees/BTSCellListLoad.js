var btsCellStoreLoad = new Ext.data.TreeStore({
    storeId: 'btsCellStore',
    fields: [
        'id',
        'name',
        'text',
        'expandRegion',
        'expandBts',
        'leaf'
    ],
    proxy: {
        type: 'ajax',
        url: './data/main.php?type=BTS_CELL_LOAD_TREE'
    },
    listeners: {}
});

Ext.define('MassEvents.view.trees.BTSCellListLoad', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'btsCellListLoad',
    reference: 'btsCellListLoad',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            xtype: 'label',
            text: 'BTS / CELL',
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
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    this.set('checked', true);
                });
            }
        }, {
            xtype: 'button',
            icon: 'resources/images/ok-bts-icon.png',
            iconCls: 'background-size-contain',
            tooltip: 'Выбрать все BTS',
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    if (this.data.text.substring(0, 3) == 'BTS') {
                        this.set('checked', true);
                    }
                });
            }
        }, {
            xtype: 'button',
            icon: 'resources/images/ok-cell-icon.png',
            iconCls: 'background-size-contain',
            tooltip: 'Выбрать все соты',
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    if (this.data.leaf == true) {
                        this.set('checked', true);
                    }
                });
            }
        }, {
            xtype: 'button',
            icon: 'resources/images/cancel-icon.png',
            iconCls: 'background-size-contain',
            tooltip: 'Снять выделение',
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    this.set('checked', false);
                });
            }
        }, {
            xtype: 'button',
            icon: 'resources/images/cancel-bts-icon.png',
            iconCls: 'background-size-contain',
            tooltip: 'Снять выделение BTS',
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    if (this.data.text.substring(0, 3) == 'BTS') {
                        this.set('checked', false);
                    }
                });
            }
        }, {
            xtype: 'button',
            icon: 'resources/images/cancel-cell-icon.png',
            iconCls: 'background-size-contain',
            tooltip: 'Снять выделение сот',
            handler: function () {
                let tree = Ext.ComponentQuery.query('treepanel[reference=btsCellTreeLoad]')[0];
                tree.getRootNode().cascadeBy(function (childNode) {
                    if (this.data.leaf == true) {
                        this.set('checked', false);
                    }
                });
            }
        },
        {
            xtype: 'button',
            icon: 'resources/images/refresh-icon.png',
            iconCls: 'background-size-contain',
            itemId: 'refreshButton',
            tooltip: 'Обновить',
            height: 20,
            handler: function (e) {
                btsCellStoreLoad.reload();
            }
        }
        ]
    }, {
        xtype: 'toolbar',
        items: [{
            xtype: 'SearchToolbar',
            name: 'btsCellListLoadSearchToolbar',
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
        id: 'btsCellTreeLoad',
        name: 'btsCellTreeLoad',
        reference: 'btsCellTreeLoad',
        rootVisible: false,
        store: btsCellStoreLoad,
        listeners: {
            checkchange: function (node, checked, eOpts) {
                if (node.hasChildNodes()) {
                    node.eachChild(function (childNode) {
                        childNode.set('checked', checked);
                        if (childNode.hasChildNodes()) {
                            childNode.eachChild(function (childChildNode) {
                                childChildNode.set('checked', checked);
                                if (childChildNode.hasChildNodes()) {
                                    childChildNode.eachChild(function (childChildChildNode) {
                                        childChildChildNode.set('checked', checked);
                                    });
                                }
                            });
                        }
                    });
                }
            },
            itemexpand: function (pThis, pEOpts) {
                if (pThis.data.expandRegion === true) {
                    Ext.Ajax.request({
                        url: './data/main.php?type=BTS_CELL_LOAD_TREE_ADD_BTS',
                        method: 'POST',
                        timeout: 60000,
                        params: {
                            region: pThis.id
                        },
                        success: function (response) {
                            pThis.removeAll();
                            var resp = Ext.decode(response.responseText);
                            var nodeToAppend;
                            Ext.Array.each(resp, function (item, i) {
                                if (i < 100) {
                                    nodeToAppend = pThis.createNode(resp[i]);
                                    pThis.appendChild(nodeToAppend);
                                }
                            });
                            pThis.set('expandRegion', false);
                        }
                    });
                } else if (pThis.data.expandBts === true) {
                    Ext.Ajax.request({
                        url: './data/main.php?type=BTS_CELL_LOAD_TREE_ADD_CELL',
                        method: 'POST',
                        timeout: 60000,
                        params: {
                            bts: pThis.id
                        },
                        success: function (response) {
                            pThis.removeAll();
                            var resp = Ext.decode(response.responseText);
                            var nodeToAppend;
                            Ext.Array.each(resp, function (item, j) {
                                nodeToAppend = pThis.createNode(resp[j]);
                                pThis.appendChild(nodeToAppend);
                            });
                            pThis.set('expandBts', false);
                        }
                    });
                }
            }
        }
    }]
});