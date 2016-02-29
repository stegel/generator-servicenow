'use strict';
// client id: 8574519ac7f112005ee265152c66d1db
// secret : mB,.#?:-7v

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var mkdirp = require('mkdirp');
var SnClient = require("../snclient.js");
var jsonfile = require('jsonfile');

var _getToken = function(config){
	return rest.post("https://scdevelopment.service-now.com/oauth_token.do",{
		headers : {
			"Accept" : "application/json"
		},
		data : {
			grant_type : "password",
			client_id : config.client_id,
			client_secret : config.client_secret,
			username : config.authHash.substring(0,config.authHash.indexOf(":")),
		password : config.authHash.substring(config.authHash.indexOf(":")+1)
		}
	});
};
module.exports = yeoman.generators.Base.extend({
	prompting : function() {
		var done = this.async();
		var yeo = this;
		
		this.prompt([{
			type : 'input',
			name : 'hostname',
			message : 'What instance are you on? (the part before .service-now.com)',	
			default : 'scdevelopment'
		},{
			type: "list",
			name : "authType",
			message : "How would you prefer to authenticate?",
			choices : ["Basic Authentication","OAuth v2"]
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
			
			if(this.props.authType !== "Basic Authentication"){
				this.prompt([{
					type : "input",
					name : "client_id",
					message : "Client ID (for OAuth):"
				},{
					type : "input",
					name : "client_secret",
					message : "Client Secret"
				}], function(answers){
					yeo.props.client_id = answers.client_id;
					yeo.props.client_secret = answers.client_secret;
					done();
				});
			}
			else{
				done();
			}
			
		}.bind(this));
	},
	configuring : function() {
		var done = this.async();
		var yeo = this;

		this.config.set({
			"hostname" : this.props.hostname,
			"endpoint" : "https://" + this.props.hostname + ".service-now.com/api/now",
			"authType" : this.props.authType
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
			authHash : new Buffer(authHash,"base64").toString("ascii"),
			authType : this.props.authType,
			client_id : this.props.client_id,
			client_secret : this.props.client_secret
		};



		if(this.props.authType === "OAuth v2"){
			_getToken(config).on("complete",function(data,response){
				config.accessToken = data.access_token;
				yeo.config.set({
					"accessToken" : data.access_token,
					"refreshToken" : data.refresh_token,
					"client_id" : config.client_id,
					"client_secret" : config.client_secret
				});
				yeo.config.save();

				var oCon = {
					client_id : yeo.props.client_id,
					client_secret : yeo.props.client_secret,
					access_token : data.access_token,
					refresh_token : data.refresh_token
				};

				//write out oauth settings to file
				jsonfile.writeFile('.oauth',oCon, {spaces : 4},function(err){
					if(err){
						return console.log(err);
					}
				});

				//setup rest client
				yeo.snClient = new SnClient(config);

				done();
			});
		}
		else{
			this.snClient = new SnClient(config);
			done();
		}


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
	},
	_getToken : function(config){
		return rest.post("https://scdevelopment.service-now.com/oauth_token.do",{
			headers : {
				"Accept" : "application/json"
			},
			data : {
				grant_type : "password",
				client_id : config.client_id,
				client_secret : config.client_secret,
				username : config.authHash.substring(0,config.authHash.indexOf(":")),
			password : config.authHash.substring(config.authHash.indexOf(":")+1)
			}
		});
	}

	
});
