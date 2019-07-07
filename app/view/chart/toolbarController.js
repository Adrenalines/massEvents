Ext.define("MassEvents.view.chart.toolbarController", {
  extend: "Ext.app.ViewController",
  // requires: ["MassEvents.view.chart.loadMainController"],
  alias: "controller.load-toolbar",

  onShiftData: function(but) {
    var sd = this.lookupReference("startDate"),
      ed = this.lookupReference("endDate"),
      val = but.inputValue,
      sdVal = sd.getValue(),
      sdNewVal = new Date(sdVal.setDate(sdVal.getDate() + parseInt(val))),
      sdVal = new Date(sd.getValue() + parseInt(val)),
      edVal = ed.getValue(),
      edNewVal = new Date(edVal.setDate(edVal.getDate() + parseInt(val))),
      edVal = new Date(ed.getValue() + parseInt(val));
    sd.setValue(sdNewVal);
    ed.setValue(edNewVal);
  },
  toggleBut: function(segmented, button, isPressed) {
    var periodbuttons = this.lookupReference("periodValues");

    periodbuttons.cascade(function(item) {
      if (item.isXType("button")) {
        item.setDisabled(true);
        if (button.inputValue.indexOf("[" + item.inputValue + "]") !== -1) {
          item.setDisabled(false);
        }
        if (item.inputValue === button.defaultPeriod) {
          item.setPressed(true);
        }
      }
    });
  },
  togglePeriodBut: function(segmented, button, isPressed) {
    var enddatefield = this.lookupReference("endDate"),
      startdatefield = this.lookupReference("startDate"),
      adddays = button.inputValue,
      dt = enddatefield.getValue(),
      dInt = 86400000 * Math.abs(adddays);
    startdatefield.setValue(new Date(new Date(dt) - dInt));
  },

  onShiftDataLoad: function(but) {
    var sd = this.lookupReference("startDateLoad"),
      ed = this.lookupReference("endDateLoad"),
      val = but.inputValue,
      sdVal = sd.getValue(),
      sdNewVal = new Date(sdVal.setDate(sdVal.getDate() + parseInt(val))),
      sdVal = new Date(sd.getValue() + parseInt(val)),
      edVal = ed.getValue(),
      edNewVal = new Date(edVal.setDate(edVal.getDate() + parseInt(val))),
      edVal = new Date(ed.getValue() + parseInt(val));
    sd.setValue(sdNewVal);
    ed.setValue(edNewVal);
  },

  toggleButLoad: function(segmented, button, isPressed) {
    var periodbuttons = this.lookupReference("periodValuesLoad");

    periodbuttons.cascade(function(item) {
      if (item.isXType("button")) {
        item.setDisabled(true);
        if (button.inputValue.indexOf("[" + item.inputValue + "]") !== -1) {
          item.setDisabled(false);
        }
        if (item.inputValue === button.defaultPeriod) {
          item.setPressed(true);
        }
      }
    });

    this.getView()
      .up("load")
      .getController()
      .reloadAllPreviousStores();
  },

  togglePeriodButLoad: function(segmented, button, isPressed) {
    var enddatefield = this.lookupReference("endDateLoad"),
      startdatefield = this.lookupReference("startDateLoad"),
      adddays = button.inputValue,
      dt = enddatefield.getValue(),
      dInt = 86400000 * Math.abs(adddays);
    startdatefield.setValue(new Date(new Date(dt) - dInt));
  },

  loadKPI: function(button) {
    this.getView()
      .up("load")
      .getController()
      .loadKPI(button, this.getReferences());
  }
});
