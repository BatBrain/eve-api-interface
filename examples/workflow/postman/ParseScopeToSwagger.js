//Postman Code. Recommend to run this with Postman
//Requires an EVE SSO auth token in the parameters
//Parses the response from /api/ endpoint to a partially populated swagger formatted json object.
//As API only responds with a partial list and is not complete, this has been abandonded for a different methid.
//May still be viable for later or as example of req/res structure.

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.eveonline.com",
  "port": null,
  "path": "//api/CallList.xml.aspx",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "6603d1fb-3a87-f9e5-6be2-13fcfb4b8aa2"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();

// Test Code
// Copy past this into the test section of the request in postman

tests["Status code is 200"] = responseCode.code === 200;

if (responseCode.code === 200) {
    var jsonObject = xml2Json(responseBody);
    var ResponseJson = jsonObject.eveapi.result.rowset;

    var list = { paths : {}};
    ResponseJson[1].row.forEach(function(call) {
        var uri = "";
        if (call.$.type == "Corporation") {
            uri = "/corp/"+call.$.name;
        } else if (call.$.type == "Character") {
            uri = "/char/"+call.$.name;
        } else {
            uri = "/"+call.$.type+"/"+call.$.name;
        }
        var obj = {};
        obj[uri] = {};

        Object.assign(obj[uri], {
            description : call.$.description,
            operationID : queryConstructor,
            parameters : [],
            responses : {
                200 : {
                    description : "",
                    examples : {},
                    headers : {},
                    schema : {}
                }
            },
            tags : []
        });
        Object.assign(list.paths, obj);
    });
    console.log(JSON.stringify(list));
}

 
