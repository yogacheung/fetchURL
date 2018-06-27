var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsesizelist(str){
  var reg = /<option value="[\d\w-]">/g;
  var res = str.match(reg);
  return res;
}

function parsesizev(str){
  var reg = />([A-Z]*)([0-9]*)/;
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
  unirest.get(link).end(function(res){            
    var url = link;
    log(url);
    log(res.code);
    if(res.code !== 200 && res.code !== 405){ // mark 1
    var erroutput = url +'\n';
    fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
      if(err) console.log(err);
      });
    }else{ // mark 1
      var sizearr = [];   
      var chartlist = [];
      log(res.body);
      var sizelist = parsesizelist(res.body);          
      log(sizelist);

      if(sizelist != null){ // mark 5
        var cname = "";
        for(i in sizelist){
          var value = parsesizev(sizelist[i]);
          // log(value);
          if(value != null){
            if(value[2] != ""){
              sizearr[i] = value[2];
              cname = value[1]; 
            } 
            else{
              if(value[1] != ""){
                sizearr[i] = value[1];
                cname = value[1];           
              } 
            }     
          } 
        }
        // log(cname);
        // log(sizearr);          
      }// mark 5      
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
