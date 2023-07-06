sap.ui.define(
    ["sap/m/MessageToast",
        "sap/m/MessageBox",



    ], function (
        MessageToast,
        MessageBox

    ) {
    "use strict";

    const Commons = {
        successAlert: function (msg) {

            MessageToast.show(msg);
        },

        errorAlert: function (msg) {
            MessageBox.error(msg);
        }

    }
    return Commons
}, true);