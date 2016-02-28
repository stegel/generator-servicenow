'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var SnClient = require("../snclient.js");

var PageGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var yeo = this;
		var done = this.async();

		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		var config = {
			endpoint : this.config.get("endpoint"),
			authHash : new Buffer(this.config.get("authHash"), 'base64').toString("ascii"),
			accessToken : this.config.get("token")
		};

		this.snClient = new SnClient(config);
		
		this.snClient.getRecord("sys_user","user_nameLIKEtest122").on("complete",function(response){
			console.log(response);
		});
//		rest.post("https://scdevelopment.service-now.com/oauth_token.do",{
//			headers : {
//				"Accept" : "application/json"
//			},
//			data : {
//				grant_type : "password",
//				client_id : this.config.get("client_id"),
//				client_secret : this.config.get("client_secret"),
//				username : authHash.substring(0,authHash.indexOf(":")),
//			password : authHash.substring(authHash.indexOf(":")+1)
//			}
//		}).on("complete",function(data, response){
//			yeo.config.set("token",data.access_token);
//			yeo.config.save();
//
//			rest.post("https://scdevelopment.service-now.com/api/now/table/sys_user",{
//				headers : {
//					"Accept" : "application/json",
//					"Content-Type" : "application/json"
//				},
//				data : JSON.stringify({
//					user_name : yeo.name
//				}),
//				accessToken : data.access_token
//			}).on("complete",function(data,response){
//				if(data.error){
//					var mesage =
//					yeo.log(yosay("Error\nMessage: "+ data.error.message + "\nDetail: " + data.error.detail));
//
//					done();
//				}
//
//				done();
//			});
//		});
	}
});

module.exports = PageGenerator
