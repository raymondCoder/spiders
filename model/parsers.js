
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
            new RegExp(replacePair[0],'ig'),
            replacePair[1]
        ).trim()
    }
    return content;
}

module.exports = {
    getSeller: getSeller,
    getScore: getScore,
    getPrice: getPrice,
    getReview: getReview,
    getTile: getTile
}