Ext.define('MassEvents.view.trees.serviceList', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    xtype: 'servList',
    reference: 'servList',
    title: "Список показателей:",
    tbar: ['->', {
        xtype: 'button',
        iconCls: 'sel-all',
        tooltip: 'Отметить все',
        //text: 'Отметить все',
        handler: function() {
            var tree = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0];
            tree.getRootNode().cascadeBy(function(childNode) {
                if (childNode.data.id == 'first_chart' || childNode.data.id == 'second_chart' || childNode.data.id == 'third_chart' || childNode.data.id == 'fourth_chart' || childNode.data.id == 'fifth_chart' || childNode.data.id == 'six_chart') {
                    this.set('checked', true);
                }
            });
        }
    }, {
        xtype: 'button',
        iconCls: 'sel-none',
        tooltip: 'Снять выделение',
        handler: function() {
            var tree = Ext.ComponentQuery.query('treepanel[reference=checkSrvList]')[0];
            tree.getRootNode().cascadeBy(function(childNode) {
                if (childNode.data.id == 'first_chart' || childNode.data.id == 'second_chart' || childNode.data.id == 'third_chart' || childNode.data.id == 'fourth_chart' || childNode.data.id == 'fifth_chart' || childNode.data.id == 'six_chart') {
                    this.set('checked', false);
                }
            });
        }
    }],
    items: [{
        xtype: 'treepanel',
        rootVisible: false,
        id: 'myTreeChartName',
        reference: 'checkSrvList',
        root: {
            expanded: true,
            children: [{
                id: 'not_id1',
                text: 'МЕДИАЦИЯ',
                leaf: false,
                expanded: true,
                children: [{
                    id: 'first_chart',
                    text: 'Объем данных на входе/выходе MD, Гбайт',
                    checked: true,
                    leaf: true
                }]
            }, {
                id: 'not_id2',
                text: 'ORACLE',
                leaf: false,
                expanded: true,
                children: [{
                    id: 'second_chart',
                    text: 'Время выполнения и размер ARCHIVELOG, Тбайт',
                    checked: true,
                    leaf: true
                }, {
                    id: 'third_chart',
                    text: 'Время выполнения и размер DB FULL, Тбайт',
                    checked: true,
                    leaf: true
                }, {
                    id: 'fourth_chart',
                    text: 'Объем модифицированных данных (DML), Тбайт',
                    checked: true,
                    leaf: true
                }, {
                    id: 'fifth_chart',
                    text: 'Утилизация дисковых групп, %',
                    checked: true,
                    leaf: true
                }, {
                    id: 'six_chart',
                    text: 'Размер БД, Тбайт',
                    checked: true,
                    leaf: true
                }]
            }]
        },

        folderSort: false,
        /*listeners: {
             checkchange: function( node, checked, eOpts ){
                  if(node.hasChildNodes()){
                       node.eachChild(function(childNode){
                            childNode.set('checked', checked);
                       });
                  }
             }
        }*/
    }],
    listeners: {
        //beforerender: 'beforeRenderTab'
    }
});