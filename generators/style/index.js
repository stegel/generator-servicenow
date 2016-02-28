'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var SnClient = require("../../snclient.js");

var StyleGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){

		this.query = 'name%3D' + this.name;

		var yeo = this;
		var done= this.async();

		// unhash username and pasword
		var authHash = new Buffer(this.config.get("authHash"), 'base64').toString("ascii");

		var config = {
			endpoint : this.config.get("endpoint"),
			username : authHash.substring(0,authHash.indexOf(":")),
			password : authHash.substring(authHash.indexOf(":")+1)
		};

		this.snClient = new SnClient(config);

		this.snClient.getRecord("content_css",this.query).on("complete",function(response){
			if( response.status == "failure"){
				var mesage =
				yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
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

		if(!this.recordExists){
			this.prompt([{
				type : 'confirm',
				name : 'createNewStyle',
				message : 'This style sheet does not exist, do you want to create a new style sheet?',
				default : false
			}],function(answers){
				if(answers.createNewStyle){
					this.props = answers;
					done();
				}
			}.bind(this));
		}
		else{
			done();
		}
	},
	writing : function() {
		var yeo = this;

		var done = this.async();

		if(!this.recordExists && this.props.createNewStyle){
			this.snClient.postRecord("content_css",{name : this.name}).on("complete", function(data, response){
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
		else{
			this.fs.copyTpl(
				this.templatePath('_style.css'),
				this.destinationPath('app/css/' + this.results[0].sys_name + '.css'),
				{ content : this.results[0].style }
			);
			done();
		}
	}
});

module.exports = StyleGenerator;
