"use strict";
var rest = require('restler');
var jsonfile = require('jsonfile');

module.exports = {
	getToken : function(yeo){

		var data = {
			grant_type : "refresh_token",
			client_id : yeo.config.get("client_id"),
			client_secret : yeo.config.get("client_secret"),
			refresh_token : yeo.oauthJSON.refresh_token

		};
		rest.post("https://scdevelopment.service-now.com/oauth_token.do",{
			headers : {
				"Accept" : "application/json"
			},
			data : data
		}).on("complete",function(data,response){
			if( data.error){
				var mesage =
				yeo.log(yosay("Error\nMessage: "+ data.error + "\nDetail: " + data.error_description));
				done();
			}
			else{
				yeo.oauthJSON.access_token = data.access_token;
				jsonfile.writeFile('.oauth',yeo.oauthJSON,{spaces : 4},function(err){
					if(err){
						return console.log(err);
					}
					yeo.env.error("We had to fetch a new oauth key, please run again.");
				});

			}

		});
	}
};
