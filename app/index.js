'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var mkdirp = require('mkdirp');
var SnClient = require("../helpers/snclient.js");
//var jsonfile = require('jsonfile');
//var tokens = require('../tokens.js');


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
		},{
			type : 'input',
			name : 'dest',
			message : 'Where do you want to store your app files',
			default : 'dist'
		}], function(answers){
			this.props = answers;
			this.props.authHash = new Buffer(this.props.username + ":" + this.props.password).toString("base64");
			done();
			
		}.bind(this));
	},
	configuring : function() {
		var done = this.async();
		var yeo = this;

		this.config.set({
			"hostname" : this.props.hostname,
			"endpoint" : "https://" + this.props.hostname + ".service-now.com/api/now",
			"authHash" : this.props.authHash
		});



		this.config.save();

		// setup snClient
		var config = {
			endpoint : this.config.get("endpoint"),
			authHash : new Buffer(this.props.authHash,"base64").toString("ascii"),
			client_id : this.props.client_id,
			client_secret : this.props.client_secret
		};

		this.snClient = new SnClient(config);
		done();
	},

	writing : function(){
		var done = this.async(),
			yeo = this,
			dest = this.props.dest,
			query = 'nameSTARTSWITH' + 	this.props.appName;

		mkdirp(dest);
		
		// get UI Pages
		mkdirp(dest +'/ui_pages');
		mkdirp(dest +'/ui_scripts');
		mkdirp(dest +'/stylesheets');
		
		this.template('_package.json', 'package.json',{appName : this.props.appName})

		this.template("_gruntfile.js", "Gruntfile.js",{
			dest : dest
		});

		this.template("_sn-config.json",".sn-config.json",{
			host : this.props.hostname,
			auth : this.props.authHash,
			prefix : this.props.appName
		});
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
						yeo.destinationPath(dest + '/ui_pages/' + results[i].sys_name + '.html'),
						{ content : results[i].html}
					);
				}
			}
			// get UI Scripts
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
							yeo.destinationPath(dest + '/ui_scripts/' + results[i].sys_name + '.js'),
							{ content : results[i].script}
						);
					}
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
									yeo.destinationPath(dest + '/css/' + results[i].sys_name + '.css'),
									{ content : results[i].style}
								);
							}

							done();
						}
					});
				}
			});
			
		})
	},
	install : function(){
		var done = this.async();
		var yeo = this;
		this.npmInstall("","",function(){
				yeo.spawnCommand('grunt',['pull']);
				done();
			});


	}



	
});
