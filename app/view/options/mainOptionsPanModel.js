Ext.define('MassEvents.view.options.mainOptionsPanModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.options-mainoptionspan',
    data: {
        name: 'MassEvents',
        title: 'Настройки',
        countChartbut: {
            title: 'Кол-во графиков на странице'
        },
        elRender: {
            title: 'Отображение элементов',
            labelHints: 'Хинты',
            shared: 'Объединить',
            noshared: 'Разделить',
            disabled: 'Убрать',
            legend: 'Легенды',
            xAxisLabelsShowed: 'Подписи по оси X',
            target: 'Добавить целевые значения',
            onlyTarget: 'Только целевые значения'
        },
        renderer: {
            title: 'Визуализация',
            chart: 'В виде графиков',
            table: 'В виде таблиц',
            newTab: 'В новой вкладке',
            currentTab: 'В текущей вкладке'
        },
        help: {
            title: 'Справка'
        },
        sender: {
            title: 'Управление рассылкой'
        }
    }

});