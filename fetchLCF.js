var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parseChartV(str){
  var reg = /<span id="currentCountry" code="(\w*)">/;
  var res = reg.exec(str);
  return res;
}

function parsetype(str){
  var reg = /<span class="product-category-size " default-value="[\w\d]+">/g;
  var res = str.match(reg);
  return res;
}

function parsetypev(str){
  var reg = /class="product-category-size " default-value="([\w\d]+)"/;
  var res = reg.exec(str);
  return res;
}

function parselink(str){
 var reg = /location.href='([\d\w\W]+)';/;
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
    // log(url);

    if( res.code !== 200 ){ // mark 1
      var erroutput = url + "," + gender +'\n';
      fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
        if (err) console.log(err);
      });
    }else{ // mark 1
      var newlink = parselink(res.body);      

      if(newlink !== null){ // mark 33
        // log(newlink[1]);
        unirest.get(newlink[1]).end(function(res2){// mark 34
          var url2 = url;
          var gender2 = gender;

          if( res2.code !== 200 ){ // mark 35
            var erroutput = url2 + "," + gender2 +'\n';
            fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
              if (err) console.log(err);
            });
          }else{ // mark 35            
            // log(res2.body);          
            log(url2);
            var cnamet = parseChartV(res2.body);            
            // log(cnamet[1]);
            var cnamev;
            if(cnamet != null){//mark 37
              if(cnamet[1] == "") cnamev = "S/M/L";  
              else cnamev = cnamet[1];
              // log(cnamev);

              var chartcheck = [];
              var chartlist = [];

              if(cnamev !== null){ // mark 2   
                var ctype = parsetype(res2.body);
                // log(ctype);
                
                if(ctype !== null){//mark 36
                  for(i in ctype){
                    var typev = parsetypev(ctype[i]);
                    chartcheck.push(typev[1]);
                  }
                  // log(chartcheck);

                  if(gender2 == "M"){ // mark 3
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
                              detail[2] = "0";
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
                            case "00":{
                              detail[0] = "0";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
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
                            case "32":{
                              detail[0] = "32";
                              detail[1] = "44";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
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
                            case "26":{
                              detail[0] = "26";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
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
                              detail[2] = "0";
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
                              detail[1] = "34";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "XS":{
                              detail[0] = "XS";
                              detail[1] = "36";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "S":{
                              detail[0] = "S";
                              detail[1] = "38";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "M":{
                              detail[0] = "M";
                              detail[1] = "40";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "L":{
                              detail[0] = "L";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "XL":{
                              detail[0] = "XL";
                              detail[1] = "44";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                          }
                        }
                        break;
                      }
                      case "DE":{}
                      case "FR":{
                        for(i in chartcheck){
                          var detail = [];
                          switch(chartcheck[i]){
                            case "34":{
                              detail[0] = "34";
                              detail[1] = "36";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "36":{
                              detail[0] = "36";
                              detail[1] = "38";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "38":{
                              detail[0] = "38";
                              detail[1] = "40";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "40":{
                              detail[0] = "40";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "42":{
                              detail[0] = "42";
                              detail[1] = "44";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }                    
                          }
                        }
                        break;
                      }
                      case "AUS":{
                        for(i in chartcheck){
                          var detail = [];
                          switch(chartcheck[i]){
                            case "4":{
                              detail[0] = "4";
                              detail[1] = "34";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "6":{
                              detail[0] = "6";
                              detail[1] = "36";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "8":{
                              detail[0] = "8";
                              detail[1] = "38";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "10":{
                              detail[0] = "10";
                              detail[1] = "40";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "12":{
                              detail[0] = "12";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "14":{
                              detail[0] = "14";
                              detail[1] = "44";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "16":{
                              detail[0] = "16";
                              detail[1] = "46";
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
                              detail[1] = "34";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "5":{
                              detail[0] = "5";
                              detail[1] = "36";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "7":{
                              detail[0] = "7";
                              detail[1] = "38";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "9":{
                              detail[0] = "9";
                              detail[1] = "40";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "11":{
                              detail[0] = "11";
                              detail[1] = "42";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
                            case "13":{
                              detail[0] = "13";
                              detail[1] = "44";
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
                            case "00":{
                              detail[0] = "00";
                              detail[1] = "34";
                              detail[2] = "0";
                              chartlist.push(detail);
                              break;
                            }
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
                          }
                        }
                        break;
                      }
                    }// mark 4
                  } // mark 3

                  var output = "";
                  for(i in chartlist){
                    output += url2 + "," + chartlist[i][0] + "," + chartlist[i][1] + "," + chartlist[i][2] + "\n"; 
                  }
                  // log(output);
                  
                  fs.appendFile('productsize.txt', output, 'utf8', function (err){
                    if (err) console.log(err);
                  });

                } // mark36
                
              } // mark 2

            }//mark 37           
          }// mark35
        });// mark 34
      }// mark 33
            
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
