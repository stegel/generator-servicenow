"use strict";
var rest = require('restler');
var jsonfile = require('jsonfile');

module.exports = {
	getNewTokenFromRefresh : function(){

		var oauthJSON = jsonfile.readFileSync(".oauth");
		var data = {
			grant_type : "refresh_token",
			client_id : oauthJSON.client_id,
			client_secret : oauthJSON.client_secret,
			refresh_token : oauthJSON.refresh_token
		};

		rest.post("https://scdevelopment.service-now.com/oauth_token.do",{
			headers : {
				"Accept" : "application/json"
			},
			data : data
		}).on("complete",function(data,response){
			if( data.error){
				var mesage =
				console.log("Error\nMessage: "+ data.error + "\nDetail: " + data.error_description);
				done();
			}
			else{
				oauthJSON.access_token = data.access_token;
				jsonfile.writeFile('.oauth',oauthJSON,{spaces : 4},function(err){
					if(err){
						return console.log(err);
					}
					return true;
				});

			}

		});
	}
};
