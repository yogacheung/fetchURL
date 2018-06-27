var http = require('http');
var unirest = require('unirest');
var fs = require('fs');

///////////////////////////////////////////////////////////

http.globalAgent.maxSockets = 50;
var charturl = 'https://www.ssense.com';
var log = console.log.bind(console);

///////////////////////////////////////////////////////////

function parsesizelist(str){
  var reg = /display_size":"[\d\w]+/g;
  var res = str.match(reg);
  return res;
}

function parsesizev(str){
  var reg = /:"([A-z]*)([0-9]*)/;
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
        	
            if(gender == "M"){ // mark 3
              // log("M");
              switch(cname){ // mark 4              
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
                      case "XXS":{
                        detail[0] = "XXS";
                        detail[1] = "42";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
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
                      case "M":{
                        detail[0] = "M";
                        detail[1] = "50";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "L":{
                        detail[0] = "L";
                        detail[1] = "52";
                        detail[2] = "1";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "XL":{
                        detail[0] = "XL";
                        detail[1] = "54";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "XXL":{
                        detail[0] = "XXL";
                        detail[1] = "56";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                    }
                  }
                  break;
                }
                case "Numbered":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
                      case "00":{
                        detail[0] = "00";
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
                case "Waist":{}
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
            }else { // mark 3
              switch(cname){ // mark 4
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
                      case "M":{
                        detail[0] = "M";
                        detail[1] = "44";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                      case "L":{
                        detail[0] = "L";
                        detail[1] = "46";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "XL":{
                        detail[0] = "XL";
                        detail[1] = "48";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                    }
                  }
                  break;
                }
                case "FR":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
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
                    }
                  }
                  break;
                }
                case "UK":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
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
                    }
                  }
                  break;
                }
                case "JP":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
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
                    }
                  }
                  break;
                }
                case "DK":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
                      case "30":{
                        detail[0] = "30";
                        detail[1] = "36";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "32":{
                        detail[0] = "32";
                        detail[1] = "38";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "34":{
                        detail[0] = "34";
                        detail[1] = "40";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "36":{
                        detail[0] = "36";
                        detail[1] = "42";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "38":{
                        detail[0] = "38";
                        detail[1] = "44";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "40":{
                        detail[0] = "40";
                        detail[1] = "46";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "42":{
                        detail[0] = "42";
                        detail[1] = "48";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                    }
                  }
                  break;
                }
                case "Numbered":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
                      case "00":{
                        detail[0] = "00";
                        detail[1] = "36";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "0":{
                        detail[0] = "0";
                        detail[1] = "38";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "1":{
                        detail[0] = "1";
                        detail[1] = "40";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "2":{
                        detail[0] = "2";
                        detail[1] = "42";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "3":{
                        detail[0] = "3";
                        detail[1] = "44";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "4":{
                        detail[0] = "4";
                        detail[1] = "46";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }
                      case "5":{
                        detail[0] = "5";
                        detail[1] = "48";
                        detail[2] = "0";
                        chartlist.push(detail);
                        break;
                      }                    
                    }
                  }
                  break;
                }
                case "US":{
                  for(i in sizearr){
                    var detail = [];
                    switch(sizearr[i]){
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
