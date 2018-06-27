var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parseSize(str){
  var reg = /[t|d]"[\n\r\s]+>[\n\r\s]+.*?[\n\r\s]+<\/label>/g;
  var res = str.match(reg);
  return res;
}

function parseData(str){
  var reg = />[\n\r\s]+(.*)?[\n\r\s]+<\/label>/;
  var res = reg.exec(str);
  return res;
}

function parseAvaliable(str){
  var reg = /d"[\n\r\s]+>[\n\r\s]+(.*)?[\n\r\s]+<\/label>/;
  var res = reg.exec(str);
  return res; 
}

function parseChart(str){
  var reg = /<td>.*?<\/td>/g;
  var res = str.match(reg);
  return res;
}

function parseCData(str){
  var reg = /<td>(.*)?<\/td>/;
  var res = reg.exec(str);
  return res;
}

function parseTitle(str){
  var reg = /<th>.*?<\/th>/g;
  var res = str.match(reg);
  return res;
}

function parseTData(str){
  var reg = /<th>(.*)?<\/th>/;
  var res = reg.exec(str);
  return res;
}

function parseNum(str){
  var reg = /(\d+.?\d*)?cm/;
  var res = reg.exec(str);
  return res;
}


///////////////////////////////////////////////////////////

function getList(callback){
  fs.readFile("urllisth.txt", function(err, data){
    if(err) throw err;
    var urlList = data.toString().split("\n");
    if(urlList !== null) callback(urlList);
    else callback(null);
  });
}

function fetch(url){
  unirest.get(url).end(function(res){
    if( res.code !== 200 ) log('err: ', url);
    else{
      //log(res.body);
      var content = parseSize(res.body);
      if(content !== null){
        //log(content);

        var temp = url;

        for(i in content){
          // var data = parseSize(content[i]);
          //log(data[1]);
          var ava = parseAvaliable(content[i]);
          if(ava!== null){
            // log("Avaliable:", ava[1]);
          temp += ',' + "Avaliable: " + ava[1];
          } 
        }

        var arr = [];

      var title = parseTitle(res.body);
      if(title !== null){
        // log(title);
        for(i in title){
          var T = parseTData(title[i]);
          // log(T[1]);
          arr[i] = T[1];
        }
      }

      var chart = parseChart(res.body);
      if(chart !== null){
        // log(chart);
        for(i in chart){
          var C = parseCData(chart[i]);
          if(C !== null){
            var num = parseNum(C[1]);
            // log(num);
            if(num !== null){
              // log(arr[i%arr.length],": ",num[1]);
              temp += ',' + arr[i%arr.length] + ": " + num[1];
            } else {
              // log(arr[i%arr.length],": ",C[1]);
              temp += ',' + arr[i%arr.length] + ": " + C[1];
          }
          }
        }
      }

        temp += '\n';

        fs.appendFile('productsizeh.txt', temp, 'utf8', function (err) {
          if (err) console.log('err');
        });
      }
    }
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
