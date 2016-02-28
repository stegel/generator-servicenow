'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

var StyleGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var endpoint = this.config.get("endpoint");
		var query = 'name%3D' + this.name;
		var yeo = this;
		var done= this.async();

		// unhash username and pasword
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		this.username = authHash.substring(0,authHash.indexOf(":"));
		this.password = authHash.substring(authHash.indexOf(":")+1);

		rest.get(endpoint + "/table/content_css?sysparm_query=" + query, {
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
						name : 'createNewStyle',
						message : 'This style sheet does not exist, do you want to create a new style sheet?',
						default : false
					}],function(answers){
						if(answers.createNewStyle){

							var jsonData = JSON.stringify({name : yeo.name});
							rest.post(endpoint + "/table/content_css",{
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
										yeo.templatePath('_style.css'),
										yeo.destinationPath('app/css/' + yeo.name + '.css'),
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
						yeo.templatePath('_style.css'),
						yeo.destinationPath('app/css/' + results[0].sys_name + '.css'),
						{ content : results[0].style }
					);
					done();
				}
			}
		});
	}
});

module.exports = StyleGenerator;
