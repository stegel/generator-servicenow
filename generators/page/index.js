'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

// name=reject_practice_request

var PageGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var endpoint = this.config.get("endpoint");
		var query = 'name%3D' + this.name;
		var yeo = this;
		var done= this.async();

		// unhash username and pasword
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		this.username = authHash.substring(0,authHash.indexOf(":"));
		this.password = authHash.substring(authHash.indexOf(":")+1);
		
		rest.get(endpoint + "/table/sys_ui_page?sysparm_query=" + query, {
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
						name : 'createNewPage',
						message : 'This page does not exist, do you want to create a new page?',	
						default : false
					}],function(answers){
						if(answers.createNewPage){
							
							var jsonData = JSON.stringify({name : yeo.name});
							rest.post(endpoint + "/table/sys_ui_page",{
								headers : {
									"Accept" : "application/json",
									"Content-Type" : "application/json"
								},
								data : jsonData,
								username : yeo.username,
								password : yeo.password
							}).on("complete", function(data, response){
								yeo.log(response.statusCode);
								if(response.statusCode == 200 || response.statusCode == 201){
									yeo.fs.copyTpl(
										yeo.templatePath('_page.html'),
										yeo.destinationPath('app/ui_pages/' + yeo.name + '.html'),
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
						yeo.templatePath('_page.html'),
						yeo.destinationPath('app/ui_pages/' + results[0].sys_name + '.html'),
						{ content : results[0].html }
					);	
					done();
				}
			}
		});
	}
});

module.exports = PageGenerator;
