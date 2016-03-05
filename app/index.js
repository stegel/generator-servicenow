'use strict';

var yeoman = require('yeoman-generator'),
	yosay = require('yosay'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore.string');


var Generator = module.exports = function Generator(args, options){
	yeoman.generators.Base.apply(this, arguments);

	this.argument('appname', {type: String, required :false});

	this.appname = this.appname || path.basename(process.cwd());

	this.appname = _.camelize(_.slugify(_.humanize(this.appname)));

	this.pkg = require("../package.json");
//	this.sourceRoot(path.join(__dirname, '../templates/common'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome(){
	if(!this.options['skip-welcome-message']){
		this.log(yosay());
	}
};

Generator.prototype.setupPackage = function setupPackage(){
	this.template("_package.json", "package.json",{
		appName : this.appname
	});
};

Generator.prototype.setupHTML = function setupHTML(){
	this.template("_index.html", "dist/ui_pages/index.html",{
		appname : this.appname
	});
}

Generator.prototype.setupJS = function setupJS(){
	this.template("_app.js", "dist/ui_scripts/" + this.appname + "__app.js",{
		appname : this.appname
	});

	this.template("_config.js", "dist/ui_scripts/" + this.appname + "__config.js",{
		appname : this.appname
	});

	// Local versions
	this.template("_app.js", "dist/ui_scripts/local/" + this.appname + "__app.js",{
		appname : this.appname
	});

	this.template("_config.js", "dist/ui_scripts/local/" + this.appname + "__config.js",{
		appname : this.appname
	});
}

Generator.prototype.setupGrunt = function setupGrunt(){
	this.template("_gruntfile.js", "Gruntfile.js",{
		dest : this.appDest,
		appPrefix : this.appPrefix
	});
};

Generator.prototype.installers = function installers(){

	 this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-message'],
		 bower : false,
      callback: function(){
		  this.spawnCommandSync("grunt",["init"]);
	  }.bind(this)
    });
};

Generator.prototype.gruntInit = function gruntInit(){

};

Generator.prototype.setupGitIgnore = function setupGitIgnore(){
	this.copy("_gitignore", ".gitignore");
};
