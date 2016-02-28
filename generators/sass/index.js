'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var SnClient = require("../../snclient.js");

var SassGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		
		this.query = 'u_name%3D' + this.name;
		
		var yeo = this;
		var done= this.async();
		
		this.recordExists = false;
		// unhash username and pasword
		
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		var config = {
			endpoint : this.config.get("endpoint"),
			username : authHash.substring(0,authHash.indexOf(":")),
			password : authHash.substring(authHash.indexOf(":")+1)
		}
		
		this.snClient = new SnClient(config);
		
		this.snClient.getRecord("u_content_scss",this.query).on("complete",function(response){
			if( response instanceof Error){
				yeo.log("Error");
			}
			else{
				yeo.log(response);
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
			
			this.snClient.postRecord("u_content_scss",{u_name : this.name}).on("complete", function(data, response){
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
