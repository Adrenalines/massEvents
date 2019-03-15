Ext.define('Global', {
    singleton: true,
    alias: 'global',
    projectName: 'MassEvents',
    server: '/',
    php: './data/',
    chart: 'chart.php?type=',
    settings: 'changeSettings.php?type=',
    auth: 'auth.php',
    main: 'main.php?type=',
    comment: 'comment.php?type=',
    intervalIdArr: [],
    config: {
        //          fullAccess: false
        window: this,
        errorText: 'Проверьте правильность введённых данных',
        blankText: 'Введите объект для поиска'
    },
    getUrl: function(ui, type) {
        switch (ui) {
            case 'chart':
                return this.php + this.chart + type;
                break;
                //               case 'settings':
                //                    return this.server + this.projectName + this.php + this.settings + type;
                //                    break;
            case 'auth':
                return this.php + this.auth;
                break;
            case 'main':
                return this.php + this.main + type;
            case 'comment':
                return this.php + this.comment + type;

        }
    },
    setIntervalId: function(intervalId) {
        var idArr = this.intervalIdArr;
        idArr.push(intervalId);
        return intervalId;
    },
    clearIntervals: function() {
        var idArr = this.intervalIdArr;
        Ext.Array.each(idArr, function(item) {
            clearInterval(item);
        });
        this.intervalIdArr = [];
    },
    getLastChange: function() {
        var obj = {};
        obj.version = '1.0.0.0';
        obj.dateChange = '09-07-2018';
        obj.lastChange = '<br><br> - Добавлена автозагрузка графиков'
        obj.changeLog = '<br><b>1.0.0.0 (20-04-2018):</b>\n\
                           <br><br> - Первая версия модуля'
        return obj;
    },
    constructor: function(config) {
        this.initConfig(config);
        //          return this;
    }
});