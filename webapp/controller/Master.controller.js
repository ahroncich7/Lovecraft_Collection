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

            onAuthorPress: function (oEvent) {
                alert("AHHH")
                let id = oEvent.getSource().getBindingContext("Authors").getProperty("Athrid")
                alert(id)

            },

            handleLinkObjectAttributePress: function (oEvent) {
                URLHelper.redirect("https://es.wikipedia.org/wiki/Mitos_de_Cthulhu", true);
            }
        });
    });
