const readline = require('readline');
const R = require('ramda');
const regEx = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/g;
const shiftIdRegEx = /([0-9a-zA-Z]+)/g;
var shiftId;
var empArray = [];
var shiftArray = [];
var shiftVal;
var availableVal;
var finalShifts = new Array();

function main() {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', function(line){
      if(line.indexOf("Availability") >= 0 && (shiftVal != null)){
        findEmployee(line);
        shiftArray = [];
      }else if(line.indexOf("Availability") >= 0){
        if(empArray.length >= 1){
          empArray.push(availableVal);
        }else{
          findEmployee(line); 
        }
      }else{
        if(shiftArray.length >= 1){
          shiftId = shiftId[1];
          findShift(line);
        }else{
          findShift(line); 
        }
      }
    }).on('close', function(line){
      consoleFinalShiftIds(finalShifts);
    })

    function findShift(line){ // check for the available shifts
      shiftVal = line.match(regEx);
      shiftId = line.match(shiftIdRegEx)[1];
      shiftArray = R.clone(shiftVal);
      for(var i = 0; i<empArray.length; i++){
        var emp = empArray[i];
        for(var j=0;j<emp.length;j++){
          if(shiftArray && emp && (shiftArray[0] >= emp[0] && shiftArray[1] <= emp[1])){
            if(shiftId && finalShifts.indexOf(shiftId) === -1){
              finalShifts.push(shiftId);
            }
          }
        }
      }
    };

    function findEmployee(line){ //check for Employees 
      availableVal = line.match(regEx);        
      empArray = R.clone(new Array(availableVal));       
    }

    function consoleFinalShiftIds(shifts){ // Find the shift Ids to allocate employees 
      for(var i=0;i<shifts.length;i++){
        console.log("Shift", shifts[i]);
      }
    }
}

if (require.main === module) {
    main();
}