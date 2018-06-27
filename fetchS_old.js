var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var charturl = 'https://www.ssense.com';
var chartid = 1;
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

function parseNumList(str){
  var reg = /data-\d+-cm="\d+ cm"/g;
  var res = str.match(reg);
  return res;
}

function parseNum(str){
  var reg = /data-(.+)-cm="(.+) cm"/;
  var res = reg.exec(str);
  return res;
}

function parseChartList(str){
  var reg = />[A-Za-z0-9]+<\/li>/g;
  var res = str.match(reg);
  return res;
}

function parseChart(str){
  var reg = />(.+)<\/li>/;
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
    if(err) throw err;
    var urlList = data.toString().split("\n");
    if(urlList !== null) callback(urlList);
    else callback(null);
  });
}

function fetch(url){
  unirest.get(url).end(function(res){
    if( res.code !== 200 ){
      // log('err != 200');
      var erroutput = url + '\n';
      fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
        if (err) console.log('err');
       });
    }else{
     //log(res.body);
      /*var content = parseData(res.body);
      if(content !== null){
        // log(content);
        for(i in content){
          var data = parseAvaSize(content[i]);
          // log("avaliable: ",data[1]);
        }
      }*/

      var temp = parseURL(res.body);
      if(temp !== null){
        // log(temp[1]);  
        var link = charturl + temp[1];
        // log(link);
        unirest.get(link).end(function(reslt){
          if( reslt.code !== 200 ){
            //log('err != 200');
            var erroutput = url + '\n';
            fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
              if (err) console.log('err');
            });
          }else{
            // log(reslt.body);
            var chartList = parseChartList(reslt.body);
            if(chartList !== null){
              // log(chartList);
              var sizearr = [];
              for(var i=0; i<chartList.length-2; i++){
                // log(chartList[i]);
                var chart = parseChart(chartList[i]);
                // log(chart[1]);
                sizearr[i] = chart[1];
                if(sizearr[i] == '00') sizearr[i] = "'00";
              }
              // log(sizearr, sizearr.length);
              var numList = parseNumList(reslt.body);
              var count = numList.length/sizearr.length;
              if(numList !== null && numList.length%sizearr.length == 0 && count>1){
                // log(numList, numList.length);                
                    var j = 0;
                    var k = 0;
                    var b = 0;
                    var temparr = [];
                    for(i in numList){
                      // log(numList[i]);
                      var num = parseNum(numList[i]);
                      // log(sizearr[j],' > ', num[1], " : ", num[2]);

                      var temparr2 = [];
                      if(num != null){            
                        temparr2[0] = url;
                        temparr2[1] = chartid;
                        temparr2[2] = sizearr[j];
                        temparr2[3] = num[1];
                        if(temparr2[3] == 15) temparr2[4] = num[2]*2;
                        else temparr2[4] = num[2];
                        temparr[b++] = temparr2;
                        k++;
                        if(k==count){
                          j++;
                          k=0;
                        }                      
                      }
                   }
                   // log(temparr);
                   for(r in temparr){
                          var min = 0;
                          var max = 0;
                          // log(temparr[r][3],parseInt(temparr[r][4]));
                          if(parseInt(temparr[r][4]) > 0){   
                            // log(temparr[r][3],temparr[r][4]);
                            for(var x=r; x>=0; x--){
                              if(temparr[r][4]>temparr[x][4] && temparr[r][3] == temparr[x][3]){
                                // log(temparr[r][4],'>',temparr[x][4]);
                                min = (parseInt(temparr[r][4])+parseInt(temparr[x][4]))/2;
                                break;
                              }
                            }
                            for(var q=r; q<temparr.length; q++){
                              if(temparr[r][4]<temparr[q][4] && temparr[r][3] == temparr[q][3]){
                                // log(temparr[r][4],'<',temparr[q][4]);                              
                                max = (parseInt(temparr[q][4])+parseInt(temparr[r][4]))/2-0.1;
                                break;
                              }                            
                            }
                            if(min == 0) min = parseInt(temparr[r][4])-(max-parseInt(temparr[r][4]))-0.1;                            
                            if(max == 0) max = parseInt(temparr[r][4])+(parseInt(temparr[r][4])-min)-0.1;                            
                          }
                          
                          // log('>>',temparr[r][3],temparr[r][4],min,max);
                          var output = temparr[r][0] + ',' + temparr[r][1] + ',' +  temparr[r][2] + "," + temparr[r][3] + "," + min.toFixed(1) + "," + max.toFixed(1) +'\n';
                          // log(output);
                          fs.appendFile('productsize.txt', output, 'utf8', function (err) {
                            if (err) console.log('err');
                           });
                        }
                        chartid++;
              }else {
                // log('err: ', url); 
                var erroutput = url + ',0\n';
                fs.appendFile('productsize_err.txt', erroutput, 'utf8', function (err) {
                  if(err) console.log('err');
                });
              }
            }else{
              // log('err: ', url); 
              var erroutput = url + ',0\n';
              fs.appendFile('productsize_err.txt', erroutput, 'utf8', function (err) {
                if(err) console.log('err');
              });
            }
          }
        });
      }else{
        var erroutput = url + '\n';
        fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
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
