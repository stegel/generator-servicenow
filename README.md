# generator-snow [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
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

Run `yo snow`, optionally passing an app name:
```
yo snow
```
You will be prompted for the following information
1. Instance Name - this is the subdomain before .service-now.com
2. Username - the username you use to log in to the instance
3. Password - the password you use to log in to the instance
4. App Prefix - the app name you prefix all related records with in **ui_pages**, **ui_scripts**, and **content_css**. This will be used to grab these records and create local versions of their content.


## Generators

Available generators:

* [snow](#app) (aka [snow:app](#app))
* [snow:page](#page)
* [snow:script](#script)
* [snow:style](#style)
* [snow:sass](#sass)


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
yo snow
```
### page
<a id="page"></a>
Generates a new HTML page with the contents of a ui_page HTML field record. If the ui_page does not exist, it will create that page.
Example:
```bash
yo snow:page *pageName*
```

### script
<a id="script"></a>
Generates a new JS file with the contents of a ui_scripts script field record. If the ui_script does not exist, it will create that script.
Example:
```bash
yo snow:script *scriptName*
```

### style
<a id="style"></a>
Generates a new CSS file with the contents of a content_css style field record. If the content_css record does not exist, it will create that record.
Example:
```bash
yo snow:style *styleName*
```

### SASS
<a id="sass"></a>
Generates a new SASS file with the contents of a u_sass style field record. If the u_sass record does not exist, it will create that record.
Example:
```bash
yo snow:sass *sassName*
```

## License

MIT © [AJ Siegel]()


[npm-image]: https://badge.fury.io/js/generator-snow.svg
[npm-url]: https://npmjs.org/package/generator-snow
[daviddm-image]: https://david-dm.org/stegel/generator-snow.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stegel/generator-snow
[coveralls-image]: https://coveralls.io/repos/stegel/generator-snow/badge.svg
[coveralls-url]: https://coveralls.io/r/stegel/generator-snow
