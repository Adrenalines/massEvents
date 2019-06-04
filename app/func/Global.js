Ext.define('Global', {
    singleton: true,
    alias: 'global',
    projectName: 'MassEvents',
    server: '/',
    php: './data/',
    chart: 'chart.php?type=',
    load: 'load.php?type=',
    getUrl: function(ui, type) {
        switch (ui) {
            case 'chart':
                return this.php + this.chart + type;
            case 'load':
                return this.php + this.load + type;

        }
    },
    getLastChange: function() {
        var obj = {},
            self = this;
        obj.version = '1.0.0.0';
        obj.dateChange = '04-04-2019';
        obj.lastChange = '<br><br> - Первая версия модуля'
        obj.changeLog = '<br><b>1.0.0.0 (01-04-2019):</b>\n\
                           <br><br> - Начата работа над модулем'
        return obj;
    }
});