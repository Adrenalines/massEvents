Ext.define("Global", {
  singleton: true,
  alias: "global",
  projectName: "MassEvents",
  server: "/",
  php: "./data/",
  chart: "chart.php?type=",
  load: "load.php?type=",
  getUrl: function(ui, type) {
    switch (ui) {
      case "chart":
        return this.php + this.chart + type;
      case "load":
        return this.php + this.load + type;
    }
  },
  getLastChange: function() {
    let obj = {},
      self = this;
    obj.version = "1.0.0.0";
    obj.dateChange = "04-04-2019";
    obj.lastChange = "<br><br> - Первая версия модуля";
    obj.changeLog =
      "<br><b>1.0.0.0 (01-04-2019):</b>\n\
                           <br><br> - Начата работа над модулем";
    return obj;
  },
  deleteEmptyByTechnology(kpiType) {
    Ext.Ajax.request({
      url: Global.getUrl("load", "deleteEmpty"),
      method: "POST",
      timeout: 240000,
      params: {
        kpiType: kpiType,
        user: Global.resp.USER
      },
      success: function(resp) {
        if (load != undefined) {
          load.refreshGrid();
        }
      }
    });
  },

  deleteEmptyRows: function() {
    this.deleteEmptyByTechnology("2g");
    this.deleteEmptyByTechnology("3g");
    this.deleteEmptyByTechnology("4g");
    this.deleteEmptyByTechnology("Sh");
  }
});
