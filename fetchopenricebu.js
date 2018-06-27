var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsenum(str){
  var reg = /(\d+.*)/;
  var res = reg.exec(str);
  return res;
}

function parsejson(str){
  var reg = /<script type="application\/ld\+json">[\w\W]+?<\/script>/g;
  var res = str.match(reg);
  return res;
}

function parsescore(str){
  var reg = /class="score-div">\d+?<\/div>/g;
  var res = str.match(reg);
  return res;
}

function parserating(str){
  var reg = /="ratingValue">[\w\W]+?<\/div/g;
  var res = str.match(reg);
  return res; 
}

function parsedistrict(str){
  var reg = /district[\w\W]+?<\/a>/;
  var res = str.match(reg);
  return res;
}

function parsename(str){
  var reg = /smaller-font-name">(.+)?<\/div>/;
  var res = reg.exec(str);
  return res;
}

function parsestring(str){
  var reg = />(.+)</;
  var res = reg.exec(str);
  return res;
}

function parseprice(str){
  var reg = /priceRangeId=[\w\W\d=]+?<\/a>/g;
  var res = str.match(reg);
  return res; 
}

function parsecuisine(str){
  var reg = /restaurants\/[cuisine|type][\w\W]+?<\/a>/g;
  var res = str.match(reg);
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
      log('error');
    }else{//mark1
      // log(url);            
      var name = parsename(res.body);

      var cuisine = [];
      var pcuisine = parsecuisine(res.body);
      if(pcuisine != null){
        for(i in parseprice){
          var stringv = parsestring(parsecuisine[i]);
          if(stringv != null) cuisine.push(stringv[i]);
        }
      }

      var pprice = parseprice(res.body);
      if(pprice != null){
        var price = parsestring(pprice[1]);
      }

      var prate = parserating(res.body);
      if(prate != null){
        var rating = parsenum(prate[1]);
      }

      var pscore = parsescore(res.body);
      if(pscore != null){}\
        var score = [];
        for(i in pscore){
          var scorev = parsenum(pscore[i]);
          score.push(scorev[1]);
        }
      }      

      var pdistrict = parsedistrict(res.body)
      if(pdistrict != null){
        var district = parsestring(pdistrict[1]) ;
      }

      var output = {
        "name": name[1],
        "cuisine": cuisine,
        "price-range": price[1],
        "address": [22.3884, 114.1958], # first latitude, second longitude
        "rating": rating[1],
        "reviews": score,
        "district": district[1],
        "url": url
      }      

      fs.readFile('openrice_data.json', function (err, data) {
        var content = JSON.parse(data)
        content.push(output);

        fs.writeFile('openrice_data.json', content, 'utf8', function (err) {
          if(err) console.log(err);
        });
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