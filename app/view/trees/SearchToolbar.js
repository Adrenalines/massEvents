Ext.define('MassEvents.view.trees.SearchToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    dock: 'top',
    itemId: 'SearchToolbar',
    xtype: 'SearchToolbar',
    initComponent: function() {
        var items;
        items = [{
                xtype: 'textfield',
                itemId: 'searchText',
                emptyText: 'Поиск...',
                allowBlank: false,
                flex: 1,
                enableKeyEvents: true,
                // если пришло пустое значение отображаем это пользователю
                validator: function(val) {
                    if (val === 'Объектов не найдено') {
                        return 'Проверьте правильность введённых данных';
                    } else {
                        return true;
                    }
                },
            },
            {
                xtype: 'combo',
                itemId: 'searchCombo',
                minChars: 6,
                flex: 1,
                emptyText: 'Выберите объект',
                editable: false,
                enableKeyEvents: true,
                store: Ext.create('Ext.data.Store', {
                    fields: []
                }),
                displayField: 'obj',
                hidden: true
            },
            {
                itemId: 'searchButton',
                icon: 'resources/images/find-icon.png',
                iconCls: 'background-size-contain',
                tooltip: 'Найти',
            },
            {
                icon: 'resources/images/cancel-icon.png',
                iconCls: 'background-size-contain',
                itemId: 'deleteButton',
                tooltip: 'Очистить поле'
            },
            {
                name: 'searchHelpButton',
                itemId: 'searchHelpButton',
                icon: 'resources/images/help.png',
                iconCls: 'background-size-contain'
            }
        ]
        Ext.apply(this, {
            items: items
        });
        this.callParent(arguments);
    },
});