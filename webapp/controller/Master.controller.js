sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "lvcrft/lovecraftcollection/utils/Constants"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        Fragment,
        JSONModel,
        Filter, 
        FilterOperator,
        Constants) {
        "use strict";

        return Controller.extend("lvcrft.lovecraftcollection.controller.Master", {
            onInit: function () {
                this.viewModel = new JSONModel({ "isSelected": false })
                this.viewModel.setProperty("/myths_url",Constants.urls.myths_url)
                this.getView().setModel(this.viewModel, "view")
            },


            onBeforeRendering: function () {
                this._setLocalModel()

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
                this.viewModel.setProperty("/isSelected", true);
            },

            onAuthorPress: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                var clickedAuthorId = oEvent.getSource().getBindingContext("AUTHORS").getProperty("Athrid");

                oRouter.navTo("detail", {

                    authorID: clickedAuthorId


                });

            },

            onAdd: function (oEvent) {
                this._onOpenDialog(false)
            },
            onUpdate: function (oEvent) {
                this._onOpenDialog(true)
            },

            onDelete: function (oEvent) {
                if (this.selectedAuthor) {
                    this._deleteAuthor(this.selectedAuthor.Athrid)
                }
                this._deselect();
            },

            onCancelSelect: function(){
                this._deselect()
            },

            onCancel: function () {
                this._closeDialog();
            },




            //PRIVATE METHODS


            _setLocalModel: function () {
                var thatView = this.getView();
                var oModel = this.getView().getModel();
                oModel.read("/AUTHORSet", {
                    success: function (response) {
                        var newModel = {
                            "authors": response.results,
                            "selected": false
                        }
                        thatView.setModel(new JSONModel(newModel), "AUTHORS")

                    },
                    error: function (error) {
                        console.error(error);
                    }
                })
            },

            _onOpenDialog: function (isUpdate) {
                var oView = this.getView();
                var that = this;

                if (!this.byId("authorForm")) {
                    Fragment.load(
                        {
                            id: oView.getId(),
                            name: "lvcrft.lovecraftcollection.view.fragments.Form",
                            controller: this
                        }).then(
                            function (oDialog) {
                                oView.addDependent(oDialog);
                                oDialog.open();

                                if (isUpdate) {

                                    //Charge data from selected Author

                                    that.byId("nameInput").setValue(that.selectedAuthor.Name);
                                    that.byId("lastNameInput").setValue(that.selectedAuthor.Lastname);
                                    that.byId("nationalityInput").setValue(that.selectedAuthor.Nationality);
                                    that.byId("birthDateInput").setValue(that.selectedAuthor.Birth);
                                    that.byId("deathDateInput").setValue(that.selectedAuthor.Death);
                                    that.byId("imageInput").setValue(that.selectedAuthor.ImageUrl);

                                    //Set "Ok" button to update Author

                                    that.byId("okBtn").attachPress(that._updateAuthor, that);
                                } else {
                                    that.byId("okBtn").attachPress(that._createAuthor, that);
                                }


                                oDialog.attachAfterClose(function () {
                                    that._closeDialog()
                                })
                            }
                        )
                }
            },

            _createAuthor: function () {
                // var oIdInput = this.byId("idInput");
                var oNameInput = this.byId("nameInput");
                var oLastNameInput = this.byId("lastNameInput");
                var oNationalityInput = this.byId("nationalityInput");
                var oBirthDateInput = this.byId("birthDateInput");
                var oDeathDateInput = this.byId("deathDateInput");
                var imageInput = this.byId("imageInput");

                var oAuthor = {

                    // "Athrid": Number(oIdInput.getValue()),
                    "Name": oNameInput.getValue(),
                    "Lastname": oLastNameInput.getValue(),
                    "Nationality": oNationalityInput.getValue(),
                    "Birth": oBirthDateInput.getValue(),
                    "Death": oDeathDateInput.getValue(),
                    "ImageUrl": imageInput.getValue(),

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

            _updateAuthor: function (oEvent) {
                var oNameInput = this.byId("nameInput");
                var oLastNameInput = this.byId("lastNameInput");
                var oNationalityInput = this.byId("nationalityInput");
                var oBirthDateInput = this.byId("birthDateInput");
                var oDeathDateInput = this.byId("deathDateInput");
                var imageInput = this.byId("imageInput");

                var oAuthor = {

                    "Name": oNameInput.getValue(),
                    "Lastname": oLastNameInput.getValue(),
                    "Nationality": oNationalityInput.getValue(),
                    "Birth": oBirthDateInput.getValue(),
                    "Death": oDeathDateInput.getValue(),
                    "ImageUrl": imageInput.getValue()
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

            _closeDialog: function () {
                var dialog = this.byId("authorForm");
                this._deselect()
                dialog.destroy();
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


            },

            _deselect: function () {
                this.selectedAuthor = undefined;
                this.viewModel.setProperty("/isSelected", false);
                this.byId("list").removeSelections()
            },

        })
    })
