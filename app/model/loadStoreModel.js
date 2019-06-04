Ext.define("MassEvents.model.loadStoreModel", {
  extend: "Ext.data.Model",

  //  alias: "store.loadStore",

  fields: [
    {
      name: "TCH_Traffic",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "SDCCH_Traffic",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CSSR",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "BSS_Availability_Rate",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Drop_Call_Rate",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "SDCCH_Blocking_Rate",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "TCH_Serv_Blocking_Rate",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CELL_Count_2G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Calls_Count_2G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Sp",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Drop_Sp",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CSSR_Sp",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Block_Sp",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "RAN_Availability",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Drop_Data",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CSSR_Data",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Block_Data",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CELL_Count_3G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Calls_Count_3G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_3G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_DL_3G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_UL_3G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "HSDPA_USER_DC_THR",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "HSUPA_USER_THR",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "DpH_UE",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CSSR_LTE",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "LTE_RAN_Avail",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_4G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_DL_4G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Data_UL_4G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "UE_Throughput_DL",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "UE_Throughput_UL",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "LTE_User_Max",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CELL_Count_4G",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_VoLTE",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "DpH_VoLTE_UE",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CSSR_VoLTE",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "E_RAB_Retainability_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "InitialEPSBEstabSR_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "CellAvailability_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_DL_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Traff_UL_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Downlink_Thp_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    },
    {
      name: "Uplink_Thp_Sharing",
      convert: function(value) {
        return value != -9999 ? value : "";
      }
    }
  ]
});
