const proRequest = require('./proRequest');
const htmlParsers = require('./parsers');
const fs = require('fs');
const Option = {
    //'Host': 'www.amazon.com',
    // 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0',
    "User-Agent": 'Webkit',
    'Content-Type': 'text/html; charset=UTF-8',
    'gzip': true
    //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    /*'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',*/
    // 'Cookie': 'session-id=134-3710033-3030046; session-id-time=2082787201l; i18n-prefs=USD; sp-cdn="L5Z9:CN"; csm-hit=tb:6ZVR7G5ER89YGBDVNETK+s-QQFM9FAWD05DSFC8VS36|1560739662203&t:1560739662203&adb:adblk_no; x-wl-uid=1Jq6lRuugNV4w6wCYN30jv+W2ORABXTl4V974FmI5IH6y90Mt+pZSQYNewaZOosWrz33vNoDFk1M=; ubid-main=133-6971374-8567325; session-token=Qk4mgZnElTjvpo1pGXFe24Dau2rC+zCZjBczT+iy2ns8DjuX+r5qY9xGoXgEWYkf09ZAFInw/Yi2rO5l5BXvKZZiNPbJLHc+FSlR1RzNLxLdmmxWvJClRTUz1weuuD5I0XEVhF0GZQPswKtAJA+hMylvHazEfFgAhVC9OM9zP1HApDnnXd0KnayYwlyzYjnKmn2s+/rRlapRDZPdTxsMKa7tgQgur8Klh1E9YzO1Ceezwy6d0I+JH2vIR0xd2dU6; lc-main=zh_CN',
    /*'Upgrade-Insecure-Requests': 1,
    'Cache-Control': 'max-age=0',
    'TE': 'Trailers'*/
};
const filtersDefault = ['seller', 'price', 'review', 'title', 'score'];
function _doRequest(url) {
    return proRequest.doGet(
        url,
        Option
    );
}

// https://www.amazon.com/Michael-Kors-Womens-Crossbody-Leather/dp/B07R75GTBT
function getUrlStr(keyWords, type = true) {
    let amz = 'https://www.amazon.com/s';
    let baidu = 'https://www.baidu.com/';

    let baseUrl = (type ? amz : baidu) + (type ? `?k=` + keyWords : '?kd=' + keyWords)
    return baseUrl;
}

function getContentByKeys(keyWords) {
    let url = getUrlStr(keyWords);
    return _doRequest(url);
}

function log(html) {
    // fs.open('out2_1.html');
    const out = fs.createWriteStream('out2_1.html');
    html.pipe(html).pipe(out);

}
function getProductCotent(url, filters = []) {
    if (!filters) {
        filters = filtersDefault;
    }
    return proRequest.doGet(
        url,
        Option
    ).then((resp) => {
        let html = resp.body;
        if (!filters) {
            return html;
        }
        return filters.map((item) => {
            switch (item) {
                case 'seller': return htmlParsers.getSeller(html); break;
                case 'score': return htmlParsers.getScore(html); break;
                case 'title': return htmlParsers.getTile(html); break;
                case 'price': return htmlParsers.getPrice(html); break;
                case 'review': return htmlParsers.getReview(html); break;
            }

        });
    }).then((data) => {
        let output = {
            url: url,
            asin: url.split('/').pop()
        }
        data.forEach((element, num) => {
            let key = filters[num];
            output[key] = element;
        });
        return output;
    });
}


module.exports = {
    getContentByKeys: getContentByKeys,
    getProductCotent: getProductCotent,
};