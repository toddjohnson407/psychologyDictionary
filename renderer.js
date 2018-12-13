'use strict';

const fetch = require('node-fetch');
var remote = require('electron').remote;
var fs = require('fs');
// var electronDialog = remote.dialog;

var words = [];
var wordCount;
var html;
var termsArray = [];
var allFiles = ["review1", "review2", "review3", "review4"]

var splitString = function(data) {
  // console.log(data);
  var fileArray = data.split("  ");
  // termsArray.push(fileArray);
  console.log(fileArray.length);
  // termsArray = [].concat(...termsArray);
  // console.log(termsArray);
  words = fileArray;
  wordCount = words.length
  console.log(words);
  for (var i = 0; i < wordCount; i++) {
    if (words[i].indexOf(" ") > 0) {
      words[i] = words[i].split(" ").join("-");
    }
    getDefinitions(words[i]);
  }
}

var parseTermFiles = function() {
  for (var i = 0; i < 4; i++) {
    var read = fs.readFile(`./psychologyTerms/${allFiles[i]}.txt`, `utf8`, function(err, data) {
      splitString(data.toString());
    });
  }
}

var createTerm = function(word, definiton) {
  var termList = document.getElementById("terms");
  var term = document.createElement("LI");
  term.innerText = `${word}: \n ${definiton.trim()} \n \n`;

  termList.appendChild(term);

}

var getDefinitions = function(word) {
  var firstChar = word.substring(0,1);
  var url = `https://psychologydictionary.org/${word}`;

  fetch(url)
    .then(response => {
      html = response.text();
      // console.log(html);
      return html;
    })
    .then(html => {
      // console.log(html);

      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");

      var definiton = doc.getElementsByClassName("td-post-content");

      if (definiton.length > 0) {
        var text = definiton[0].textContent;

        var textDefinitionSplit = text.split("}");
        var textDefinition = textDefinitionSplit[3];
        var betaDefintion = textDefinition.split("Related");
        var finalDefinition = betaDefintion[0];
        console.log(finalDefinition);
        createTerm(word, finalDefinition);
      }
      // console.log("INNER");
      // console.log(document.body.innerText);
    })
}

parseTermFiles();
