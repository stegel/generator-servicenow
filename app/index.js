'use strict';
// client id: 8574519ac7f112005ee265152c66d1db
// secret : mB,.#?:-7v

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var mkdirp = require('mkdirp');
var SnClient = require("../snclient.js");

module.exports = yeoman.generators.Base.extend({
	prompting : function() {
		var done = this.async();

		this.prompt([{
			type : 'input',
			name : 'hostname',
			message : 'What instance are you on? (the part before .service-now.com)',	
			default : 'scdevelopment'
		},{
			type : 'input',
			name : "username",
			message : "What is your username?",

		},{
			type : 'password',
			name : 'password',
			message : 'What is your password?',

		},{
			type : 'input',
			name : 'appName',
			message : 'What is your app prefix?',
			default : 'solution'
		}], function(answers){
			this.props = answers;

			done();
		}.bind(this));
	},
	configuring : function() {
		var done = this.async();

		this.config.set({
			"hostname" : this.props.hostname,
			"endpoint" : "https://" + this.props.hostname + ".service-now.com/api/now"
		});

		// enode username and pass
		var authHash = new Buffer(this.props.username + ":" + this.props.password).toString("base64");
		this.config.set({
			"authHash" : authHash
		});

		this.config.save();

		// setup snClient
		var config = {
			endpoint : this.config.get("endpoint"),
			username : this.props.username,
			password : this.props.password
		};

		this.snClient = new SnClient(config);

		done();
	},

	writing : function(){
		var done = this.async();
		var yeo = this;

		var query = 'nameSTARTSWITH' + 	this.props.appName;

		mkdirp('app');
		
		// get UI Pages
		mkdirp('app/ui_pages');
		
		this.template('_package.json', 'package.json',{appName : this.props.appName})
		this.snClient.getRecord('sys_ui_page',query).on('complete', function(response) {
			if( response.status == "failure"){
				var mesage =
				yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
				done();
			}
			else{
				
				var results = response.result;
				
				for(var i = 0; i < results.length; i++){
					yeo.fs.copyTpl(
						yeo.templatePath('_test.html'),
						yeo.destinationPath('app/ui_pages/' + results[i].sys_name + '.html'),
						{ content : results[i].html}
					);
				}
			}
			// get UI Scripts
			mkdirp('app/ui_scripts');
			yeo.snClient.getRecord('sys_ui_script',query).on('complete',function(response) {
				if( response.status == "failure"){
					var mesage =
					yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
					
					done();
				}
				else{

					var results = response.result;

					for(var i = 0; i < results.length; i++){
						yeo.fs.copyTpl(
							yeo.templatePath('_test.js'),
							yeo.destinationPath('app/ui_scripts/' + results[i].sys_name + '.js'),
							{ content : results[i].script}
						);
					}
					mkdirp('app/css');
					yeo.snClient.getRecord('content_css',query).on('complete',function(response) {
						if( response.status == "failure"){
							var mesage =
							yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
							done();
						}
						else{

							var results = response.result;

							for(var i = 0; i < results.length; i++){
								yeo.fs.copyTpl(
									yeo.templatePath('_main.css'),
									yeo.destinationPath('app/css/' + results[i].sys_name + '.css'),
									{ content : results[i].style}
								);
							}
							
							yeo.fs.copyTpl(yeo.templatePath('_package.json'),yeo.destinationPath('package.json'),{
								appName : yeo.props.appName
							});
							
							done();
						}
					});
				}
			});
			
		})
	},
	install : function(){
		var done = this.async();
		this.npmInstall();
		done();
	}
	
});
