sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MLibrary) {
        "use strict";
        var URLHelper = MLibrary.URLHelper;

        return Controller.extend("lvcrft.lovecraftcollection.controller.Master", {
            onInit: function () {

            },

            handleLinkObjectAttributePress : function (oEvent) {
                URLHelper.redirect("https://es.wikipedia.org/wiki/Mitos_de_Cthulhu", true);
            }
        });
    });
