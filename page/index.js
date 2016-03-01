'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');
var SnClient = require("../snclient.js");
var jsonfile = require('jsonfile');
var tokens = require("../tokens.js");

var PageGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){

		this.query = 'name%3D' + this.name;

		var yeo = this;
		var done= this.async();

//		this.oauthJSON = jsonfile.readFileSync('.oauth');


		var config = {
			endpoint : this.config.get("endpoint"),
			authHash : new Buffer(this.config.get("authHash"), 'base64').toString("ascii"),
	//		authType : this.config.get("authType"),
//			accessToken : this.oauthJSON.access_token
		};

		this.snClient = new SnClient(config);
		
		this.snClient.getRecord("sys_ui_page", this.query).on("complete",function(response){

			if( response.status == "failure"){
				yeo.log(yosay("Error\nMessage: "+ response.error.message + "\nDetail: " + response.error.detail));
				// try and get new auth key
				// get refresh token from file
				//if(tokens.getNewTokenFromRefresh()){
				//	yeo.env.error("We had to fetch a new oauth key, please run again.");
				//}

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
	prompting : function(){
		var done = this.async();

		if(!this.recordExists){
			this.prompt([{
				type : 'confirm',
				name : 'createNewPage',
				message : 'This page does not exist, do you want to create a new page?',
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

		if(!this.recordExists && this.props.createNewPage){
			this.snClient.postRecord("sys_ui_page",{name : this.name}).on("complete", function(data, response){
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
		else{
			this.fs.copyTpl(
				this.templatePath('_existing-page.html'),
				this.destinationPath('app/ui_pages/' + this.results[0].sys_name + '.html'),
				{ content : this.results[0].html }
			);

			done();
		}

	}

});

module.exports = PageGenerator;
