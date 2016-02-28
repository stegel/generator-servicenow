'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

var SassGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var endpoint = this.config.get("endpoint");
		var query = 'u_name%3D' + this.name;
		var yeo = this;
		var done= this.async();

		// unhash username and pasword
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		this.username = authHash.substring(0,authHash.indexOf(":"));
		this.password = authHash.substring(authHash.indexOf(":")+1);
		
		rest.get(endpoint + "/table/u_content_scss?sysparm_query=" + query, {
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
						name : 'createNewSCSS',
						message : 'This SASS file does not exist, do you want to create a new SASS file?',	
						default : false
					}],function(answers){
						if(answers.createNewSCSS){
							
							var jsonData = JSON.stringify({u_name : yeo.name});
							rest.post(endpoint + "/table/u_content_scss",{
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
										yeo.templatePath('_style.scss'),
										yeo.destinationPath('app/sass/' + yeo.name + '.scss'),
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
						yeo.templatePath('_style.scss'),
						yeo.destinationPath('app/sass/' + results[0].u_name + '.scss'),
						{ content :results[0].u_style }
					);	
					done();
				}
			}
		});
	}
});

module.exports = SassGenerator;
