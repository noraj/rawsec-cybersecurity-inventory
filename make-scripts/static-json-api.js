var srcData = require('../temp/data.json'), //load your json file
    path = require('path'),
    staticApi = require('static-api'); //load the module

var destFolder = path.join(__dirname, '../temp/api/');

// helper to add the number of items in each category array
function iterate(obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === 'object') {
                if (Array.isArray(obj)) {
                    // don't iterate arrays
                    break;
                }
                if  (Array.isArray(obj[property])) {
                    // add the number of items
                    obj['items'] = obj[property].length;
                }
                iterate(obj[property]);
            }
        }
    }
    return obj;
}

new staticApi({
    outputFolder: destFolder, //where the data will be stored
    object: iterate(srcData) //the object to create the file structure from
});
