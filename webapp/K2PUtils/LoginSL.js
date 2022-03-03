	sap.ui.define(
		function() {
			"use strict";

			return {
				loginSL: function(localModel) {

					var loginInfo = {};
					var B1SLAddress = "/b1s/v1/";

					loginInfo.UserName = localModel.getProperty("/B1UserName");
					loginInfo.Password = localModel.getProperty("/B1Password");
					loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");

					var destination = localModel.getProperty("/destination");
					var path = destination + B1SLAddress + "Login";

					$.ajax({
						type: "POST",
						url: path,
						xhrFields: {
							withCredentials: true
						},
						data: JSON.stringify(loginInfo),
						error: function(a,b,c) {
							$.sap.log.error("loginSL: Error");
							 localModel.setProperty("/B1CompanyDB", "loginSL: Error");
						}
					}).done(function(results) {

						if (results) {

						$.sap.log.error("loginSL: Success");
                        localModel.setProperty("/B1CompanyDB", "loginSL: Success");
						} else {
							$.sap.log.error("loginSL: Error2");
							localModel.setProperty("/B1CompanyDB", "loginSL: Error2");
						}

					}); //ajax login done

				}

			};

		});