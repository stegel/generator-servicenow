'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

var SassGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		this.endpoint = this.config.get("endpoint");
		this.query = 'u_name%3D' + this.name;
		var yeo = this;
		var done= this.async();
		
		this.recordExists = false;
		// unhash username and pasword
		
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		this.username = authHash.substring(0,authHash.indexOf(":"));
		this.password = authHash.substring(authHash.indexOf(":")+1);
	
		rest.get(this.endpoint + "/table/u_content_scss?sysparm_query=" + this.query, {
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
				yeo.results = response.result;

				if (yeo.results.length === 0){
					yeo.recordExists = false;
					done();
						
				}
				else{
					yeo.recordExists = true;
					done();
				}
			}
		});
	},
	prompting : function() {
		var done = this.async();
		if(!this.recordExists)
		{
			
			this.prompt([{
				type : 'confirm',
				name : 'createNewSCSS',
				message : 'This SASS file does not exist, do you want to create a new SASS file?',	
				default : false
			}],function(answers){
				this.props = answers;
				done();
			}.bind(this));
		}
		else{
			done();
		}
	},
	writing : function() {
		var yeo = this;
		var done = this.async();
		if(!this.recordExists && this.props.createNewSCSS){
			
			
			var jsonData = JSON.stringify({u_name : this.name});
			rest.post(this.endpoint + "/table/u_content_scss",{
				headers : {
					"Accept" : "application/json",
					"Content-Type" : "application/json"
				},
				data : jsonData,
				username : this.username,
				password : this.password
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
		else{
			this.fs.copyTpl(
				this.templatePath('_style.scss'),
				this.destinationPath('app/sass/' + this.results[0].u_name + '.scss'),
				{ content :this.results[0].u_style }
			);	
			done();
		}
	}
		
});

module.exports = SassGenerator;
