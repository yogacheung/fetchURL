var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsehref(str){
  var reg = /<a href="\/(.*)?" /;
  var res = reg.exec(str);
  return res;
}

function parsetitle(str){
  var reg = /<a href=".*?" class="door-photo-wrapper"/g;
  var res = str.match(reg);
  return res;
}

///////////////////////////////////////////////////////////

function fetch(url){
  unirest.get(url).end(function(res){
    // log(url);    
    if(res.code !== 200){ //mark1
      log('error');
    }else{//mark1
      // log(url);      
      var output = "";

      var title = parsetitle(res.body);
      //log(title);
      for(i in title){        
        var href = parsehref(title[i]);
        //log(href);
        if(href !== null){//mark2      
          log(href[1]);
          output += "https://www.openrice.com/" + href[1] + "\n";
        }//mark2
      }

      fs.appendFile('openrice_urls.txt', output, 'utf8', function (err) {
        if(err) console.log(err);
      });

    }//mark1
  });      
}

function getContent(){
  var urlList = [
    "https://www.openrice.com/en/hongkong/restaurants?where=shatin" 
  ]
  
  for(i in urlList){
    for(var j=1; j<18; j++){
      if(j==1) fetch(urlList[i]);
      else fetch(urlList[i]+"&page="+j);  
    }
  }
}

/****************************************************************/

getContent();