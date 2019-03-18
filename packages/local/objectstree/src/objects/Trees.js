Ext.define('Objects.Trees', {
    extend: 'Ext.tree.Panel',
    title: 'Дерево объектов',
    xtype: 'objectstree',
    layout: 'fit',
    flex: 1,
    rootVisible: false,
    useArrows: true,
    displayField: 'name',
    bbar: [
             {xtype: 'tbfill'},
             {
               xtype: 'button',
               icon: 'resources/images/ok-icon.png',
               iconCls: 'background-size-contain',
               tooltip: 'Выбрать все',
               name: 'ckeckAllItemsBtn',
               align: 'right',
               listeners: {
                 click: function(element){
                    var tree = element.up('treepanel'), nodes = tree.getRootNode().childNodes, checked = tree.getChecked();
                    Ext.Object.each(checked, function(key, value, myself){
                        value.set('checked', false);
               				 });
               				 Ext.Object.each(nodes,function(key, value, myself){
               				 		  if (parseInt(value.data.id,10)!==-1){
                            value.set('checked', true);
                        }
                        else{
                           value.set('checked', false);
               							  }
               				 });
                    tree.collapseAll();
                 }
               }
             },
             {
               xtype: 'button',
               icon: 'resources/images/cancel-icon.png',
               iconCls: 'background-size-contain',
               tooltip: 'Снять выделение',
               name: 'unckeckAllItemsBtn',
               align: 'right',
               listeners: {
                 click: function(element){
                    var tree = element.up('treepanel'), checked = tree.getChecked();
               				 Ext.Object.each(checked, function(key, value, myself){
                        value.set('checked', false);
               				 });
                 }
               }
             },
             {
               xtype: 'button',
               icon: 'resources/images/showall-icon.png',
               iconCls: 'background-size-contain',
               tooltip: 'Развернуть',
               name: 'expandAllItemsBtn',
               enableToggle: true,
               align: 'right',
               listeners: {
                 click: function(element){
                   var TreePanel = element.up('treepanel');
                   if (element.pressed) {
                        element.setTooltip('Свернуть');
                        element.setIcon('resources/images/hiddenall-icon.png');
                        TreePanel.setLoading('Загрузка...');
                        TreePanel.expandAll(function () {
                             TreePanel.setLoading(false);
                        });
                   }
                   else {
                        element.setTooltip('Развернуть');
                        element.setIcon('resources/images/showall-icon.png');
                        TreePanel.collapseAll();
                   }
                 }
               }
             }
           ],
    listeners: {
      beforeitemexpand: function(node){
        var curNode = node, that = this;
        if (curNode.childNodes.length == 1) {
          curNode.removeAll();
          Ext.Ajax.request({
                    url: './data/main.php?type=MRTreeChilds',
                    params: {
                         'id': curNode.data['id'],
                    },
                    success: function (response, me) {
                         var data = Ext.decode(response.responseText);
                         for(key in data){
                            curNode.appendChild(data[key]);
                         }
                    }
               });
        }
      },
      checkchange: function (node, checked, eOpts) {
         if (node.childNodes.length > 1  && node.isExpanded()) {
					     node.cascadeBy(function () {
					       this.set('checked', checked);
					     });
					   }
      }
    }
});