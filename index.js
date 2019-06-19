const searchPageModel = require('./model/searchPage');
const { Parser } = require('json2csv');


/**
 * response.pipe(zlib.createGunzip()).pipe(output);
 */
/*
let keyword = 'bag'
try {
    searchPageModel
        .getContentByKeys(keyword)
        .then((resp) => {
            let content = resp.body;
            console.log(keyword);
            console.log(content.length);
            console.log(resp.headers);
            // console.log(content.substr(0,140));
          //return resp.pipe(zlib.createGunzip());
          // content;
          return content;
            return proUnzip(content);
        }).then((dt)=> {
            console.log('------------------------');
            console.log(dt)
           //  console.log(dt);
        //    zlib.gunzip(new Buffer(dt), function(mm){
        //        console.log(mm);
        //    });
        }
        ).catch((err) => {
            console.log(err);
        });

} catch (e) {
    console.log(e);
}


*/
/*
let url = 'https://www.amazon.com/Michael-Kors-Womens-Crossbody-Leather/dp/B07R75GTBT';

searchPageModel.getProductCotent(url).then((output) => {  
    console.log(output)
});*/

let keyword = 'Eyelash Growth';
searchPageModel.getContentByKeys(keyword).then((data) => {
    let links = data.links;
    let baseLink = 'https://www.amazon.com';
    let reqs = links.map(t => {
        let linkUrl = baseLink + t;
        return searchPageModel.getProductCotent(linkUrl);
    })

    return Promise.all(reqs);

}).then((output) => {
    // console.log(output);
    let fields = Object.keys(output[0]);
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(output);
        console.log(csv);
    } catch (err) {
        console.error(err);
    }
});