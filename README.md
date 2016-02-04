# grunt-slick-localization

> This plugin was a base of the grunt-swig-localization. It was modified to work in combination with this custom localization build to create seperate directories based on generated handlebar templates.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-slick-localization --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-slick-localization');
```

## The "slick_localization" task

### Overview
In your project's Gruntfile, add a section named `slick_localization` to the data object passed into `grunt.initConfig()`.


This project will combine html files with json data models. Once combined, it will output directories with all templates within them.

This plugin is used in combination with the assemble plugin. Assemble takes handlebar templates and code and generates html files. Handlebars uses a format that looks like {{ sometag }} . Since we need to use assemble first we need to put our localized strings in the html in a different way. Thus, you will see below the templates string usage of [[ sometag ]] . You must also have the dependency of the 'grunt-string-replace' plugin or this entire thing is pretty useless.

##Example of json template in directory 'localization_data':

  about--en.json
  {
    "about": "about"
  }

  about--span.json
  {
    "about": "sobre"
  }

  index--en.json
  {
    "hello": "hello"
  }

  index--span.json
  {
    "hello": "hola"
  }

##Example of html template in directory 'dist/_core':

  index.html
    <h1>[[ hello ]]</h1>

  about.html
    <h1>[[ about ]]</h1>


```js
grunt.initConfig({
  slick_localization: {
      main: {
        src: ['dist/_core/*.html', 'localization_data/*.json'],
              outputDir: 'dist/builds/', //output of the files and folders
              templateDir: 'dist/_core/', //directory where the html templates are located
              templateDataDir: 'localization_data', //directory where the template data exists.
              localizationBuilds: ['en','fr','span'] //a data array of the directories the system will generate all template files to.
      }
  }
});
```


