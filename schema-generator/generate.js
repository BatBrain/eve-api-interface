//uses npm scrape-it module to scrape 3rd party documentation website for current XML API structure and schema
"use strict"
const scrapeIt = require("scrape-it");

// Callback interface
scrapeIt(
  "http://eveonline-third-party-documentation.readthedocs.io/en/latest/xmlapi/character/char_contracts.html",
  {
    // Fetch the articles
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
    console.log(err || page);
  }
);

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
