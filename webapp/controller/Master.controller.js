sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        Fragment,
        JSONModel,
        Filter, FilterOperator) {
        "use strict";

        return Controller.extend("lvcrft.lovecraftcollection.controller.Master", {
            onInit: function () {



            },


            onBeforeRendering: function () {
                this._setLocalModel()

            },

            _setLocalModel: function () {
                var thatView = this.getView();
                var oModel = this.getView().getModel();
                oModel.read("/AUTHORSet", {
                    success: function (response) {

                        thatView.setModel(new JSONModel(response.results), "AUTHORS")

                    },
                    error: function (error) {
                        console.error(error);
                    }
                })
            },

            handleSearch: function (evt) {
                var filters = [];
                var combinedFilter = []
                var query = evt.getParameter("newValue");
                if (query && query.length > 0) {
                    filters.push(new Filter({
                        path: "Name",
                        operator: FilterOperator.Contains,
                        value1: query
                    })
                    )

                    filters.push(new Filter({
                        path: "Lastname",
                        operator: FilterOperator.Contains,
                        value1: query
                    })
                    )

                    combinedFilter = new Filter({
                        filters: filters,
                        and: false
                    });
                }


                var list = this.getView().byId("list");
                var binding = list.getBinding("items");
                binding.filter(combinedFilter);
            },

            onSelectionChange: function (oEvent) {
                this.selectedAuthor = oEvent.getParameter("listItem").getBindingContext("AUTHORS").getObject();
            },

            onAuthorPress: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                var clickedAuthorId = oEvent.getSource().getBindingContext("AUTHORS").getProperty("Athrid");

                oRouter.navTo("detail", {

                    authorID: clickedAuthorId


                });

            },

            onAdd: function (oEvent) {
                this._onOpenDialog()
            },

            _onOpenDialog: function () {
                var oView = this.getView();
                var that = this;

                if (!this.byId("openDialog")) {
                    Fragment.load(
                        {
                            id: oView.getId(),
                            name: "lvcrft.lovecraftcollection.view.fragments.Form",
                            controller: this
                        }).then(
                            function (oDialog) {
                                oView.addDependent(oDialog);
                                oDialog.open();
                                oDialog.attachAfterClose(function () {
                                    oDialog.destroy();
                                    that.selectedAuthor=undefined;
                                    that.byId("list").removeSelections()
                                })

                                that.byId("closeBtn").attachPress(that._createAuthor, that);
                            }
                        )
                } else {
                    this.byId("openDialog").open();
                    this.byId("closeBtn").attachPress(this._createAuthor, this);
                    oDialog.attachAfterClose(function () {
                        oDialog.destroy();
                        
                    })


                }

            },



            _onOpenDialogUpdate: function () {
                var oView = this.getView();
                var that = this;

                if (!this.byId("openDialog")) {
                    Fragment.load(
                        {
                            id: oView.getId(),
                            name: "lvcrft.lovecraftcollection.view.fragments.Form",
                            controller: this
                        }).then(
                            function (oDialog) {
                                oView.addDependent(oDialog);
                                oDialog.open();
                                oDialog.attachAfterClose(function () {
                                    oDialog.destroy();
                                    that.selectedAuthor=undefined;
                                    that.byId("list").removeSelections()
                                })

                                // CARGA DATOS EN EL DIALOG

                                that.byId("idInput").setValue(that.selectedAuthor.Athrid);
                                that.byId("nameInput").setValue(that.selectedAuthor.Name);
                                that.byId("lastNameInput").setValue(that.selectedAuthor.Lastname);
                                that.byId("nationalityInput").setValue(that.selectedAuthor.Nationality);
                                that.byId("birthDateInput").setValue(that.selectedAuthor.Birth);
                                that.byId("deathDateInput").setValue(that.selectedAuthor.Death);

                                that.byId("closeBtn").attachPress(that._updateAuthor, that);
                            }
                        )
                } else {

                    this.byId("openDialog")
                    // this.byId("openDialog").open();

                    // // CARGA DATOS EN EL DIALOG

                    // this.byId("idInput").setValue(this.selectedAuthor.Athrid);
                    // this.byId("nameInput").setValue(this.selectedAuthor.Name);
                    // this.byId("lastNameInput").setValue(this.selectedAuthor.Lastname);
                    // this.byId("nationalityInput").setValue(this.selectedAuthor.Nationality);
                    // this.byId("birthDateInput").setValue(this.selectedAuthor.Birth);
                    // this.byId("deathDateInput").setValue(this.selectedAuthor.Death);

                    // this.byId("closeBtn").attachPress(this._updateAuthor, this);


                }

            },

            _closeDialog: function () {

                var dialog = this.byId("openDialog");
                this.selectedAuthor = undefined
                dialog.destroy();
            },


            _createAuthor: function () {
                var oIdInput = this.byId("idInput");
                var oNameInput = this.byId("nameInput");
                var oLastNameInput = this.byId("lastNameInput");
                var oNationalityInput = this.byId("nationalityInput");
                var oBirthDateInput = this.byId("birthDateInput");
                var oDeathDateInput = this.byId("deathDateInput");

                var oAuthor = {

                    "Athrid": Number(oIdInput.getValue()),
                    "Name": oNameInput.getValue(),
                    "Lastname": oLastNameInput.getValue(),
                    "Nationality": oNationalityInput.getValue(),
                    "Birth": oBirthDateInput.getValue(),
                    "Death": oDeathDateInput.getValue()
                };

                let sPath = "/AUTHORSet";
                var OData = this.getView().getModel()
                OData.create(sPath, oAuthor, {
                    success: function (response) {

                    },
                    error: function (error) {
                        console.error(error)
                    }
                });
                this._closeDialog();
                this._setLocalModel()
            },

            onChange: function () {

                if (this.selectedAuthor) {
                    this._onOpenDialogUpdate();
                }
            },

            _updateAuthor: function (oEvent) {

                var oIdInput = this.byId("idInput");
                var oNameInput = this.byId("nameInput");
                var oLastNameInput = this.byId("lastNameInput");
                var oNationalityInput = this.byId("nationalityInput");
                var oBirthDateInput = this.byId("birthDateInput");
                var oDeathDateInput = this.byId("deathDateInput");

                var oAuthor = {

                    "Athrid": Number(oIdInput.getValue()),
                    "Name": oNameInput.getValue(),
                    "Lastname": oLastNameInput.getValue(),
                    "Nationality": oNationalityInput.getValue(),
                    "Birth": oBirthDateInput.getValue(),
                    "Death": oDeathDateInput.getValue()
                };

                var OData = this.getView().getModel()

                var id = this.selectedAuthor.Athrid

                var sPath = "/AUTHORSet(" + id + ")";
                OData.update(sPath, oAuthor, {
                    success: function (data, response) {

                    },
                    error: function (error) {
                        console.error(error);
                    }
                });

                this._closeDialog();
                this._setLocalModel()



            },


            onDelete: function (oEvent) {
                if (this.selectedAuthor) {
                    this._deleteAuthor(this.selectedAuthor.Athrid)
                }
            },

            _deleteAuthor: function (authorID) {

                var sPath = "/AUTHORSet(" + authorID + ")"
                var oDataModel = this.getView().getModel()

                oDataModel.remove(sPath, {
                    success: function (data, response) {

                    },
                    error: function (error) {
                        console.error(error)
                    }
                })
                this._setLocalModel()

            }
        })
    })
