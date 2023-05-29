

var colors = require('colors');

module.exports = {

    info: variable => {

        const s = () => console.log('');

        if (variable) { console.log('/////////////////////////////////////////') }

        if (variable) {
            s()
            console.log(`---- VARIABLE Infromation ----`.yellow);
            s()
        }

        ///////////////////////////////////////////////////////////

        // String
        if (typeof variable === 'string') {
            console.log('Type: ' + 'String'.green);
            console.log('Length: ' + ` ${variable.length}`.green);
        }

        ///////////////////////////////////////////////////////////

        // Array 
        if (Array.isArray(variable)) {
            console.log('Type: ' + 'Array'.green);
            console.log('Length: ' + ` ${variable.length}`.green)
        }

        ///////////////////////////////////////////////////////////

        // Number
        if (typeof variable === 'number') {


            console.log('Type: ' + 'Number'.green);
            console.log('Length: ' + ` ${variable.toString().length}`.green);

            if (Number.isInteger(variable)) { console.log('Number-Type: ' + 'Integer'.green); }
            if (isNaN(variable)) { console.log(`Number Type: NaN`); }
        }

        ///////////////////////////////////////////////////////////


        // Object
        if (
            typeof variable === 'object' &&  // It Is typeof object
            !Array.isArray(variable) &&      // And Is Not An Array
            variable !== null &&             // And It Is Not Null
            typeof variable !== 'function'   // And It Is Not a Function
        ) {

            // Verify If It is a Date Object or A Regurlar Object
            if (Object.prototype.toString.call(variable) === "[object Date]") { console.log('Type: ' + 'Date Object'.green); }
            else {
                console.log('Type: ' + 'Object'.green)
                console.log('Porperties Length : ' + `${Object.keys(variable).length}`.yellow);
            }
        }


        ///////////////////////////////////////////////////////////

        //  Function

        if (variable instanceof Function) {


            if (Object.prototype.toString.call(variable) === "[object AsyncFunction]") { console.log('Type: ' + 'Async Function'.green); }
            if (Object.prototype.toString.call(variable) === "[object Function]") { console.log('Type: ' + 'Regular Function'.green); }
            console.log('Function Name: ' + `${variable.name}`.green);
            console.log('Function Arguments: ' + `${variable.length}`.green);



        }


        ///////////////////////////////////////////////////////////


        // Print Variable

        if (
            typeof variable === 'object' &&  // It Is typeof object
            !Array.isArray(variable) &&      // And Is Not An Array
            variable !== null &&             // And It Is Not Null
            typeof variable !== 'function'   // And It Is Not a Function
        ) {

            s()
            console.table(variable);
            s()
            console.log('/////////////////////////////////////////');
            s()

        } else if (variable) {
            s()
            console.log(variable);
            s()
            console.log('/////////////////////////////////////////');
            s()
        }


    }
}