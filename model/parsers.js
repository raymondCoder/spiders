function getSeller(html) {
    let rules = [
        'sellerProfileTriggerId\\W+[\\w|\\s]+\\W+',
        '>[\\w|\\s]+<',
        '[\\w|\\s]+'
    ]
    return _ruleSequence(html, rules);

}


function getPrice(html) {
    /* let step1 = html.match(/id="priceblock_ourprice"(.*)[^<]/ig);
     if (!step1 || !Array.isArray(step1) || !step1.length) {
         return false;
     }
     let step2 = step1[0].match(/>(.*)</)
     if (!step2 || !Array.isArray(step2) || !step2.length) {
         return false;
     }
     return step2[1].replace(/[a-z]+/ig, '');
 */
    let rules = [
        'id="priceblock_ourprice"(.*)[^<]',
        '>(.*)<',
        '[\\d|.|,]+'
    ]
    return _ruleSequence(html, rules);
}

function getScore(html) {
    let step1 = html.match(/class="a-icon-alt">[\w|\s|.]+[^<]/ig)

    if (!step1 || !Array.isArray(step1) || !step1.length) {
        return false;
    }

    let step2 = step1[0].split('>');
    if (!step2 || !Array.isArray(step2) || !step2.length) {
        return false;
    }

    return step2[1];
}

function getTile(html) {
    let rules = [
        'id="productTitle"(.*)[\\r|\\n]+[\\w|\\s]+',
        '>[\\w|\\s]+',
        '\\s[\\w|\\s]+'
    ]
    return _ruleSequence(html, rules, ['\n', '']);
}

function getReview(html) {
    let rules = [
        'id="acrCustomerReviewText"(.*)[^<]',
        '>[\\d|,]+'
    ]
    return _ruleSequence(html, rules, ['>', '']);
}

function _ruleSequence(html, rules, replacePair = []) {
    let result = true;
    let i = 0;
    let total = rules.length;
    let content = html;
    while (result && i < total) {
        let ruleItem = new RegExp(
            rules[i],
            "ig"
        );
        let handleReseult = ruleItem.exec(content);
        if (!handleReseult || !Array.isArray(handleReseult) || !handleReseult.length) {
            result = false;
        } else {
            content = handleReseult[0];
        }

        i++;
    }
    if (!result || !content) {
        return false;
    }
    if (replacePair.length) {
        content = content.replace(
            new RegExp(replacePair[0], 'ig'),
            replacePair[1]
        ).trim()
    }
    return content;
}

function isLanguage(html) {
    //<html lang="zh-cn"
    //<html lang="en-us"
    let step1 = html.match('<html lang="zh-cn"');
    if (step1) {
        return 'zh';
    }
    let step2 = html.match('<html lang="en-us"');
    if (step2) {
        return 'en';
    }
}


//
function getTotalItems(html) {
    //<span>1-48 of over 100,000 results for</span>
    // 显示： 1-48条， 共超过100,000条</span>
    //a.match(/共超过100,000条<\/span>/ig)[0].match(/[\d|,]+/ig)[0]
    if (isLanguage(html) == 'en') {

        let step1 = html.match(/1-48\sof[\d|,]+\s+results\s+for<\/span>/ig);
        let step1 = html.match(/over[\s|\d|,]+results/ig);
        if (!step1 || !Array.isArray(step1)) {
            return false;
        }
        return step1[0].match(/[\d|,]+/ig)[0]
    }

    if (isLanguage(html) == 'zh') {

        let step1 = html.match(/共[\d|,]+条<\span>/ig);
        if (!step1 || !Array.isArray(step1)) {
            let step1_1 = html.match(/共超过[\d|,]+条/ig);
            if (!step1_1 || !Array.isArray(step1_1)) {
                return false;
            }
            step1 = step1_1;

        }

        let step2 = step1[0].match(/[\d|,]+/ig);
        if (!step2 || !Array.isArray(step2)) {
            return false;
        }
        return step2[0];
    }

    return false;
}


function getSearchItemslinks(html) {
    // var a = document.body.innerHTML; 
    // var b = a.match(/href="\/[\w|-]+\/dp\/[\w]+/ig); var  cc= []; b.forEach((s)=>{ if(!cc.includes(s)){ cc.push(s);} }); var dd = cc.map(s=>{  return s.replace(/href="/ig, ''); });    
    // [\d|\,]+

    let statstics = html.match(/显示：[\d|\s\-]+条，[\s]+共[\W|\d|,]+/ig);
    if (!statstics) {
        statstics = html.match(/[\d|\s\-]+of[\s|\d|,|\w]+results/ig)
    }

    // console.log(statstics);
    let total = 0;
    let totalPage = 0;
    let numPerpage = 1;
    let currentPage = 1;
    if (statstics) {
        statstics = statstics[0].match(/[\d|\-|,]+/g);
        let [from, to] = statstics[0].split('-');
        numPerpage = to - from + 1;
        currentPage = Math.ceil((to - 1) / numPerpage);
        total = Number(statstics[1].replace(/,/ig, ''));
        totalPage = Math.ceil(Number(total / numPerpage));
    }

    let content = html.match(/\/[\w|-]+\/dp\/[\w]+/ig);

    if (!content) {
        return content;
    }
    var links = [];
    content.forEach((link) => {
        let item = link.replace(/href="/ig, '');
        if (!links.includes(item)) {
            links.push(item)
        }
    });

    return {
        total: total,
        numPerpage: numPerpage,
        currentPage: currentPage,
        totalPage: totalPage,
        links: links
    };

}
module.exports = {
    getSeller: getSeller,
    getScore: getScore,
    getPrice: getPrice,
    getReview: getReview,
    getTile: getTile,
    getSearchItemslinks: getSearchItemslinks
}