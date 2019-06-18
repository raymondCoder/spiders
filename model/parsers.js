
function getSeller(html) {
    //  let step1 = html.match(/<div\s+id="merchant-info"\s+class="a-section\sa-spacing\-(.*)[\r|\n]+(.*)/ig)
    let step1 = html.match(/sellerProfileTriggerId\W+[\w|\s]+\W+/ig);
    if (!step1 || !Array.isArray(step1) || !step1.length) {
        return false;
    }

    let step2 = step1[0].match(/\>[\w|\s]+\</ig);
    if (!step2 || !Array.isArray(step2) || !step2.length) {
        return false;
    }
    return step2[0].replace(/>|</ig, '');
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

function getPrice(html) {
    let step1 = html.match(/id="priceblock_ourprice"(.*)[^<]/ig);
    if (!step1 || !Array.isArray(step1) || !step1.length) {
        return false;
    }
    let step2 = step1[0].match(/>(.*)</)
    if (!step2 || !Array.isArray(step2) || !step2.length) {
        return false;
    }
    return step2[1].replace(/[a-z]+/ig, '');
}
function getTile(html) {
    let step1 = html.match(/id="productTitle"(.*)[\r|\n]+[\w|\s]+/ig);
    if (!step1 || !Array.isArray(step1) || !step1.length) {
        return false;
    }
    let step2 = step1[0].replace(/\r|\n/ig, '').match(/>[\w|\s]+/);
    if (!step2 || !Array.isArray(step2) || !step2.length) {
        return false;
    }
    return step2[0].replace(/>\s+/gi, '');;
}


function getReview(html) {
    let step1 = html.match(/id="acrCustomerReviewText"(.*)[^<]/ig);
    if (!step1 || !Array.isArray(step1) || !step1.length) {
        return false;
    }
    let step2 = step1[0].match(/>[\d|,]+/ig)
    if (!step2 || !Array.isArray(step2) || !step2.length) {
        return false;
    }
    return step2[0].replace('>', '');
}

module.exports = {
    getSeller: getSeller,
    getScore: getScore,
    getPrice: getPrice,
    getReview: getReview,
    getTile: getTile
}