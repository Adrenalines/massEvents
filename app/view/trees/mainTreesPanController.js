Ext.define('MassEvents.view.trees.mainTreesPanController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.trees-maintreespan',
    init: function () {
        this.control({
            '#SearchToolbar > #searchCombo': {
                select: this.getSearchObj,
            },
            '#SearchToolbar > #searchButton': {
                click: this.onSearch
            },
            '#SearchToolbar > #deleteButton': {
                click: this.onDeleteSearch
            },
            '#SearchToolbar > #fieldCombo': {
                change: this.changeFieldSearch
            },
            '#SearchToolbar > #searchText': {
                keydown: this.onKeyPressed
            },
            'button[name=searchHelpButton]': {
                afterrender: function (element) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: element.el,
                        title: 'Справка по поиску',
                        html: 'Горячие клавиши:<br />Enter - осуществить поиск<br />Esc - очистить поле ввода.',
                        autoHide: true,
                        closable: true,
                        draggable: true
                    });
                }
            }
        });
    },
    onSearch: function (searchBut, search, techIndex) {
        var toolbar = searchBut.up('toolbar'),
            textSearch = toolbar.down('#searchText'),
            searchCombo = toolbar.down('#searchCombo'),
            panelTree = toolbar.up('panel'),
            tabPanel = panelTree.down('tabpanel'),
            clearSearchBut = toolbar.down('#deleteButton'),
            tree;
        if (!tabPanel) {
            tree = panelTree.down('treepanel');
        } else {
            tree = Ext.ComponentQuery.query('treepanel[name=' + tabPanel.getActiveTab().name + ']')[0];
        }
        // если поле не пустое то отправляем поисковые данные на сервер

        if (textSearch.validate()) {
            textSearch.setLoading('Поиск...');
            if ((tree.getItemId() == 'checkSrvList') || (tree.getItemId() == 'checkSrvListLoad')) {
                var checkText = textSearch.getValue();
                var data = [],
                    storeRange = [],
                    storeArray = [
                        [],
                        []
                    ],
                    store = tree.getStore();
                storeRange = store.getRange();
                var k = 0;
                Ext.Array.each(storeRange, function (item1, i) {
                    storeArray[i] = item1.name;
                    storeArray[i] = [];
                    Ext.Array.each(item1.childNodes, function (item2, j) {
                        if (item2.data.text.toLowerCase().includes(checkText.toLowerCase())) {
                            data[k] = {
                                obj: ''
                            };
                            data[k].obj = item2.data.text;
                            k++;
                        }
                    });
                });
                if (data.length == 0) {
                    textSearch.setLoading(false);
                    textSearch.setValue('Объектов не найдено')
                } else {
                    textSearch.setLoading(false);
                    textSearch.hide().reset();
                    searchCombo.getStore().loadData(data);
                    clearSearchBut.show();
                    // автоматически раскрываем дерево, если пришёл уникальный результат
                    if (data.length === 1) {
                        searchCombo.fireEvent('select', searchCombo, [searchCombo.getStore().getAt(0)]);
                    } else {
                        searchCombo.show().focus().expand();
                    }
                }
            } else {
                Ext.Ajax.request({
                    url: './data/search.php',
                    params: {
                        'tree': tree.getItemId(),
                        'obj': textSearch.getValue(),
                    },
                    success: function(response, me) {
                        var data = Ext.decode(response.responseText);
                        // если пришёл пустой ответ то отображаем соотвествующий сигнал пользователю
                        if (data.failure) {
                            textSearch.setLoading(false);
                            if (data.msg === '') {
                                textSearch.setValue('Объектов не найдено')
                            } else {
                                Ext.Msg.alert('Сервер', 'Проблемы с сервером, повторите попытку позже');
                            }
                        } else {
                            textSearch.setLoading(false);
                            textSearch.hide().reset();
                            searchCombo.getStore().loadData(data);
                            clearSearchBut.show();
                            // автоматически раскрываем дерево, если пришёл уникальный результат
                            if (data.length === 1) {
                                searchCombo.fireEvent('select', searchCombo, [searchCombo.getStore().getAt(0)]);
                            } else {
                                searchCombo.show().focus().expand();
                            }
                        }
                    }
                });
            }
        }
    },
    // Функция очищает результаты поиска по нажатию кнопки
    onDeleteSearch: function (clearSearchBut) {
        var toolbar = clearSearchBut.up('toolbar'),
            textSearch = toolbar.down('#searchText'),
            searchCombo = toolbar.down('#searchCombo'),
            searchBut = toolbar.down('#searchButton');
        this.deleteSearchRes(searchCombo, textSearch, searchBut);
    },
    // очищаем поисковое поле, если меняется имя поля по которому осуществляется поиск
    changeFieldSearch: function (combo) {
        var textSearch = combo.up('toolbar').down('#searchText');
        textSearch.reset();
    },
    getSearchObj: function (combo, records) {
        let self = this,
            panelTree = combo.up('panel'),
            tabPanel = panelTree.down('tabpanel'),
            textSearch = combo.up('toolbar').down('#searchText'),
            searchBut = combo.up().down('#searchButton'),
            checkNode, textSearchNodeObj, node, pNode, tree;
        if (!tabPanel) {
            tree = panelTree.down('treepanel');
        } else {
            tree = Ext.ComponentQuery.query('treepanel[name=' + tabPanel.getActiveTab().name + ']')[0];
        }
        node = tree.getRootNode();
        // если панель с деревом не раскрыта, то раскрываем её
        //if (tree.collapsed === true || tree.collapsed === 'top')
        //    tree.setCollapsed(false);
        if (tree.getItemId() == 'btsCellTreeLoad') {
            let searchNode;
            if (typeof (records[0]) != 'undefined') {
                textSearchNodeObj = records[0].data;
            } else {
                textSearchNodeObj = records.data;
            }
            if (textSearchNodeObj.obj.substring(0, 3) == 'BTS') {
                Ext.Ajax.request({
                    url: './data/search.php',
                    params: {
                        'tree': 'btsSearch',
                        'obj': textSearchNodeObj.obj
                    },
                    success: function (response) {
                        let resp = Ext.decode(response.responseText);
                        if (resp.failure != true) {
                            // не передаём but, т.к. это поиск
                            self.extractBtsCell('slaTreeLoad', 'bts', resp[0].obj, textSearchNodeObj.obj, textSearchNodeObj.obj, textSearchNodeObj.obj);
                        }
                    }
                });
            } else {
                Ext.Ajax.request({
                    url: './data/search.php',
                    params: {
                        'tree': 'cellSearch',
                        'obj': textSearchNodeObj.obj
                    },
                    success: function (responseBts) {
                        var respBts = Ext.decode(responseBts.responseText);
                        Ext.Ajax.request({
                            url: './data/search.php',
                            params: {
                                'tree': 'btsSearch',
                                'obj': respBts[0].obj
                            },
                            success: function (response) {
                                let resp = Ext.decode(response.responseText);
                                if (resp.failure != true) {
                                    // не передаём but, т.к. это поиск
                                    self.extractBtsCell('slaTreeLoad', 'cell', resp[0].obj, respBts[0].obj, textSearchNodeObj.obj, textSearchNodeObj.obj);
                                }
                            }
                        });
                    }
                });
            }
            this.deleteSearchRes(combo, textSearch, searchBut);
        } else {
            let searchNode;
            node.eachChild(function (child) {
                if ((child.data.expanded == true) &&
                    (child.findChild('checked', true, true) == null)) {
                    child.collapse();
                }
            });
            if (typeof (records[0]) != 'undefined') {
                searchNode = node.findChild('text', records[0].data.obj, true);
            } else {
                searchNode = node.findChild('text', records.data.obj, true);
            }
            searchNode.set('checked', true);
            let pNode = searchNode.parentNode;
            pNode.expand();
            if (searchNode != null) {
                tree.selectPath(searchNode.getPath());
            }
            this.deleteSearchRes(combo, textSearch, searchBut);
        }
    },
    // добавляем использование горячих клавиш при поиске
    onKeyPressed: function (text, e) {
        var keyCode = e.keyCode,
            toolbar = text.up('toolbar'),
            searchBut = toolbar.down('#searchButton');

        switch (keyCode) {
            case 13:
                searchBut.fireEvent('click', searchBut);
                break;
            case 27:
                text.reset();
                break;
        }
    },
    deleteSearchRes: function (combo, textSearch, searchBut) {
        combo.hide().clearValue();
        combo.getStore().removeAll();
        textSearch.reset();
        if (textSearch.isHidden()) {
            textSearch.show();
        }
        searchBut.show();
    },
    // клик по кнопке "стрелка" - выделяем BTS и CELL внутри SLA, Геоюнитов, Регионов
    arrowButtonClick: function (but) {
        let toolbar = but.up('toolbar'),
            panelTree = toolbar.up('panel'),
            tabPanel = panelTree.down('tabpanel'),
            tree,
            treeChecked = [],
            selReg = [];
        treeName = tabPanel.getActiveTab().name;
        tree = Ext.ComponentQuery.query('treepanel[name=' + treeName + ']')[0];
        treeChecked = tree.getChecked();
        Ext.Array.each(treeChecked, function (item, i) {
            if (treeChecked[i].data.leaf == true) {
                selReg.push(treeChecked[i]);
            }
        });
        if (selReg.length > 0) {
            this.getObjects(but, selReg, treeName);
        }
    },

    // получаем список отмеченных чекбоксами объектов (SLA, геоюниты, регионы) 
    getObjects: function (but, selReg, treeName) {
        this.setSpinnerButton(but);
        let objArr = [],
            parentObjArr = [],
            btsArr = [],
            parentBtsArr = [],
            cellArr = [];
        Ext.Array.each(selReg, function (item, i) {
            if (treeName == 'slaTreeLoad') {
                objArr.push(selReg[i].data.name.substring(selReg[i].data.name.indexOf(":") + 1, selReg[i].data.name.length));
            } else if (treeName == 'geoTreeLoad') {
                objArr.push(selReg[i].data.name);
                parentObjArr.push(selReg[i].parentNode.data.name);
            } else if (treeName == 'regionTreeLoad') {
                objArr.push(selReg[i].data.name);
            }
        });
        // вызываем метод поиска bts и сот, входящих в отмеченные объекты
        this.getAjaxBtsCell(but, 0, treeName, objArr, parentObjArr, btsArr, parentBtsArr, cellArr);
    },

    // сразу раскрываем регион для случаев, если выбран регион или геоюнит 
    expandRegionForBts: function (i, regionArr, treeName) {
        let searchNode,
            tree = Ext.ComponentQuery.query('treepanel[name=btsCellTreeLoad]')[0],
            node = tree.getRootNode();
        searchNode = node.findChild('text', regionArr[i], true);
        if (searchNode != null) {
            if (searchNode.data.expanded == false) {
                searchNode.data.expandRegion = false;
                if (treeName == 'regionTreeLoad') {
                    searchNode.set('checked', true);
                }
                searchNode.expand();
            }
        }
    },

    // формируем URL для ajax-запроса на поиск bts и сот внутри SLA
    getUrlString: function (treeName) {
        let callString, urlString;
        if (treeName == 'slaTreeLoad') {
            callString = 'btsCell';
        } else if (treeName == 'geoTreeLoad') {
            callString = 'geoBtsCell';
        } else if (treeName == 'regionTreeLoad') {
            callString = 'regionBtsCell';
        }
        urlString = Global.getUrl('load', callString);
        return urlString;
    },

    // получаем bts и соты, входящие в отмеченные объекты
    getAjaxBtsCell: function (but, i, treeName, objArr, parentObjArr, btsArr, parentBtsArr, cellArr) {
        let self = this;
        if (treeName == 'geoTreeLoad') {
            this.expandRegionForBts(i, parentObjArr, treeName);
        } else if (treeName == 'regionTreeLoad') {
            this.expandRegionForBts(i, objArr, treeName);
        }
        Ext.Ajax.request({
            url: this.getUrlString(treeName),
            method: 'POST',
            timeout: 60000,
            params: {
                obj: objArr[i]
            },
            success: function (response, opts) {
                var resp = Ext.decode(response.responseText);
                if (resp.failure != true) {
                    Ext.Array.each(resp.data, function (item, j) {
                        if (resp.data[j].EXTERNAL_KEY.substring(0, 3) == 'BTS') {
                            btsArr.push(resp.data[j].EXTERNAL_KEY);
                            if (treeName == 'geoTreeLoad') {
                                parentBtsArr.push(parentObjArr[i]);
                            } else if (treeName == 'regionTreeLoad') {
                                parentBtsArr.push(objArr[i]);
                            }
                        } else {
                            cellArr.push(resp.data[j].EXTERNAL_KEY);
                        }
                    });
                    if (i < objArr.length - 1) {
                        self.getAjaxBtsCell(but, i + 1, treeName, objArr, parentObjArr, btsArr, parentBtsArr, cellArr);
                    } else {
                        if (((btsArr.length + cellArr.length) > 5000) ||
                            ((btsArr.length + cellArr.length) == 0)) {
                            self.backIfError(but);
                        } else {
                            self.loadBtsCell(but, treeName, btsArr, parentBtsArr, cellArr);
                        }
                    }
                }
            },
            error: function () {
                self.backIfError(but);
            }
        });
    },

    // выгружаем bts и соты, входящие в объекты
    loadBtsCell: function (but, treeName, btsArr, parentBtsArr, cellArr) {
        let self = this;
        // выгружаем bts
        Ext.Array.each(btsArr, function (item, i) {
            if (treeName == 'slaTreeLoad') {
                Ext.Ajax.request({
                    url: './data/search.php',
                    params: {
                        'tree': 'btsSearch',
                        'obj': btsArr[i]
                    },
                    success: function (response) {
                        let resp = Ext.decode(response.responseText);
                        if (resp.failure != true) {
                            // вызываем метод извлечения BTS
                            self.extractBtsCell(treeName, 'bts', resp[0].obj, btsArr[i], btsArr, btsArr[i], but);
                        }
                    }
                });
            } else if ((treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) {
                // вызываем метод извлечения BTS
                self.extractBtsCell(treeName, 'bts', parentBtsArr[i], btsArr[i], btsArr, btsArr[i], but);

            }
        });

        // выгружаем соты для sla
        if (treeName == 'slaTreeLoad') {
            Ext.Array.each(cellArr, function (item, i) {
                Ext.Ajax.request({
                    url: './data/search.php',
                    params: {
                        'tree': 'cellSearch',
                        'obj': cellArr[i]
                    },
                    success: function (responseBts) {
                        let respBts = Ext.decode(responseBts.responseText);
                        if (respBts.failure != true) {
                            Ext.Ajax.request({
                                url: './data/search.php',
                                params: {
                                    'tree': 'btsSearch',
                                    'obj': respBts[0].obj
                                },
                                success: function (responseReg) {
                                    let respReg = Ext.decode(responseReg.responseText);
                                    if (respReg.failure != true) {
                                        // вызываем метод извлечения CELL
                                        self.extractBtsCell(treeName, 'cell', respReg[0].obj, respBts[0].obj, cellArr, cellArr[i], but);
                                    }
                                }
                            });
                        }
                    }
                });
            });
        }
    },

    // извлекаем BTS и CELL
    extractBtsCell: function (treeName, btsOrCellForSla, searchObj, appendObj, arr, findedObj, but) {
        if (but != undefined) {
            this.setSpinnerButton(but);
        }
        let self = this,
            searchNode,
            textSearchNode = {},
            tree = Ext.ComponentQuery.query('treepanel[name=btsCellTreeLoad]')[0],
            node = tree.getRootNode(),
            cellIsPressed = Ext.ComponentQuery.query('button[itemId=arrowButtonCell]')[0].pressed;
        searchNode = node.findChild('text', searchObj, true);
        if (searchNode != null) {
            if (searchNode.data.expanded == false) {
                searchNode.data.expandRegion = false;
                searchNode.expand();
            }
            if ((searchNode.firstChild != null) &&
                (searchNode.firstChild.data.text == 'Идёт загрузка...')) {
                searchNode.firstChild.remove(true);
            }
            textSearchNode.id = appendObj;
            textSearchNode.name = appendObj;
            textSearchNode.text = appendObj;
            let nodeToAppend;
            if (searchNode.findChild('text', appendObj, true) == null) {
                nodeToAppend = searchNode.createNode(textSearchNode);
                searchNode.appendChild(nodeToAppend);
                if (((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'bts')) ||
                    (treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) {
                    let appendCell = {
                        leaf: true,
                        text: 'Идёт загрузка...'
                    };
                    let nodeToAppendCell = nodeToAppend.createNode(appendCell);
                    nodeToAppend.appendChild(nodeToAppendCell);
                }
            } else {
                nodeToAppend = node.findChild('text', appendObj, true);
            }
            if (((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'bts')) ||
                (treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) {
                nodeToAppend.set('checked', true);
                nodeToAppend.set('leaf', false);
            }
            if ((nodeToAppend.findChild('checked', true, true) == null) &&
                (((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'bts')) ||
                    (((treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) &&
                        (cellIsPressed == false)))) {
                nodeToAppend.set('expandBts', true);
            } else if (((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'cell')) ||
                ((treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) &&
                (cellIsPressed == true)) {
                if ((nodeToAppend.firstChild != null) &&
                    (nodeToAppend.firstChild.data.text == 'Идёт загрузка...')) {
                    nodeToAppend.firstChild.remove(true);
                }
                Ext.Ajax.request({
                    url: './data/main.php?type=BTS_CELL_LOAD_TREE_ADD_CELL',
                    method: 'POST',
                    timeout: 600000,
                    params: {
                        bts: nodeToAppend.id
                    },
                    success: function (response) {
                        let resp = Ext.decode(response.responseText),
                            cellToAppend;
                        Ext.Array.each(resp, function (item, j) {
                            if (nodeToAppend.findChild('text', resp[j].name, true) == null) {
                                cellToAppend = nodeToAppend.createNode(resp[j]);
                                nodeToAppend.appendChild(cellToAppend);
                                if ((treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad')) {
                                    nodeToAppend.set('expandBts', false);
                                    nodeToAppend.expand();
                                    cellToAppend.set('checked', true);
                                    if (nodeToAppend.data.name == arr[arr.length - 1]) {
                                        if (cellToAppend.data.name == resp[resp.length - 1].name) {
                                            tree.selectPath(cellToAppend.getPath());
                                            self.backArrowButton(but);
                                        }
                                    }
                                }
                            }
                        });
                        if ((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'cell')) {
                            let findedNode = nodeToAppend.findChild('text', findedObj, true);
                            if (findedNode != null) {
                                if (nodeToAppend.data.checked == null) {
                                    nodeToAppend.set('checked', false);
                                }
                                nodeToAppend.set('expandBts', false);
                                nodeToAppend.expand();
                                findedNode.set('checked', true);
                                if ((findedNode.data.name == arr[arr.length - 1]) || (findedNode.data.name == arr)) {
                                    tree.selectPath(findedNode.getPath());
                                    self.backArrowButton(but);
                                }
                            }
                        }
                    },
                    error: function (response, status) {
                        self.backIfError(but);
                    }
                });
            }
            if ((((treeName == 'slaTreeLoad') && (btsOrCellForSla == 'bts')) ||
                    (((treeName == 'geoTreeLoad') || (treeName == 'regionTreeLoad'))) &&
                    (cellIsPressed == false)) && ((nodeToAppend.data.name == arr[arr.length - 1]) ||
                    (nodeToAppend.data.name == arr)
                )) {
                tree.selectPath(nodeToAppend.getPath());
                self.backArrowButton(but);
            }
        }
    },

    setSpinnerButton: function (but) {
        but.disabled = true;
        but.setTooltip('Выгрузка объектов...');
        but.setIcon('resources/images/spinner-icon.gif');
        but.setBorder(false);
    },

    backArrowButton: function (but) {
        if (but != undefined) {
            but.disabled = false;
            but.setTooltip('BTS and CELL inside');
            but.setIcon('resources/images/arrow-icon.png');
            but.setBorder(true);
        }
    },

    backIfError: function (but) {
        Ext.Msg.alert('Полученное количество BTS / CELL слишком велико. ',
            'Выберите меньше объектов для выгрузки BTS / CELL');
        this.backArrowButton(but);
        btsCellStoreLoad.reload();

    }
});