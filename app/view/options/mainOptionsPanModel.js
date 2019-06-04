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
            titles: 'Заголовки',
            legend: 'Легенды',
            xAxisLabelsShowed: 'Подписи по оси X'
        },
        renderer: {
            title: 'Визуализация',
            chart: 'В виде графиков',
            table: 'В виде таблиц'
        },
        help: {
            title: 'Справка'
        },
        sender: {
            title: 'Управление рассылкой'
        }
    }

});