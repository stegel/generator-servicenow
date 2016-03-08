# generator-servicenow [![NPM version][npm-image]][npm-url]
> Yeoman scaffold for building AngularJS apps on the ServiceNow platform

## Contents
* [Installation](#install)
* [Grunt](#grunt)
* [Generators](#generators)
* [Previewing Locally](#localPreview)

## Installation
<a name="install"></a>
Install `yo`, `grunt-cli`, and `generator-servicenow`
```
npm install -g grunt-cli yo generator-servicenow
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo servicenow`, optionally passing an app name:
```
yo servicenow __appname__
```

This will copy over the following files
* package.json - contains the required NPM packages to build on ServiceNow
* Gruntfile.js - contains tasks for pulling/pushing records betweeen your local machine and an instance
* __appname__app.js - a JavaScript seed for a suggested approach for Angular app bootstrapping
* __appname__index.html - a HTML seed for viewing your project on your local machine. See [Previewing Locally](#localPreview) for more info on this approach
* .gitignore - a seed .gitignore for ignoring node_modules, and local config file

## GRUNT
<a name="grunt"></a>
The generator installs a [Grunt](gruntjs.com) plugin that we developed called [grunt-servicenow](http://npmjs.org/grunt-servicenow). The plugin will allow you to pull records from an instance, make changes, and push up those changes to the instance when you are ready.

It is inspired by [sn-filesync](https://github.com/dynamicdan/sn-filesync) and [Sublime Text Plugin for ServiceNow](http://www.john-james-andersen.com/blog/service-now/updated-sublime-text-editor-for-servicenow.html)

The last generator step will run `grunt init` which is a Guided Setup to configure instance information (host, login credentials). Please make sure to complete this step to work with your instance.

## Generators
<a name="generators"></a>
Available generators:

* [servicenow](#app) (aka [servicenow:app](#app))
* [servicenow:page](#page)
* [servicenow:script](#script)
* [servicenow:scss](#scss)

### App 
<a id="app"></a>

Sets up a new local development environment and pulls down all files with your *App Prefix*

Example:
```bash
yo servicenow
```
### page
<a id="page"></a>
Generates a new blank HTML page with the ServiceNow `j:jelly` wrapper. The filename will be prefixed with the app prefix you specified.

Example:
```bash
yo servicenow:page page

# Outputs appprefix__page.xhtml
```

### script
<a id="script"></a>
Generates a blank JS file with the filename prefixed with the app prefix you specified.

Example:
```bash
yo servicenow:script sample

# Outputs appprefix__sample.js
```

### SASS
<a id="sass"></a>
Generates a blank SCSS file with the filename prefixed with the app prefix you specified.
Example:
```bash
yo servicenow:sass main

# Outputs appprefix__sample.scss
```

## Previewing Locally 
<a id="localPreview"></a>
In working on this, we spent some time thinking about how to view pages locally without having to constantly push changes to the instance. This is great when you are really focused on UI Design and leveraging REST calls for most of your interactions with the data. That way you don't have to worry about supporting Glide on your local machine.

To do this, we need address a few differences between a traditional web server and ServiceNow.

1) UI Pages have an extension of `.do`, so to reference them on the server we need `.do` but locally we want `.xhtml`.

We use [grunt-text-replace](https://github.com/yoniholmes/grunt-text-replace) to replace `.do` with `.xhtml` in all JS files and copy them to a separate folder `local`. Our local `index.html` references these JS files rather than the ones meant for the instance

2) Our approach to Angular's app bootstrap leverages [John Andersen's](http://www.john-james-andersen.com/blog/service-now) method for including the most recent versions of [JS](http://www.john-james-andersen.com/blog/service-now/linking-several-javascript-libraries-servicenow-ui-pages.html) and [CSS](http://www.john-james-andersen.com/blog/service-now/referencing-multiple-styles-servicenow-ui-pages.html) files. Since we aren't running Glide locally, we need a standard Angular shell page to load all the JavaScript and CSS.

We build a separate HTML file that is stored in our app's directory that you will load locally to preview the site.

## License

MIT © [AJ Siegel]()

[npm-image]: https://badge.fury.io/js/generator-servicenow.svg
[npm-url]: https://npmjs.org/package/generator-servicenow