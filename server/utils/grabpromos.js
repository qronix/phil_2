const axios = require('axios');

let grabPromos =  ()=>{
    let promos = {};
    let promoUrl = 'https://www.bestbuy.com/site/featured-offers/mobile-phone-cell-phone-sale/pcmcat125500050005.c?id=pcmcat125500050005';

    axios.get(promoUrl)
    .then((response)=>{
        console.log(response.data);
    })
    .catch((err)=>{
        console.log(err);
    })
};

module.exports = {
    grabPromos
};