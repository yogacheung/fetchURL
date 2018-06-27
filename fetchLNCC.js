var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var charturl = 'https://www.ssense.com';
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parseData(str){
  var reg = /<option value=".*?_/g;
  var res = str.match(reg);
  return res;
}

function parseAvaSize(str){
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

function parseChartName(str){
  var reg = /<a title="[\d\w-]+" class="js-swatchanchor/g;
  var res = str.match(reg);
  return res;
}

function parseChartV(str){
  var reg = /title="(\d*)-*(\w*)"/;
  var res = reg.exec(str);
  return res;
}

function parsetype(str){
  var reg = /,"SizeValue":"[\d\w]+",/g;
  var res = str.match(reg);
  return res;
}

function parsetypev(str){
  var reg = /,"SizeValue":"([\d\w]+)",/;
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

function fetch(link){  
  var data = link.split(",");
  // log(data);  

  unirest.get(data[0]).end(function(res){    
    // log(data[0]);
    var url = data[0];
    var gender = data[1];        
    log(url);

    if( res.code !== 200 ){ // mark 1
      var erroutput = url + "," + gender +'\n';
      fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
        if (err) console.log(err);
      });
    }else{ // mark 1
      var sizearr = [];
      var chartcheck = [];
      var chartlist = [];
      // log(res.body);

      var cnamet = parseChartName(res.body);
      // log(cnamet);      

      if(cnamet != null){ // mark 5
        var cname = parseChartV(cnamet[0]);
        // log(cname);
        var cnamev;  
        if(cname[2] !== null){ // mark 7
          if(cname[2] == "IT" || cname[2] == "EU" || cname[2] == "JP" || cname[2] == "UK" || cname[2] == "US" || cname[2] == "FR" || cname[2] == "AU" ) cnamev = cname[2];
          else cnamev = "S/M/L"
        }

        // log(cnamev);
        
        if(cnamev !== null){ // mark 2      
          for(i in cnamet){
            var typev = parseChartV(cnamet[i]);
            // log(i,typev[1], "-", typev[2]);
            // log(chartcheck.indexOf(typev[1]));
            if( cnamev != "S/M/L" && chartcheck.indexOf(typev[1]) == -1){
              chartcheck.push(typev[1]);
            }else if(cnamev == "S/M/L" && chartcheck.indexOf(typev[2]) == -1){
              chartcheck.push(typev[2]);
            }
          }
          // log(chartcheck);

          if(gender == "M"){ // mark 3
            // log("M");
            switch(cnamev){ // mark 4
              case "EU":{}
              case "IT":{
                for(i in chartcheck){
                  var detail = [];
                  detail[0] = chartcheck[i];
                  detail[1] = chartcheck[i];
                  detail[2] = "0";
                  chartlist.push(detail);
                }
                break;
              }
              case "S/M/L":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){                    
                    case "Extra Small":{}
                    case "XS":{
                      detail[0] = "XS";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "Small":{}
                    case "S":{
                      detail[0] = "S";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "Medium":{}
                    case "M":{
                      detail[0] = "M";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "Large":{}
                    case "L":{
                      detail[0] = "L";
                      detail[1] = "50";
                      detail[2] = "1";
                      chartlist.push(detail);
                      break;
                    }
                    case "Extra Large":{}
                    case "XL":{
                      detail[0] = "XL";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "XX Large":{}
                    case "XXL":{
                      detail[0] = "XXL";
                      detail[1] = "54";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "Large":{}
                    case "3XL":{
                      detail[0] = "3XL";
                      detail[1] = "56";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                  }
                }
                break;
              }
              case "JP":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "0":{
                      detail[0] = "0";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "1":{
                      detail[0] = "1";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "2":{
                      detail[0] = "2";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "3":{
                      detail[0] = "3";
                      detail[1] = "50";
                      detail[2] = "1";
                      chartlist.push(detail);
                      break;
                    }
                    case "4":{
                      detail[0] = "4";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "5":{
                      detail[0] = "5";
                      detail[1] = "54";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "6":{
                      detail[0] = "6";
                      detail[1] = "56";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                  }
                }
                break;
              }
              case "US":{}
              case "UK":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "34":{
                      detail[0] = "34";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "36":{
                      detail[0] = "36";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "38":{
                      detail[0] = "38";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "40":{
                      detail[0] = "40";
                      detail[1] = "50";
                      detail[2] = "1";
                      chartlist.push(detail);
                      break;
                    }
                    case "42":{
                      detail[0] = "42";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "44":{
                      detail[0] = "44";
                      detail[1] = "54";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "46":{
                      detail[0] = "46";
                      detail[1] = "56";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                  }
                }
                break;
              }
              case "WAIST":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "28":{
                      detail[0] = "28";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "30":{
                      detail[0] = "30";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "32":{
                      detail[0] = "32";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "34":{
                      detail[0] = "34";
                      detail[1] = "50";
                      detail[2] = "1";
                      chartlist.push(detail);
                      break;
                    }
                    case "36":{
                      detail[0] = "36";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "38":{
                      detail[0] = "40";
                      detail[1] = "54";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "40":{
                      detail[0] = "40";
                      detail[1] = "56";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                  }
                }
                break;
              }
            }// mark 4
          }else { // mark 3
            switch(cnamev){ // mark 4
              case "IT":{
                for(i in chartcheck){
                  var detail = [];
                  detail[0] = chartcheck[i];
                  detail[1] = chartcheck[i];
                  detail[2] = "0";
                  chartlist.push(detail);
                }
                break;
              }
              case "S/M/L":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "XXS":{
                      detail[0] = "XXS";
                      detail[1] = "36";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                    case "XS":{
                      detail[0] = "XS";
                      detail[1] = "38";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "S":{
                      detail[0] = "S";
                      detail[1] = "40";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "M":{
                      detail[0] = "M";
                      detail[1] = "42";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "L":{
                      detail[0] = "L";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "XL":{
                      detail[0] = "XL";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "XXL":{
                      detail[0] = "XXL";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "XXXL":{
                      detail[0] = "XXXL";
                      detail[1] = "50";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }                    
                  }
                }
                break;
              }
              case "FR":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "32":{
                      detail[0] = "32";
                      detail[1] = "36";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "34":{
                      detail[0] = "34";
                      detail[1] = "38";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "36":{
                      detail[0] = "36";
                      detail[1] = "40";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "38":{
                      detail[0] = "38";
                      detail[1] = "42";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "40":{
                      detail[0] = "40";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "42":{
                      detail[0] = "42";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "44":{
                      detail[0] = "44";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "46":{
                      detail[0] = "46";
                      detail[1] = "50";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "48":{
                      detail[0] = "48";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                  }
                }
                break;
              }
              case "AU":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "4":{
                      detail[0] = "4";
                      detail[1] = "36";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "6":{
                      detail[0] = "6";
                      detail[1] = "38";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "8":{
                      detail[0] = "8";
                      detail[1] = "40";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "10":{
                      detail[0] = "10";
                      detail[1] = "42";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "12":{
                      detail[0] = "12";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "14":{
                      detail[0] = "14";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "16":{
                      detail[0] = "16";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "18":{
                      detail[0] = "18";
                      detail[1] = "50";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "20":{
                      detail[0] = "20";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                  }
                }
                break;
              }
              case "JP":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "3":{
                      detail[0] = "3";
                      detail[1] = "36";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "5":{
                      detail[0] = "5";
                      detail[1] = "38";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "7":{
                      detail[0] = "7";
                      detail[1] = "40";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "9":{
                      detail[0] = "9";
                      detail[1] = "42";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "11":{
                      detail[0] = "11";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "13":{
                      detail[0] = "13";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "15":{
                      detail[0] = "15";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "17":{
                      detail[0] = "17";
                      detail[1] = "50";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "19":{
                      detail[0] = "19";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                  }
                }
                break;
              }
              case "US":{
                for(i in chartcheck){
                  var detail = [];
                  switch(chartcheck[i]){
                    case "0":{
                      detail[0] = "0";
                      detail[1] = "36";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "2":{
                      detail[0] = "2";
                      detail[1] = "38";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "4":{
                      detail[0] = "4";
                      detail[1] = "40";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "6":{
                      detail[0] = "6";
                      detail[1] = "42";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "8":{
                      detail[0] = "8";
                      detail[1] = "44";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "10":{
                      detail[0] = "10";
                      detail[1] = "46";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "12":{
                      detail[0] = "12";
                      detail[1] = "48";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "14":{
                      detail[0] = "14";
                      detail[1] = "50";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                    case "16":{
                      detail[0] = "16";
                      detail[1] = "52";
                      detail[2] = "0";
                      chartlist.push(detail);
                      break;
                    }
                  }
                }
                break;
              }
            }// mark 4
          } // mark 3
          
          var output = "";
          for(i in chartlist){
            output += url + "," + chartlist[i][0] + "," + chartlist[i][1] + "," + chartlist[i][2] + "\n"; 
          }
          // log(output);
          
          fs.appendFile('productsize.txt', output, 'utf8', function (err){
            if (err) console.log(err);
          });

        }else { // mark 2
          var erroutput = url + "," + gender +'\n';
          fs.appendFile('productsize_err.txt', erroutput, 'utf8', function (err) {
            if (err) console.log(err);
          });      
        } // mark 2
      }else { // mark 5
        var erroutput = url + "," + gender +'\n';
        fs.appendFile('productsize_err.txt', erroutput, 'utf8', function (err) {
          if (err) console.log(err);
        });      
      } // mark 5
      
    }// mark 1
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
