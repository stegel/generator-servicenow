'use strict';
// client id: 8574519ac7f112005ee265152c66d1db
// secret : mB,.#?:-7v

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var mkdirp = require('mkdirp');
var SnClient = require("../../snclient.js");

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
			done();
		}.bind(this));
	},

	writing : function(){
		var done = this.async();
		var yeo = this;
		
		var endpoint = this.config.get("endpoint");
		var query = 'nameSTARTSWITH' + 	this.props.appName;
		
		var getTableContents = function(table,field)
		{
			return rest.get(endpoint + "/table/" + table + '?sysparm_query=' + query, {
				username : yeo.props.username,
				password : yeo.props.password
			});
		}
		
		mkdirp('app');
		
		// get UI Pages
		mkdirp('app/ui_pages');
		getTableContents('sys_ui_page','html').on('complete', function(response) {
			if( response instanceof Error){
				this.log('Error: ', response.message);
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
			getTableContents('sys_ui_script','script').on('complete',function(response) {
				if( response instanceof Error){
				this.log('Error: ', response.message);
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
					getTableContents('content_css','style').on('complete',function(response) {
						if( response instanceof Error){
							this.log('Error: ', response.message);
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
	runNpm : function () {
		this.npmInstall();
	}
});
