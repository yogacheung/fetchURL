var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsejson(str){
  var reg = /<script type="application\/ld\+json">[\w\W]+?<\/script>/g;
  var res = str.match(reg);
  return res;
}

function parsename(str){
  var reg = /"name": "(.+)"/;
  var res = reg.exec(str);
  return res;
}

function parsecuisine(str){
  var reg = /"servesCuisine" : "(.+)"/;
  var res = reg.exec(str);
  return res;
}

function parselatitude(str){
  var reg = /"latitude": (.+),/;
  var res = reg.exec(str);
  return res;
}

function parselongitude(str){
  var reg = /"longitude": (.+)/;
  var res = reg.exec(str);
  return res;
}

function parseprice(str){
  var reg = /"priceRange": "(.+)"/;
  var res = reg.exec(str);
  return res;
}

function parserating(str){
  var reg = /class="header-score">(.+)?<\/div>/;
  var res = reg.exec(str);
  return res;
}

function parsescore(str){
  var reg = /class="score-div">\d+?<\/div>/g;
  var res = str.match(reg);
  return res;
}

function parsereviews(str){
  var reg = /(\d+.*)/;
  var res = reg.exec(str);
  return res;
}

function parsedistrict(str){
  var reg = /"addressLocality": "(.+)"/;
  var res = reg.exec(str);
  return res;
}

///////////////////////////////////////////////////////////

function getList(callback){
  fs.readFile("openrice_urls.txt", function(err, data){
    if(err) log(err);
    var urlList = data.toString().split("\n");
    if(urlList !== null) callback(urlList);
    else callback(null);
  });
}

function fetch(url){
  unirest.get(url).end(function(res){
    // log(url);
    if(res.code !== 200){ //mark1
      log(res.code);
    }else{//mark1
      log(url);          
      var pjson = parsejson(res.body);

      var name = parsename(pjson);
      var cuisine = parsecuisine(pjson);
      var price = parseprice(pjson);
      var latitude = parselatitude(pjson);
      var longitude = parselongitude(pjson);
      var rating = parserating(res.body);
      var previews = parsescore(res.body);
      var reviews = [];
      for(i in previews){
        var tempreviews = parsereviews(previews[i]);
        reviews.push(parseInt(tempreviews[1]));

      }
      var district = parsedistrict(pjson);

      var outjson = {
        "name": name[1],
        "cuisine": cuisine[1],
        "price-range": price[1],
        "address": [parseFloat(latitude[1]), parseFloat(longitude[1])],
        "rating": parseFloat(rating[1]),
        "reviews": reviews,
        "district": district[1],
        "url": url
      }
      // log(outjson);      

      fs.readFile('openrice_data.json', function (err, data) {        
        if(data){              
          //log(data);
          var addjson = JSON.parse(data);
          // log(addjson);          
          addjson.push(outjson);
          
          var content = JSON.stringify(addjson);
          fs.writeFile('openrice_data.json', content, function (err) {
            if(err) console.log(err);
          });
        }else{          
          var addjson = [];
          addjson.push(outjson);          
          var content = JSON.stringify(addjson);
          fs.writeFile('openrice_data.json', content, function (err) {
            if(err) console.log(err);
          });
        }
      });

    }//mark1
  });      
}

function getContent(){
  getList(function(urlList){
    if(urlList !== null){
      for(i in urlList){
        // log(urlList[i]);
        fetch(urlList[i]);
      }
    } 
  });
}

/****************************************************************/

getContent();