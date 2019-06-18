const util = require('util');
const request = require('request');

const proRequestGet = util.promisify(request.get);


function doGet(url, option) 
{
    return proRequestGet(url, option);
}


module.exports = {
    doGet: doGet
};