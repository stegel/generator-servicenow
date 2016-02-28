'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var SnClient = require("../snclient.js");

var ScriptGenerator = yeoman.generators.NamedBase.extend({
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
		this.snClient.getRecord("sys_ui_script",this.query).on("complete",function(response){
			if( response.status == "failure"){
				var mesage =
				yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
			}
			else{
				yeo.results = response.result;

				if (yeo.results.length === 0){
					yeo.recordExists = false;
					done()
						
				}
				else{
					yeo.recordExists = true;
					done();
				}
			}
		});
	},
	prompting : function (){
		var done = this.async();

		if(!this.recordExists){
			this.prompt([{
				type : 'confirm',
				name : 'createNewScript',
				message : 'This script does not exist, do you want to create a new script?',
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
	writing : function (){
		var yeo = this;
		var done = this.async();

		if(!this.recordExists && this.props.createNewScript){
			this.snClient.postRecord("sys_ui_script",{name : this.name}).on("complete", function(data, response){
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
		else{
			this.fs.copyTpl(
				this.templatePath('_script.js'),
				this.destinationPath('app/ui_scripts/' + this.results[0].sys_name + '.js'),
				{ content : this.results[0].script }
			);
			done();
		}
	}
});

module.exports = ScriptGenerator;
