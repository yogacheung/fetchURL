var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var charturl = 'https://www.ssense.com';
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parseAva(str){
  var reg = /<option value=".*?_/g;
  var res = str.match(reg);
  return res;
}

function parseAvas(str){
  var reg = /<option value="(.*)?_/;
  var res = reg.exec(str);
  return res;
}

function parseConvList(str){
  var reg = />[\d\w\W]+?<\/tr/g;
  var res = str.match(reg);
  return res;
}

function parseITList(str){
  var reg = />[\d\w-]+?<\/td/g;
  var res = str.match(reg);
  return res;
}

function parseNum(str){
  var reg = />(.+)</;
  var res = reg.exec(str);
  return res;
}

function parseChartList(str){
  var reg = /<option value="[\d\w]+_/g;
  var res = str.match(reg);
  return res;
}

function parseChart(str){
  var reg = /<option value="(\d*)(\w*)_/;
  var res = reg.exec(str);
  return res;
}

function parseChartT(str){
  var reg = /(\d+x\d+)/;
  var res = reg.exec(str);
  return res;
}

function parsetype(str){
  var reg = />\n *&*n*b*s*p*;*\n* *[\d\w\n]+ *[\d\w\n]*\n/g;
  var res = str.match(reg);
  return res;
}

function parsetypev(str){
  var reg = />\n *&*n*b*s*p*;*\n*([A-Z]+)* *(\d+)*\n/;
  var res = reg.exec(str);
  return res;
}

function parseURL(str){
  var reg = /\sdata-route-size-chart="(.+?)"\s/;
  var res = reg.exec(str);
  return res;
}

///////////////////////////////////////////////////////////

function getList(callback){
  fs.readFile("urllist.txt", function(err, data){
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
      var erroutput = url + '\n';
      fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
        if (err) console.log(err);
      });
    }else{//mark1
      log(url);      
      var chartcheck = [];
      var chartlist = [];
      var chartava = [];

      var type = parsetype(res.body);
      // log(type);
      if(type !== null){//mark2      
        var typev;
        for(i in type){//mark3
          typev = parsetypev(type[i]);
          // log(typev);
          if(typev !== null && typev[2] != null){
            chartlist.push(typev[2]); 
            chartcheck.push(typev[1]); 
          }else if(typev !== null && typev[1] != null){
            chartlist.push(typev[1]);             
          }          
        }//mark3
        // log(chartcheck, chartcheck.length);
        // log(chartlist, chartlist.length);  

        var avalist = parseAva(res.body);
        var ava;
        for(i in avalist){
          ava = parseAvas(avalist[i]);
          chartava.push(ava[1]);
        }
        // log(chartava, chartava.length);

        var charttype = "";        
        if(chartcheck.length == 0){//mark4
          for(i in chartlist){
            switch(chartlist[i]){
              case "XXS":{}
              case "XS":{}
              case "S":{}
              case "M":{}
              case "L":{}
              case "XL":{}
              case "XXL":{}
              case "XXXL":{
                charttype = "S/M/L"
                break;
              }
              case "0":{}
              case "1":{}
              case "2":{}
              case "3":{}
              case "4":{}
              case "5":{}              
              case "6":{
                charttype = "1/2/3"
                break;
              }
            }            
          }//mark4
        }else var charttype = chartcheck[0];        
        // log(charttype); 

        if(charttype != "IT"){//mark5
          var curl = parseURL(res.body);
          if(curl !== null){//mark6
            unirest.get(charturl + curl[1]).end(function(res){
              var url2 = url;
              var charttype2 = charttype;
              var chartlist2 = chartlist;
              var chartava2 = chartava;
              log(url2);
              if(res.code !== 200){//mark7
                //log('err != 200');
                var erroutput = url + '\n';
                fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
                  if (err) console.log(err);
                });
              }else{//mark7
                var convlist = parseConvList(res.body);
                if(convlist !== null){//mark8
                  // log(convlist);
                  var listIT = [];
                  var posIT = 0;
                  var listtarget = [];
                  var postarget = 0;
                  for(i in convlist){
                    if(convlist[i].search("IT")>0 && posIT == 0){
                      var sizelist = parseITList(convlist[i]);
                      for(j in sizelist){
                        var size = parseNum(sizelist[j]);               
                        // log(size[1]);
                        listIT.push(size[1]);                        
                      }                   
                      posIT++;   
                    }
                    if(convlist[i].search(charttype2)>0 && postarget ==0){
                      var sizelist = parseITList(convlist[i]);
                      for(j in sizelist){
                        // log(sizelist[j]);
                        var size = parseNum(sizelist[j]);               
                        // log(size[1]);
                        if(size[1] != "US") listtarget.push(size[1]);
                      }                      
                      postarget++;
                    }
                    if(posIT > 0 && postarget > 0) break;
                  }
                  // log(chartlist2, chartlist2.length);
                  // log(listIT, listIT.length);
                  // log(listtarget, listtarget.length);

                  if(listtarget.length > 0 && listIT.length > 0){
                    var output = "";
                    for(i in chartlist2){
                      for(j in listtarget){
                        if(chartlist2[i] == listtarget[j] && listtarget[j] != "-" && listIT[j] != "-"){
                          var temp = 1;
                          for(k in chartava2){
                            if(chartlist2[i] == chartava2[k]){
                              temp = 0;
                              break;
                            } 
                          }                      
                          output +=  url2 + "," + listtarget[j] + "," + listIT[j] + "," + temp + "\n";                                                               
                          break;
                        }
                      }
                    }
                    // log(output);
                    fs.appendFile('productsize.txt', output, 'utf8', function (err){
                      if (err) console.log(err);
                    });
                  }
                }//mark8                
              }//mark7
            });
          }//mark6
        }else {//mark5
          log(url);
          // log(chartlist);
          // log(chartava);

          var output = "";
          for(i in chartlist){
            var temp = 1;
            for(j in chartava){
              if(chartlist[i] == chartava[j]){
                temp = 0;
                break;
              } 
            }
            output +=  url + "," + chartlist[i] + "," + chartlist[i] + ","  + temp + "\n";            
          }
          // log(output);
          fs.appendFile('productsize.txt', output, 'utf8', function (err){
            if (err) console.log(err);
          });

        }//mark5
      }//mark2
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
