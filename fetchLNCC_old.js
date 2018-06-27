var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var chart = 'http://www.ln-cc.com/';
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsechart(str){
  var reg = /<a title="[\d\w\W]+?"/g;
  var res = str.match(reg);
  return res;
}

function parseTable(str){
  var reg = /<tbody>.+?<\/tbody>/g;
  var res = str.match(reg);
  return res;
}

function parseTitle(str){
  var reg = /<th>[\d\w<]+/g;
  var res = str.match(reg);
  return res;
}

function parseTitleName(str){
  var reg = /<th>(.+)/;
  var res = reg.exec(str);
  return res;
}

function parseRow(str){
  var reg = /<tr>.+?<\/tr>/g;
  var res = str.match(reg);
  return res;
}

function parseCell(str){
  var reg = /<td>.+?<\/td>/g;
  var res = str.match(reg);
  return res;
}

function parseNum(str){
  var reg = /<td>(.+)<\/td>/;
  var res = reg.exec(str);
  return res;
}

function parseURL(str){
  var reg = /class="b-size_chart-link dialogify" href=".+">/g;
  var res = str.match(reg);
  return res;
}

function parseURLlink(str){
  var reg = /href="(.+)">/;
  var res = reg.exec(str);
  return res;
}

///////////////////////////////////////////////////////////

function getList(callback){
  fs.readFile("urllistLNCC.txt", function(err, data){
    if(err) log(err);
    var urlList = data.toString().split("\n");
    if(urlList !== null) callback(urlList);
    else callback(null);
  });
}

function fetch(url){
  var data = url.split(",");
  // log(data);
  unirest.get(data[0]).end(function(res){    
    // log(url);
    if( res.code !== 200 ){      
      var erroutput = data[0] + '\n';
      fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
        if (err) console.log(err);
      });
    }else{ 
        var charturl = parseURL(res.body);
        // log(charturl);

      if(charturl){        
        var chartlist = parsechart(res.body);
        // log(chartlist);      

        var chartlink = parseURLlink(charturl[0]);
        // log(chartlink[1]);        
        // var chartlist = parsechart(res.body);
        // log(chartlist);

        unirest.get(chart+chartlink[1]).end(function(res2){
          // log(res2.body);
          var data2 = data;
          var chart = (data2[1]).split("/");
          // log(chart);        
          var ITlist = [];
          var pslist = [];

          var temp = chart[0].substr(0,2);
          if(temp == "IT" || temp == "EU"){

          }else if(temp == "FR" || temp == "JP" || temp == "UK" || temp == "US"){

          }

          var table = parseTable(res2.body);
          if(table){
            // log(table);
            var pos = 0;
            var title = parseTitle(table[0]);
            if(title){
              // log(title);
              for(i in title){
                var name = parseTitleName(title[i]);
                // log(name[1]);
                if(name && name[1] == "IT"){
                  pos = i;
                  break;
                }
              }
              // log(pos);
              var row = parseRow(table[0]);
              // log(row);
              for(i in row){
                var cell = parseCell(row[i]);
                // log(cell); 
                if(cell){
                  for(j in cell){
                    var num = parseNum(cell[j]);
                    if(j == pos) {
                      // log(num[1]);
                      ITlist.push(num[1]);
                    }
                  }                            
                }
              }
              log(ITlist);

            }else{
              var erroutput = url + '\n';
              fs.appendFile('productsize_Nconv.txt', erroutput, 'utf8', function (err) {
                if (err) console.log(err);
              });
            }
          }else{
              var erroutput = url + '\n';
              fs.appendFile('productsize_Nconv.txt', erroutput, 'utf8', function (err) {
                if (err) console.log(err);
              });
            }
        });
      }else{
        var erroutput = url + '\n';
        fs.appendFile('productsize_Nconv.txt', erroutput, 'utf8', function (err) {
          if (err) console.log(err);
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
