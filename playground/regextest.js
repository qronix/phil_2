const regex = require('xregexp');

let body = '<h2 class="header v-fw-medium">Google Pixel Offer</h2> <h3 class="undefined v-fw-medium">Buy 1 Pixel 3 and get 1 on Verizon</h3><h2 class="header v-fw-medium">Unicorn Muffins</h2> <h3 class="undefined v-fw-medium">Buy 1 Sparkle Muffin and get a free pixie wand</h3>';
let offers =[];
let descs =[];
let promos = [];

regex.forEach(body,/<h2 class="header v-fw-medium">(?<offer>([^<]*))<\/h2>/g,(offer)=>{
    offers.push(offer[1]);
});
regex.forEach(body,/<h3 class="undefined v-fw-medium">(?<desc>([^<]*))<\/h3>/g,(desc)=>{
    descs.push(desc[1]);
});

if(offers.length === descs.length){
    for(let i=0; i<offers.length; i++){
        let offerObj = {
            'offer':offers[i],
            'desc':descs[i]
        }
        promos.push(offerObj);
    }
}

console.dir(promos);
