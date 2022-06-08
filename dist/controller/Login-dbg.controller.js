
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/Dialog",
    "sap/m/Button",
    "../Encryption/aes"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Dialog, Button) {
        "use strict";

        return Controller.extend("ppe.ppe.controller.Login", {
            onInit: function () {
               
                // document.cookie = "B1SESSION=80450f5a-e683-11ec-8000-16de22d6cf68,domain=localhost:8080";
   
                // alert(document.cookie);
                // return

                this.getView().byId("user").setValue("P1000");
                this.getView().byId("password").setValue("P1000Pass");


                // document.cookie = "username=B1SESSION; content=60fd392a-e047-11ec-8000-16de22d6cf68; path=/b1s/v2";
                //let Data = { "CompanyDB": "TEST1", "UserName": "manager", "Password": "1234" }
                //get id session
                var url = "/b1s/v2/Login"
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    //    data: JSON.stringify(Data),
                    success: function (data) {

                        localStorage.setItem('SessionId', data.SessionId);
                        this.getView().getModel("LoginModel").setProperty("/SessionId", data.SessionId);

                    }.bind(this),
                    error: function () {
                        this.getView().getModel("LoginModel").setProperty("/SessionId", "");
                    }.bind(this)
                })

                //nuevocampo()
                //updatecampo()
            },
            onLogin: function () {     
                
                //   this.getView().getModel("LoginModel").setProperty("/Logged", true);
                // this.getOwnerComponent().getRouter().getTargets().display("TargetMenu");
                // return
                let SessionId = localStorage.getItem("SessionId");

                try {

                    if (SessionId) {
                        sap.m.MessageToast.show("Iniciando Sesion...", { duration: 10000 })

                        let User = this.getView().byId("user").getValue();
                        let encryptPass = encryptPassword(User, this.getView().byId("password").getValue())

                          var url = "/b1s/v2/BusinessPartners?$filter=CardCode eq '" + User + "' and U_Password_Portal eq '" + encryptPass + "'" + " and CardType eq 'cSupplier'"
                        //var url = "/b1s/v2/BusinessPartners?$filter=CardCode eq '" + "C20000" + "'"
                        jQuery.ajax({
                            url: url,
                            dataType: "json",
                            success: function (data) {
                                
                                if (data.value[0] != undefined) {
                                    this.getView().getModel("LoginModel").setProperty("/Logged", true);
                                    this.getView().getModel("LoginModel").setProperty("/UserData", data.value[0]);
                                    searchPaymentTermsTypes(data.value[0].PayTermsGrpCode, this)
                                    localStorage.setItem("UserLoged", data.value[0].CardCode);
                                    sap.m.MessageToast.show("Exito")

                                    this.getOwnerComponent().getRouter().getTargets().display("TargetMenu");

                                } else {
                                  
                                    sap.m.MessageToast.show("Combinación de Usuario y Contraseña incorrecta", { duration: 10000 })

                                }

                            }.bind(this),
                            error: function (error) {
                                this.getView().getModel("LoginModel").setProperty("/Logged", false);

                                console.log(JSON.stringify(error))
                                sap.m.MessageToast.show("Error en la consulta " + JSON.stringify(error));

                            }.bind(this)
                        })
                    } else {
                        this.getView().getModel("LoginModel").setProperty("/Logged", false);
                        sap.m.MessageToast.show("Error de sesión")
                    }
                }
                catch (error) {
                    this.getView().getModel("LoginModel").setProperty("/Logged", false);
                    console.log(error)
                    sap.m.MessageToast.show("error conexion " + error)
                }
            }


        });
        function nuevocampo() {
            debugger
            let Data = {
                "Name": "Password_Portal",
                "Type": "db_Alpha",
                "Size": 100,
                "Description": "udf Supplier portal password",
                "SubType": "st_None",
                "TableName": "OCRD"
            }

            var url = "/b1s/v2/UserFieldsMD"
            jQuery.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(Data),
                success: function (data) {
                    debugger
                    console.log(data)
                }.bind(this),
                error: function (data) {
                    debugger
                    console.log(data)
                }.bind(this)
            })


        }
        function updatecampo() {
            debugger
            let Data = {
                "U_PassPortal": "test1pass"
            }

            var url = "/b1s/v2/BusinessPartners('test1cardcode')"
            jQuery.ajax({
                url: url,
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(Data),
                success: function (data) {
                    debugger
                    console.log(data)
                }.bind(this),
                error: function (data) {
                    debugger
                    console.log(data)
                }.bind(this)
            })
        }
        function deleteCampo() {
            debugger


            var url = "/b1s/v2/UserFieldsMD(TableName='OCRD', FieldID=10)"
            jQuery.ajax({
                url: url,
                type: "DELETE",
                dataType: "json",

                success: function (data) {
                    debugger
                    console.log(data)
                }.bind(this),
                error: function (data) {
                    debugger
                    console.log(data)
                }.bind(this)
            })
        }
        function updatePassword(CardName, NewPassword) {
            debugger
            //encriptar
            let passencrypt = encryptPassword(CardName, NewPassword)

            let Data = {
                "U_Password_Portal": passencrypt.toString()
            }

            console.log(Data)
            var url = "/b1s/v2/BusinessPartners('" + CardName + "')"
            jQuery.ajax({
                url: url,
                type: "PATCH",
                dataType: "json",
                data: JSON.stringify(Data),
                success: function (data) {
                    debugger
                    console.log(data)

                }.bind(this),
                error: function (data) {
                    debugger
                    console.log(data)
                }.bind(this)
            })
        }
        function encryptPassword(User, Password) {
            var String = Password;
            var key = User;
            var encrypted = CryptoJS.AES.encrypt(String, key);
            var decrypted = CryptoJS.AES.decrypt(encrypted, key);
            return decrypted
        }
        function decryptPassword(EncryptedPassword) {
            return EncryptedPassword.toString(CryptoJS.enc.Utf8)
        }
        function setCookie() {
            if (document.cookie == "") {

                document.cookie = "username=B1SESSION; content=60fd392a-e047-11ec-8000-16de22d6cf68; path=/b1s/v2";
                location.reload()
            }
        }
        function searchPaymentTermsTypes(GroupNumber, _this) {
            var url = "/b1s/v2/PaymentTermsTypes(" + GroupNumber + ")"
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: {},
                success: function (data) {

                    if (data != undefined) {
                        _this.getView().getModel("LoginModel").setProperty("/UserData/PaymentTerms", data);

                    } else {

                        sap.m.MessageToast.show("cant find PaymentTermsTypes");
                    }

                }.bind(_this),
                error: function (error) {

                    console.log(JSON.stringify(error))
                    sap.m.MessageToast.show("error en la consulta " + error);

                }.bind(_this)
            })
        }
        function searchWTax(WTCode) {
            var url = "/b1s/v2/WTaxTypeCodes(" + GroupNumber + ")"
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: {},
                success: function (data) {

                    if (data != undefined) {
                        _this.getView().getModel("LoginModel").setProperty("/UserData/WTaxTypeCodes", data);

                    } else {

                        sap.m.MessageToast.show("cant find PaymentTermsTypes");
                    }

                }.bind(_this),
                error: function (error) {

                    console.log(JSON.stringify(error))
                    sap.m.MessageToast.show("error en la consulta " + error);

                }.bind(_this)
            })
        }
        function chekNewPassword() {
            debugger
            console.log(window.location.href);
        }

    });

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 83) {
        let cookie = document.cookie
        console.log(cookie)
    }
}