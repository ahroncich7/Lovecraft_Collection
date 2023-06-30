sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("lvcrft.lovecraftcollection.controller.Master", {
            onInit: function () {

            },

            onSelectionChange: function (oEvent) {
                this.selectedAuthor = oEvent.getParameter("listItem").getBindingContext().getObject();
            },

            onAuthorPress: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                var clickedAuthorId = oEvent.getSource().getBindingContext().getProperty("Athrid");

                oRouter.navTo("detail", {

                    authorID: clickedAuthorId


                });

            },

            onAdd: function (oEvent) {
                this.selectedAuthor = undefined;
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
                                if (that.selectedAuthor) {

                                    that.byId("idInput").setValue(that.selectedAuthor.Athrid);
                                    that.byId("nameInput").setValue(that.selectedAuthor.Name);
                                    that.byId("lastNameInput").setValue(that.selectedAuthor.Lastname);
                                    that.byId("nationalityInput").setValue(that.selectedAuthor.Nationality);
                                    that.byId("birthDateInput").setValue(that.selectedAuthor.Birth);
                                    that.byId("deathDateInput").setValue(that.selectedAuthor.Death);
                                }
                            }
                        )
                } else {
                    this.byId("openDialog").open()
                }

            },

            closeDialog: function () {
                if (this.selectedAuthor) {
                    this._updateAuthor(this.selectedAuthor.Athrid)
                } else {
                    this._createAuthor();
                }
                this.byId("openDialog").close()
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
                        debugger
                    },
                    error: function (error) {
                        console.error(error)
                    }
                });
            },

            onChange: function () {

                if (this.selectedAuthor) {
                    this._onOpenDialog();
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

            }
        })
    })
