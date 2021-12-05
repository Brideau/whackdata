(function(incomeTaxCanada, undefined){

/* To get jshint off my case */
/* globals ranking: true, flatTax: true, allAdjusted: true, bracketCreep: true, hiddenTaxes: true, taxDiff: true */

incomeTaxCanada.provinceLookup = {
  "Alberta": "ab",
  "British Columbia": "bc",
  "Manitoba": "mb",
  "New Brunswick": "nb",
  "Newfoundland and Labrador": "nl",
  "Northwest Territories": "nt",
  "Nova Scotia": "ns",
  "Nunavut": "nu",
  "Ontario": "on",
  "Prince Edward Island": "pe",
  "Quebec": "qc",
  "Saskatchewan": "sk",
  "Yukon": "yt"
};

// This takes each set of data and passes it to the appropriate functions to be visualized
var rankingCb = function(data) {
  // See ranking.js
  ranking.visualize(data.data);
};
var flatTaxCb = function(data) {
  // See flattax.js
  flatTax.visualize(data.data);
};
var bracketCreepCb = function(data) {
  // See bracketCreep.js
  bracketCreep.visualize(data.data);
};
var hiddenTaxesCb = function(data) {
  // See hiddenTaxes.js
  hiddenTaxes.visualize(data.data);
};
var taxDiffCb = function(data) {
  // See taxDiff.js
  taxDiff.visualize(data.data);
};

var init = function() {
  Papa.parse("/public/data/201604/Ranking.csv", {
    download: true,
    header: true,
    complete: rankingCb,
  });
  Papa.parse("/public/data/201604/FlatTax.csv", {
    download: true,
    header: true,
    complete: flatTaxCb,
  });
  Papa.parse("/public/data/201604/BracketCreep.csv", {
    download: true,
    header: true,
    complete: bracketCreepCb,
  });
  Papa.parse("/public/data/201604/HiddenTaxes.csv", {
    download: true,
    header: true,
    complete: hiddenTaxesCb,
  });
  Papa.parse("/public/data/201604/TaxDiff.csv", {
    download: true,
    header: true,
    complete: taxDiffCb,
  });
};

$(init());

var checkSize = _.debounce(function() {
  var windowSize = window.screen.availWidth;
  if (windowSize < 480) {
    $(".sizewarning").css("display", "block");
  } else {
    $(".sizewarning").css("display", "none");
  }
}, 250);

checkSize();
$(window).resize(checkSize);
window.addEventListener('orientationchange', checkSize);

}(window.incomeTaxCanada = window.incomeTaxCanada || {}));
