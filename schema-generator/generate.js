//uses npm scrape-it module to scrape 3rd party documentation website for current XML API structure and schema
"use strict"
const scrapeIt            = require("scrape-it");
const fs                  = require('fs');
const LineByLineReader    = require('line-by-line'), lr = new LineByLineReader('documentation-urls.txt');


var finalOutput = {
  routes : []
};

lr.on('error', function (err) {})
.on('line', function (line) {
	lr.pause();
    console.log(line)
    scraper(line)

	}, 100)
.on('end', function () {
  var jsonToWrite = JSON.stringify(finalOutput);
  fs.writeFile('API-Endpoints.json', jsonToWrite, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});


function scraper(url) {
  scrapeIt( url ,
    {
      uri : {
        selector : "code.docutils.literal > span.pre"
      },
      parameters : {
        selector : "[itemprop=articleBody] > .section ul tbody tr:not(:first-child)",
        convert : (x) => {
          return x.replace(/[^\,\\)\(\w]{2,}/g, "*n*").splitEvery("*n*", 3)
        }
      },
      resultData : {
        selector : "#result-data tbody tr:not(:first-child)",
        convert : (x) => {
          return x.replace(/[^\,\.\\\)\(\w]{2,}/g, "*n*").splitEvery("*n*", 3)
        }
      }
    },
    (err, page) => {
      finalOutput.routes.push(page)
      lr.resume();
    });
}


String.prototype.splitEvery = function ( splitter, every ){

    var array = this.split( splitter), newString = '', newArray = [], formattedObjs = [];

    array.forEach(function( elem, index, array ){


      if ((index + 1) % every === 0) {
        newString += elem
        newArray.push(newString)
        newString = ""
      } else {
        newString += elem + "*n*"
      }

    });

    newArray.forEach(function(elm){
      var newObj = {
        name : "",
        type : "",
        desc : ""
      }
      elm.split("*n*").forEach(function(td, index){
        if (index === 0) {
          newObj.name = td
        } else if (index === 1) {
          newObj.type = td
        } else if (index === 2) {
          newObj.desc = td
        }
      })
      formattedObjs.push(newObj)
    })

    return formattedObjs
};
