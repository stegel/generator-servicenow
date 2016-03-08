'use strict';

var yeoman = require('yeoman-generator').Base,
	yosay = require('yosay'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore.string'),
	require_config = require('../helpers/config-validator.js');


var Generator = module.exports = function Generator(args, options){
	yeoman.apply(this, arguments);

	this.argument('directiveName', {type: String, required :true});


	this.directiveName = _.slugify(_.humanize(this.directiveName));

	this.pkg = require("../package.json");
//	this.sourceRoot(path.join(__dirname, '../templates/common'));
};

util.inherits(Generator, yeoman);

Generator.prototype.welcome = function welcome(){
	if(!this.options['skip-welcome-message']){
		this.log(yosay("We're going ahead a creating a new for you. This includes the JS, HTML, and SCSS files"));
	}
};

Generator.prototype.copying = function copying(){
	var done = this.async();
	var _this = this;
	require_config().then(function(config){

		// create the directive js
		_this.template("_directive.js",path.join(config.app_dir,"ui_scripts",config.project_prefix + "directive_" + _this.directiveName + ".js"),{
			appName : config.app_name,
			directiveName : _this.directiveName
		});

		// Create the directive template
		_this.template("_directive.xhtml",path.join(config.app_dir, "ui_pages", config.project_prefix + "template_" + _this.directiveName + ".xhtml"),{
			directiveName : _this.directiveName
		});

		// create thd directive SASS
		_this.template("_directive.scss",path.join("scss", config.project_prefix  + _this.directiveName + ".scss"),{
			directiveName : _this.directiveName
		})


		done();
	});


}
