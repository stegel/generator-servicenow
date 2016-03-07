# generator-servicenow [![NPM version][npm-image]][npm-url]
> Yeoman scaffold for building AngularJS apps on the ServiceNow platform

## Installation

Install `yo`, `grunt-cli`, `bower`, and `generator-sn-localDev`
```
npm install -g grunt-cli bower yo generator-sn-localDev
```

If you are planning on using Sass, you will need to first install Ruby and Compass:
- Install Ruby by downloading from [here](http://rubyinstaller.org/downloads/) or use Homebrew
- Install the compass gem:
```
gem install compass
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo servicenow`, optionally passing an app name:
```
yo servicenow
```
You will be prompted for the following information
1. Instance Name - this is the subdomain before .service-now.com
2. Username - the username you use to log in to the instance
3. Password - the password you use to log in to the instance
4. App Prefix - the app name you prefix all related records with in **ui_pages**, **ui_scripts**, and **content_css**. This will be used to grab these records and create local versions of their content.


## Generators

Available generators:

* [servicenow](#app) (aka [servicenow:app](#app))
* [servicenow:page](#page)
* [servicenow:script](#script)
* [servicenow:style](#style)
* [servicenow:sass](#sass)


You will be prompted for the following information
1. Instance Name - this is the subdomain before .service-now.com
2. Username - the username you use to log in to the instance
3. Password - the password you use to log in to the instance
4. App Prefix - the app name you prefix all related records with in **ui_pages**, **ui_scripts**, and **content_css**. This will be used to grab these records and create local versions of their content.

### App 
<a id="app"></a>

Sets up a new local development environment and pulls down all files with your *App Prefix*

Example:
```bash
yo servicenow
```
### page
<a id="page"></a>
Generates a new HTML page with the contents of a ui_page HTML field record. If the ui_page does not exist, it will create that page.
Example:
```bash
yo servicenow:page *pageName*
```

### script
<a id="script"></a>
Generates a new JS file with the contents of a ui_scripts script field record. If the ui_script does not exist, it will create that script.
Example:
```bash
yo servicenow:script *scriptName*
```

### style
<a id="style"></a>
Generates a new CSS file with the contents of a content_css style field record. If the content_css record does not exist, it will create that record.
Example:
```bash
yo servicenow:style *styleName*
```

### SASS
<a id="sass"></a>
Generates a new SASS file with the contents of a u_sass style field record. If the u_sass record does not exist, it will create that record.
Example:
```bash
yo servicenow:sass *sassName*
```

## License

MIT © [AJ Siegel]()

[npm-image]: https://badge.fury.io/js/generator-servicenow.svg
[npm-url]: https://npmjs.org/package/generator-servicenow