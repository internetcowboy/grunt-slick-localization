/*
 * grunt-slick-localization
 * https://github.com/internetcowboy/grunt-slick-localization
 *
 * Copyright (c) 2016 Codin Pangell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs');
  var swig = require('swig');
  var path = require('path');

  grunt.registerMultiTask('slick_localization', 'swig templater', function(taskConfig) {
      var outputDir = process.cwd() + '/' + this.data.outputDir;
      var templateDir = process.cwd() + '/' + this.data.templateDir;
      var localizationBuilds = this.data.localizationBuilds;

      var templateData = {};
      var templates = {};

      this.filesSrc.forEach(function(file) {
          var matches = file.match(/([\w_\-]+)((\.html)|(\.json))/);
          if(matches && matches[1] && matches[2]) {
              var fileName = matches[1];
              var extension = matches[2];

              // Determine if it's an .html or .json file
              if(extension == '.html') {
                  templates[fileName] = {
                    templateFile: file,
                    outputFile: fileName
                  }
              } else if (extension == '.json') {

                var originalFile = file;

                //parse string for 
                var languageDirectory = fileName;           // en_gb
                var tmpfile = file.split("--")[0];
                tmpfile = tmpfile.split("/")[1];            // index

                var country = file.split("--")[1];
                if (country.indexOf(":")>0) {
                  //follows standard at:en_gb structure
                  country = country.split(":")[0] + "/";    // en/
                } else {
                  //follows a en_gb structure, which is a default language document.
                  country = "";
                  // languageDirectory: index--en_gb
                  languageDirectory = languageDirectory.split("--")[1]; // en_gb
                }

                //reset variable for file
                file = tmpfile; // index

                //determine path of language
                var lang = "";
                if(languageDirectory && file && country) {
                  lang = country + languageDirectory;
                } else {
                  lang = languageDirectory;
                }

                //save to structure.
                fileName = file;
                templateData[fileName] = templateData[fileName] || {};
                var langObject = grunt.file.readJSON(originalFile);
                templateData[fileName][lang] = langObject;

              }

          }
          
      });

      //loop through each language 
      for(var loc in localizationBuilds) {

          // Generate the html files and output them to the dist directory
          for(var fileName in templates) {

              var template = templates[fileName];
              var lang = localizationBuilds[loc];
              var data = null;
              
              if (templateData[fileName][lang]){
                data = templateData[fileName][lang];
              }

              //is the data missing? If so, find the template that for this countries language.
              var _isTemplate = false;
              if (!data) {

                  /*
                    Example of files that override the default en_gb.
                    index--at/en_gb.json
                    index--cz/en_gb.json
                    index--en_gb.json (this would be the template file for all en_gb localizations)
                  */

                  //find the default language for this page.
                  if (lang.indexOf("/")>0){
                    var _tmpLang = lang.split("/")[1];
                    var _languageTemplateFilePath = process.cwd() + '/' + this.data.jsonPath  + template.outputFile +"--"+ _tmpLang +".json";
                    data = grunt.file.readJSON(_languageTemplateFilePath);
                  } else {
                    //this is a template file (en_gb)
                  }
              } else {
                _isTemplate=true;
              }
              
              //save this file out
              if (!_isTemplate) {
                var outputFile = outputDir + lang + '/' + template.outputFile + '.html';
                grunt.file.write(outputFile, swig.renderFile(template.templateFile, data));
                grunt.log.writeln('Generated localized file: ' + outputFile);
              }
          }

      }

  });

};
