var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var charturl = 'https://www.ssense.com';
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsesizelist(str){
  var reg = /<option data[\d\w\W]+?<\/option>/g;
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

    if( res.code !== 200 ){ // mark 1
		var erroutput = url +'\n';
		fs.appendFile('productsize_N2.txt', erroutput, 'utf8', function (err) {
		if(err) console.log(err);
		});
    }else{ // mark 1
		var sizearr = [];		
		var chartlist = [];
		// log(res.body);
		var sizelist = parsesizelist(res.body);          
		// log(sizelist);

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
      	if(sizearr != null){// mark 2
      		if(cname == "XXL" || cname == "XL" || cname == "L" || cname == "M" || cname == "S" || cname == "XS" || cname == "XXS") cname = "UNIVERSAL";
        	if(cname == "" && sizearr != null) cname = "Numbered";
        	// log(cname);
        	// log(sizearr);
        	          
              switch(cname){ // mark 4              
                case "EU":{}
                case "FR":{}
                case "IT":{
                  for(i in sizearr){
                    var detail = [];
                    detail[0] = sizearr[i];
                    detail[1] = sizearr[i];
                    detail[2] = "0";
                    chartlist.push(detail);
                  }
                  break;
                }
                case "UNIVERSAL":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){                                          
                      case "XS":{
                        detail[0] = "XS";
                        detail[1] = "44";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "S":{
                        detail[0] = "S";
                        detail[1] = "46";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                  
                      case "M":{
                        detail[0] = "M";
                        detail[1] = "48";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                                          
                      case "L":{
                        detail[0] = "L";
                        detail[1] = "50";
                        detail[2] = "1";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "XL":{
                        detail[0] = "XL";
                        detail[1] = "52";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "XXL":{
                        detail[0] = "XXL";
                        detail[1] = "54";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                    }
                  }
                  break;
                }                
                case "W":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){                      
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
                        detail[0] = "38";
                        detail[1] = "54";
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
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
                      case "32":{
                        detail[0] = "32";
                        detail[1] = "42";
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
              }// mark 4            
            
      		var output = "";
      		for(i in chartlist){
      			output += url + "," + chartlist[i][0] + "," + chartlist[i][1] + "," + chartlist[i][2] + "\n"; 
      		}
      		// log(output);

      		fs.appendFile('productsize.txt', output, 'utf8', function (err){
      			if (err) console.log(err);
      		});
    		}// mark 2
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
