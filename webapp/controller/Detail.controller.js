sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel) {
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

                    path: "/AUTHORSet(" + oArgs.authorID + ")",

                    events: {

                        dataRequested: function () {

                            oView.setBusy(true);

                        },

                        dataReceived: function () {

                            oView.setBusy(false);

                        }

                    }

                });

                // DEFINE MODEL PARA EL CASO DE LOS LIBROS

                var that = this;
                var sPathBooks = "/AUTHORSet(" + oArgs.authorID + ")/toBooks";
                var oDataModel = this.getView().getModel();
                oDataModel.read(sPathBooks, {

                    success: function (response) {


                        that.getView().setModel(new JSONModel(response.results), "BOOKS")
                    },
                    error: function (error) {
                        console.log(error);
                    }

                })


            },

            onPress: function (oEvent) {
                let view = this.getView()
            }


        });
    });
