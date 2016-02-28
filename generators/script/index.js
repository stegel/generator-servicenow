'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

// name=reject_practice_request

//var snClient = rest.service(function (u, p, endpoint){
//	this.defaults.username = u;
//	this.defaults.password = p;
//	this.defaults.headers = {
//    'Content-Type': 'application/json',
//    'Accepts': 'application/json'
//  }
//},
//						   {
//	baseUrl : endpoint
//})
var ScriptGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var endpoint = this.config.get("endpoint");
		var query = 'name%3D' + this.name;
		var yeo = this;
		var done= this.async();

		// unhash username and pasword
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		this.username = authHash.substring(0,authHash.indexOf(":"));
		this.password = authHash.substring(authHash.indexOf(":")+1);
		
		rest.get(endpoint + "/table/sys_ui_script?sysparm_query=" + query, {
			headers : {
				'Content-Type': 'application/json',
				'Accepts': 'application/json'
			},
			username : this.username,
			password : this.password
			}).on("complete",function(response){
			if( response instanceof Error){
				yeo.log("Error");
			}
			else{
				var results = response.result;

				if (results.length === 0){
					yeo.prompt([{
						type : 'confirm',
						name : 'createNewScript',
						message : 'This script does not exist, do you want to create a new script?',	
						default : false
					}],function(answers){
						if(answers.createNewScript){
							
							var jsonData = JSON.stringify({name : yeo.name});
							rest.post(endpoint + "/table/sys_ui_script",{
								headers : {
									"Accept" : "application/json",
									"Content-Type" : "application/json"
								},
								data : jsonData,
								username : yeo.username,
								password : yeo.password
							}).on("complete", function(data, response){
								if(response.statusCode == 200 || response.statusCode == 201){
									yeo.fs.copyTpl(
										yeo.templatePath('_script.js'),
										yeo.destinationPath('app/ui_scripts/' + yeo.name + '.js'),
										{ content : ""}
									);	
									done();
								}
								
							});
						}
					}.bind(yeo));
						
				}
				else{
					yeo.fs.copyTpl(
						yeo.templatePath('_script.js'),
						yeo.destinationPath('app/ui_scripts/' + results[0].sys_name + '.js'),
						{ content : decodeURIComponent('var app = "hey"') }
					);	
					done();
				}
			}
		});
	}
});

module.exports = ScriptGenerator;
