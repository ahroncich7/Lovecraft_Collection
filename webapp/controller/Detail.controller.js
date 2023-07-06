sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	JSONModel,
	Fragment) {
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

                this._setLocalModelBooks(oArgs.authorID);


            },

            _setLocalModelBooks: function (authorId) {
                var that = this;
                var sPathBooks = "/AUTHORSet(" + authorId + ")/toBooks";
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

            onDelete: function (oEvent) {
                var bookId = oEvent.getSource().getBindingContext("BOOKS").getObject().Bookid;
                var authorId = oEvent.getSource().getBindingContext("BOOKS").getObject().Athrid;
                var oModel = this.getView().getModel();
                var sPath = "/BOOKSet(" + bookId + ")"
                oModel.remove(sPath, {
                    success: function (data, response) {

                    },
                    error: function (error) {
                        console.error(error)
                    }
                })

                this._setLocalModelBooks(authorId)
            },

            onAdd: function(){
                this._onOpenDialog();
            },

            _onOpenDialog: function () {
                var oView = this.getView();
                var that = this;

                if (!this.byId("openDialogBooks")) {
                    Fragment.load(
                        {
                            id: oView.getId(),
                            name: "lvcrft.lovecraftcollection.view.fragments.BookForm",
                            controller: this
                        }).then(
                            function (oDialog) {
                                oView.addDependent(oDialog);
                                oDialog.open();
                                oDialog.attachAfterClose(function () {
                                    oDialog.destroy();
                                })
                            }
                        )
                }
            },

            createBook: function(oEvent){
                var authorId = oEvent.getSource().getBindingContext().getObject().Athrid;
                var oModel = this.getView().getModel();
                var sPath = "/BOOKSet";
                var oBook = {
                    "Athrid": authorId,
                    "Title" : this.byId("titleInput").getValue(),
                    "PubYear" : this.byId("pubYearInput").getValue(),
                    "Publisher" : this.byId("pubInput").getValue(),
                    "Review" : this.byId("reviewInput").getValue(),
                }
                oModel.create(sPath, oBook, {
                    success: function (data, response) {

                    },
                    error: function (error) {
                        console.error(error)
                    }
                })

                this._setLocalModelBooks(authorId);
                this.byId("openDialogBooks").close();

            },

            onCancel: function(){
                this.byId("openDialogBooks").close()
            }



        });
    });
