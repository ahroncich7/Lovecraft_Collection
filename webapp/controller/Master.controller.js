sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MLibrary) {
        "use strict";

        return Controller.extend("lvcrft.lovecraftcollection.controller.Master", {
            onInit: function () {

            },

            onSelectionChange: function(oEvent){
                let name = oEvent.getParameter("listItem").getBindingContext("Authors").getObject().Name
                alert(name)
            },

            onAuthorPress: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                var clickedAuthorId = oEvent.getSource().getBindingContext("Authors").getProperty("Athrid");
                
                oRouter.navTo("detail", {

                    authorID: clickedAuthorId


                });

            }

        });
    });
