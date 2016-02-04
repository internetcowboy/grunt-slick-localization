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

  grunt.registerMultiTask('swigLocalization', 'swig templater', function(taskConfig) {
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

              // Determine if it's an html.swig or .json file
              if(extension == '.html') {
                  templates[fileName] = {
                      templateFile: file,
                      outputFile: fileName
                  }

              }else if(extension == '.json') {
                  var subMatches = fileName.match(/([\w]+)--(\w+)/);
                  if(subMatches && subMatches[1] && subMatches[2]) {
                      var lang = subMatches[2];
                      fileName = subMatches[1];
                      templateData[fileName] = templateData[fileName] || {};

                      var langObject = grunt.file.readJSON(file);

                      templateData[fileName][lang] = langObject

                  }
              }

          }
          
      });

      //loop through each language 
      for(var loc in localizationBuilds) {

          // Generate the html files and output them to the dist directory
          for(var fileName in templates) {
              var template = templates[fileName];
              var lang = localizationBuilds[loc];
              var data = templateData[fileName][lang];
              var outputFile = outputDir + '/' + lang + '/' + template.outputFile + '.html';
              grunt.file.write(outputFile, swig.renderFile(template.templateFile, data));
              grunt.log.writeln('Generated localized file: ' + outputFile);
          }

      }
      

  });

};
