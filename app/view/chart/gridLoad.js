Ext.define("MassEvents.view.chart.gridLoad", {
  extend: "Ext.panel.Panel",
  title: "Прогресс выгрузки",
  xtype: "loadGrid",
  dock: "top",
  ui: "top",
  layout: "fit",
  items: [
    {
      xtype: "tabpanel",
      layout: "fit",
      flex: 1,
      items: [
        {
          xtype: "panel",
          title: "&emsp; 2G &emsp;",
          layout: "fit",
          flex: 1,
          bbar: [
            {
              xtype: "tbfill"
            },
            {
              xtype: "pagingtoolbar",
              id: "loadGridTable2gBar",
              ui: "footer",
              displayInfo: true
            },
            {
              xtype: "tbfill"
            }
          ],
          items: [
            {
              xtype: "grid",
              id: "loadGridTable2g",
              titleAlign: "center",
              viewConfig: {
                enableTextSelection: true
              },
              plugins: "gridfilters",
              columnLines: true,
              columns: [
                { xtype: "rownumberer", width: 30, renderer: false },
                {
                  header: "Managed Object",
                  height: 40,
                  dataIndex: "Managed_Object",
                  style: "font-weight: bold",
                  width: 200,
                  filter: { type: "string" }
                },
                {
                  header: "STime",
                  dataIndex: "STime",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  filter: { type: "date" }
                },
                {
                  header: "TCH Traffic",
                  hidden: true,
                  dataIndex: "TCH_Traffic",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "SDCCH Traffic",
                  hidden: true,
                  dataIndex: "SDCCH_Traffic",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CSSR",
                  hidden: true,
                  dataIndex: "CSSR",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "BSS Avail Rate",
                  hidden: true,
                  dataIndex: "BSS_Availability_Rate",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Drop Call Rate",
                  hidden: true,
                  dataIndex: "Drop_Call_Rate",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "SDCCH<br />Blocking Rate",
                  hidden: true,
                  dataIndex: "SDCCH_Blocking_Rate",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "TCH Serv<br />Blocking Rate",
                  hidden: true,
                  dataIndex: "TCH_Serv_Blocking_Rate",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CELL Count",
                  hidden: true,
                  dataIndex: "CELL_Count_2G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Calls Count",
                  hidden: true,
                  dataIndex: "Calls_Count_2G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                }
              ]
            }
          ]
        },
        {
          xtype: "panel",
          title: "&emsp; 3G &emsp;",
          layout: "fit",
          flex: 1,
          bbar: [
            {
              xtype: "tbfill"
            },
            {
              xtype: "pagingtoolbar",
              id: "loadGridTable3gBar",
              ui: "footer",
              displayInfo: true
            },
            {
              xtype: "tbfill"
            }
          ],
          items: [
            {
              xtype: "grid",
              id: "loadGridTable3g",
              titleAlign: "center",
              viewConfig: {
                enableTextSelection: true
              },
              plugins: "gridfilters",
              columnLines: true,
              columns: [
                { xtype: "rownumberer", width: 30, renderer: false },
                {
                  header: "Managed Object",
                  height: 40,
                  dataIndex: "Managed_Object",
                  style: "font-weight: bold",
                  width: 200,
                  filter: { type: "string" }
                },
                {
                  header: "STime",
                  dataIndex: "STime",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  filter: { type: "date" }
                },
                {
                  header: "Traff Sp",
                  hidden: true,
                  dataIndex: "Traff_Sp",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Drop Sp",
                  hidden: true,
                  dataIndex: "Drop_Sp",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CSSR Sp",
                  hidden: true,
                  dataIndex: "CSSR_Sp",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Block Sp",
                  hidden: true,
                  dataIndex: "Block_Sp",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "RAN Availability",
                  hidden: true,
                  dataIndex: "RAN_Availability",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Drop Data",
                  hidden: true,
                  dataIndex: "Drop_Data",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CSSR Data",
                  hidden: true,
                  dataIndex: "CSSR_Data",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Block Data",
                  hidden: true,
                  dataIndex: "Block_Data",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CELL Count 3G",
                  hidden: true,
                  dataIndex: "CELL_Count_3G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Calls Count 3G",
                  hidden: true,
                  dataIndex: "Calls_Count_3G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data 3G",
                  hidden: true,
                  dataIndex: "Traff_Data_3G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data DL 3G",
                  hidden: true,
                  dataIndex: "Traff_Data_DL_3G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data UL 3G",
                  hidden: true,
                  dataIndex: "Traff_Data_UL_3G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "HSDPA USER<br />DC THR",
                  hidden: true,
                  dataIndex: "HSDPA_USER_DC_THR",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "HSUPA USER<br />THR",
                  hidden: true,
                  dataIndex: "HSUPA_USER_THR",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                }
              ]
            }
          ]
        },
        {
          xtype: "panel",
          title: "&emsp; 4G &emsp;",
          layout: "fit",
          flex: 1,
          bbar: [
            {
              xtype: "tbfill"
            },
            {
              xtype: "pagingtoolbar",
              id: "loadGridTable4gBar",
              ui: "footer",
              displayInfo: true
            },
            {
              xtype: "tbfill"
            }
          ],
          items: [
            {
              xtype: "grid",
              id: "loadGridTable4g",
              titleAlign: "center",
              viewConfig: {
                enableTextSelection: true
              },
              plugins: "gridfilters",
              columnLines: true,
              columns: [
                { xtype: "rownumberer", width: 30, renderer: false },
                {
                  header: "Managed Object",
                  height: 40,
                  dataIndex: "Managed_Object",
                  style: "font-weight: bold",
                  width: 200,
                  filter: { type: "string" }
                },
                {
                  header: "STime",
                  dataIndex: "STime",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  filter: { type: "date" }
                },
                {
                  header: "DpH UE",
                  hidden: true,
                  dataIndex: "DpH_UE",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CSSR LTE",
                  hidden: true,
                  dataIndex: "CSSR_LTE",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "LTE RAN Avail",
                  hidden: true,
                  dataIndex: "LTE_RAN_Avail",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data 4G",
                  hidden: true,
                  dataIndex: "Traff_Data_4G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data<br />DL 4G",
                  hidden: true,
                  dataIndex: "Traff_Data_DL_4G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Data<br />UL 4G",
                  hidden: true,
                  dataIndex: "Traff_Data_UL_4G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "UE Throughput<br />DL",
                  hidden: true,
                  dataIndex: "UE_Throughput_DL",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "UE Throughput<br />UL",
                  hidden: true,
                  dataIndex: "UE_Throughput_UL",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "LTE User Max",
                  hidden: true,
                  dataIndex: "LTE_User_Max",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CELL Count 4G",
                  hidden: true,
                  dataIndex: "CELL_Count_4G",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff VoLTE",
                  hidden: true,
                  dataIndex: "Traff_VoLTE",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "DpH VoLTE UE",
                  hidden: true,
                  dataIndex: "DpH_VoLTE_UE",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CSSR VoLTE",
                  hidden: true,
                  dataIndex: "CSSR_VoLTE",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                }
              ]
            }
          ]
        },
        {
          xtype: "panel",
          title: "4G Sharing",
          layout: "fit",
          flex: 1,
          bbar: [
            {
              xtype: "tbfill"
            },
            {
              xtype: "pagingtoolbar",
              id: "loadGridTable4gShrBar",
              ui: "footer",
              displayInfo: true
            },
            {
              xtype: "tbfill"
            }
          ],
          items: [
            {
              xtype: "grid",
              id: "loadGridTable4gShr",
              titleAlign: "center",
              viewConfig: {
                enableTextSelection: true
              },
              plugins: "gridfilters",
              columnLines: true,
              columns: [
                { xtype: "rownumberer", width: 30, renderer: false },
                {
                  header: "Managed Object",
                  height: 40,
                  dataIndex: "Managed_Object",
                  style: "font-weight: bold",
                  width: 200,
                  filter: { type: "string" }
                },
                {
                  header: "STime",
                  dataIndex: "STime",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  filter: { type: "date" }
                },
                {
                  header: "E-RAB Retainability<br />Sharing",
                  hidden: true,
                  dataIndex: "E_RAB_Retainability_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "InitialEPSBEstabSR<br />Sharing",
                  hidden: true,
                  dataIndex: "InitialEPSBEstabSR_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 130,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "CellAvailability<br />Sharing",
                  hidden: true,
                  dataIndex: "CellAvailability_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff Sharing",
                  hidden: true,
                  dataIndex: "Traff_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff DL Sharing",
                  hidden: true,
                  dataIndex: "Traff_DL_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Traff UL Sharing",
                  hidden: true,
                  dataIndex: "Traff_UL_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Downlink Thp<br />Sharing",
                  hidden: true,
                  dataIndex: "Downlink_Thp_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                },
                {
                  header: "Uplink Thp<br />Sharing",
                  hidden: true,
                  dataIndex: "Uplink_Thp_Sharing",
                  align: "center",
                  style: "font-weight: bold",
                  width: 110,
                  xtype: "numbercolumn",
                  format: "0.00",
                  filter: { type: "number" }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});
