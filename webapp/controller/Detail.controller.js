sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("lvcrft.lovecraftcollection.controller.Detail", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {

                var oArgs, oView;

                oArgs = oEvent.getParameter("arguments");

                oView = this.getView();

                oView.bindElement({

                    path: "Authors>/authors/" + oArgs.authorID+"",

                    events: {

                        dataRequested: function () {

                            oView.setBusy(true);

                        },

                        dataReceived: function () {

                            oView.setBusy(false);

                        }

                    }

                });

            },

            onPress: function(oEvent){
                let view = this.getView()
            }


        });
    });
