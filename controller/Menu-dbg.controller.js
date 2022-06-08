sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/Device",    
    "../model/formatter",
    'sap/ui/core/routing/History',
    "sap/ui/model/json/JSONModel",
    "../Encryption/aes",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Dialog, Button, Device,formatter,History,JSONModel) {
        "use strict";

        return Controller.extend("ppe.ppe.controller.Menu", {
            formatter: formatter,

            onInit: function () {
              

                //var CardCode = this.getOwnerComponent().getModel("LoginModel").getProperty("/UserData/CardCode")
        

                //let purcharseorders= this.getOwnerComponent().getModel("OrdersModel").getProperty("/PurchaseOrders")



            },
            getSplitAppObj: function () {
                var result = this.byId("MenuView");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },
            btnChangeMenu: function () {

                // ShowHideMode
                // StretchCompressMode
                // HideMode
                // PopoverMode
               
                if( this.getSplitAppObj().getMode()=="HideMode"){

                    this.getSplitAppObj().setMode("ShowHideMode");
                }else{
                    
                this.getSplitAppObj().setMode("HideMode");
                }
            },
            goToDashboard: function () {
                this.getSplitAppObj().to(this.createId("PageDashboard"));
            },
            goToPedidos: function () {
                var CardCode = this.getOwnerComponent().getModel("LoginModel").getProperty("/CardCode")
                setPurcharseOrders(CardCode, this, "desc")
                this.getSplitAppObj().to(this.createId("PagePedidos"));
            },
            goToFacturas: function () {
                this.getSplitAppObj().to(this.createId("PageFacturas"));
            },
            goToPagos: function () {
                this.getSplitAppObj().to(this.createId("PagePagos"));
            },
            goToCuentaCorriente: function () {
                this.getSplitAppObj().to(this.createId("PageCCorriente"));
            },
            goToContacto: function () {
                 this.getSplitAppObj().to(this.createId("PagePedidosDetalle"));
                // this.getSplitAppObj().to(this.createId("PageContacto"));
            },
            btnAccount: function () {
                this.getSplitAppObj().to(this.createId("PageCuenta"));
                var userdata = this.getOwnerComponent().getModel("LoginModel").getProperty("/UserData")
                console.log(userdata)
                this.getView().byId("codeuser").setValue(userdata.CardCode)
            },
            legajoImpositivo: function(){
                //legajo impositivo
                debugger
                var url="/b1s/v2/WTaxTypeCodes"
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    data: {},
                    type:"GET",
                    success: function (data) {
                        debugger
                        if (data.value != undefined) {
                            //this.getView().getModel("OrdersModel").setProperty("/PurchaseOrders", data.value);
    
    
                        } else {
    
                            sap.m.MessageToast.show("no se encontraron resultados");
                        }
    
                    }.bind(this),
                    error: function (error) {
                        debugger
    
                        sap.m.MessageToast.show("error en la consulta " + JSON.stringify( error));
    
                    }.bind(this)
                })
                this.getSplitAppObj().to(this.createId("PageLegajoImpositivo"));
            },
            logout: function () {
                this.getView().getModel("LoginModel").setProperty("/Logged", false);
                this.getView().getModel("LoginModel").setProperty("/UserData", "");
                location.reload()

            },
            PurchaseOrders: function (oEvent) {

                //console.log("Pressed : " + oEvent.getParameters())
                // console.log("Pressed : " + oEvent.getSource().getParent().getId())

                // console.log("Pressed : " + oEvent.getSource().getItems().getId())

            },
            btnSearchPurchaseOrders: function(oEvent){
                let dt1 = this.getView().byId("DP1").getValue(); 
                let dt2 = this.getView().byId("DP2").getValue(); 
                console.log(dt1 + " "+ dt2)
            },
            POSearch: function (oEvent) {
                debugger
                var oButton = oEvent.getSource();   // ThumbsUp Button in the row

              
                var oBindingContext = oButton.getBindingContext("OrdersModel");  
                var oBindingObject = oBindingContext.getObject();   
                sap.m.MessageToast.show(oBindingObject.DocNum);
                console.log("Selected row Object: ", oBindingObject);
                //buscar purchase oprder por doc numnpm 
                this.getSplitAppObj().to(this.createId("PagePedidosDetalle"));
            },
            POPDF: function (oEvent) {
                debugger
                var oButton = oEvent.getSource();   // ThumbsUp Button in the row

                // Get binding context of the button to identify the row where the event is originated
                var oBindingContext = oButton.getBindingContext("OrdersModel");  // <<<-- If you have model name pass it here as string
                var oBindingObject = oBindingContext.getObject();   // getPath() method gives path to model row number
                sap.m.MessageToast.show(oBindingObject.DocDate);
                console.log("Selected row Object: ", oBindingObject);
                console.log(oButton.getIcon())
                //Set color for the button

                return
                if (oButton.getType() === sap.m.ButtonType.Transparent) {
                    oButton.setType(sap.m.ButtonType.Accept);
                } else {
                    oButton.setType(sap.m.ButtonType.Transparent);
                }
            }
            ,
            POLead: function (oEvent) {
                debugger
                var oButton = oEvent.getSource();   // ThumbsUp Button in the row

                // Get binding context of the button to identify the row where the event is originated
                var oBindingContext = oButton.getBindingContext("OrdersModel");  // <<<-- If you have model name pass it here as string
                var oBindingObject = oBindingContext.getObject();   // getPath() method gives path to model row number
                sap.m.MessageToast.show(oBindingObject.DocTotal);
                console.log("Selected row Object: ", oBindingObject);

                //Set color for the button
                return
                if (oButton.getType() === sap.m.ButtonType.Transparent) {
                    oButton.setType(sap.m.ButtonType.Accept);
                } else {
                    oButton.setType(sap.m.ButtonType.Transparent);
                }
            },
            docdate: function (oEvent) {
                var oButton = oEvent.getSource();
                var CardCode = this.getOwnerComponent().getModel("LoginModel").getProperty("/CardCode")
                debugger
                if (oButton.getIcon() === "sap-icon://arrow-top") {
                    oButton.setIcon("sap-icon://arrow-bottom");
                    setPurcharseOrders(CardCode, this, "desc") 
                } else {
                    oButton.setIcon("sap-icon://arrow-top");
                    setPurcharseOrders(CardCode, this, "asc") 
                }
            },
            changePassword: function () {
                debugger
                //encriptar

                let newpass1 = this.getView().byId("newpassword1").getValue();
                let newpass2 = this.getView().byId("newpassword2").getValue();
                var userdata = this.getOwnerComponent().getModel("LoginModel").getProperty("/UserData")
                let CardCode = this.getView().getModel("LoginModel").getProperty("/UserData/CardCode");
                let pass = encryptPassword(CardCode, this.getView().byId("password").getValue());
                if (userdata.U_Password_Portal == pass && pass != "") {

                    if (newpass1 == newpass2 && newpass1 != "" && newpass2 != "") {
                        updatePassword(CardCode, newpass2, this)
                        sap.m.MessageToast.show("Contraseña cambiada")



                    } else {
                        sap.m.MessageToast.show("Las contraseñas no coinciden o su formato no está permitido", { duration: 10000 })
                    }

                } else {
                    sap.m.MessageToast.show("La combinacion usuario y contraseña no es correcta", { duration: 10000 })
                }




            }
        });
        function setPurcharseOrders(CardCode, _this, order) {
            // const url = 'https://services.odata.org/V2/OData/OData.svc';
            // const model = new sap.ui.model.odata.v2.ODataModel(url); //Yep, globals...
        //update model purchase orders b1s/v2/PurchaseOrders?$filter=CardCode eq 'V10000' &$orderby=DocDate desc
        _this.getView().getModel("OrdersModel").setProperty("/PurchaseOrders", null);
            
            var url = "/b1s/v2/PurchaseOrders?$filter=CardCode eq '" + CardCode + "'&$orderby=DocDate "+order
           var url2="/b1s/v2/Orders?$filter=CardCode eq 'C20000'&$orderby=DocDate "+order
        
            jQuery.ajax({
                url: url2,
                dataType: "json",
                data: {},
                success: function (data) {
                    
                    if (data.value != undefined) {
                        _this.getView().getModel("OrdersModel").setProperty("/PurchaseOrders", data.value);


                    } else {

                        sap.m.MessageToast.show("no se encontraron purchase orders");
                    }

                }.bind(_this),
                error: function (error) {
                    debugger

                    sap.m.MessageToast.show("error en la consulta " + JSON.stringify( error));

                }.bind(_this)
            })
        }
        function updatePassword(CardCode, NewPassword, _this) {
            debugger
            //encriptar
            let encryptPass = encryptPassword(CardCode, NewPassword)
            let Data = {
                "U_Password_Portal": encryptPass.toString()
            }

            console.log(Data)
            var url = "/b1s/v2/BusinessPartners('" + CardCode + "')"
            jQuery.ajax({
                url: url,
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(Data),
                success: function (data) {
                    debugger
                    console.log(data)
                    //actualziar password en modelo
                    debugger
                    _this.getView().getModel("LoginModel").setProperty("/UserData/U_Password_Portal", NewPassword);

                }.bind(_this),
                error: function (data) {
                    debugger
                    console.log(data)
                }.bind(_this)
            })
        }
        function encryptPassword(User, Password) {
            var String = Password;
            var key = User;
            var encrypted = CryptoJS.AES.encrypt(String, key);
            var decrypted = CryptoJS.AES.decrypt(encrypted, key);
            return decrypted
        }

    });

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 83) {
        let cookie = document.cookie
        console.log(cookie)
    }
}