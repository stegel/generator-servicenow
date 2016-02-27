'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rest = require('restler');

// name=reject_practice_request

var PageGenerator = yeoman.generators.NamedBase.extend({
	initializing : function(){
		var endpoint = 'https://scdevelopment.service-now.com/api/now/table/sys_ui_page';
		var query = 'name%3D' + this.name;
		var yeo = this;
		var done= this.async();
		rest.get("https://scdevelopment.service-now.com/api/now/table/sys_ui_page?sysparm_query=" + query, {
				username : "user",
				password : "password"
			}).on("complete",function(response){
			if( response instanceof Error){
				yeo.log("Error");
			}
			else{
//				yeo.log(response);
				var results = response.result;
				yeo.fs.copyTpl(
						yeo.templatePath('_page.html'),
						yeo.destinationPath('app/ui_pages/' + results[0].sys_name + '.html'),
						{ content : results[0].html}
					);
				done();
			}
		});
	}
});

module.exports = PageGenerator;
