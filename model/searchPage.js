const proRequest = require('./proRequest');
const htmlParsers = require('./parsers');
const fs = require('fs');
const head_user_agent = ['Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; rv:11.0) like Gecko)',
    'Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070309 Firefox/2.0.0.3',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070803 Firefox/1.5.0.12',
    'Opera/9.27 (Windows NT 5.2; U; zh-cn)',
    'Mozilla/5.0 (Macintosh; PPC Mac OS X; U; en) Opera 8.0',
    'Opera/8.0 (Macintosh; PPC Mac OS X; U; en)',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.6.2000 Chrome/26.0.1410.43 Safari/537.1 ',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E; QQBrowser/7.3.9825.400)',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0 ',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; BIDUBrowser 2.x)',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.0 Safari/536.11']
let Option = {
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


let num = head_user_agent.length;
let randN = Math.floor(Math.random() * num)
let hd = head_user_agent[randN]

Option["User-Agent"] = hd;
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
    if (!filters.length) {
        filters = filtersDefault;
    }    
    return proRequest.doGet(
        url,
        Option
    ).then((resp) => {
        let html = resp.body;
        // console.log(html)
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