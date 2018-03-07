"use strict";
let transitionWordsEnglish = require("../researches/english/transitionWords.js")().allWords;
let twoPartTransitionWordsEnglish = require("../researches/english/twoPartTransitionWords.js");
let transitionWordsGerman = require("../researches/german/transitionWords.js")().allWords;
let twoPartTransitionWordsGerman = require("../researches/german/twoPartTransitionWords.js");
let transitionWordsFrench = require("../researches/french/transitionWords.js")().allWords;
let twoPartTransitionWordsFrench = require("../researches/french/twoPartTransitionWords.js");
let transitionWordsSpanish = require("../researches/spanish/transitionWords.js")().allWords;
let twoPartTransitionWordsSpanish = require("../researches/spanish/twoPartTransitionWords.js");
let transitionWordsDutch = require("../researches/dutch/transitionWords.js")().allWords;
let twoPartTransitionWordsDutch = require("../researches/dutch/twoPartTransitionWords.js");
let transitionWordsItalian = require("../researches/italian/transitionWords.js")().allWords;
let twoPartTransitionWordsItalian = require("../researches/italian/twoPartTransitionWords.js");
let transitionWordsPortuguese = require("../researches/portuguese/transitionWords.js")().allWords;
let twoPartTransitionWordsPortuguese = require("../researches/portuguese/twoPartTransitionWords.js");
let getLanguage = require("./getLanguage.js");
module.exports = function (locale) {
    switch (getLanguage(locale)) {
        case "de":
            return {
                transitionWords: transitionWordsGerman,
                twoPartTransitionWords: twoPartTransitionWordsGerman,
            };
        case "es":
            return {
                transitionWords: transitionWordsSpanish,
                twoPartTransitionWords: twoPartTransitionWordsSpanish,
            };
        case "fr":
            return {
                transitionWords: transitionWordsFrench,
                twoPartTransitionWords: twoPartTransitionWordsFrench,
            };
        case "nl":
            return {
                transitionWords: transitionWordsDutch,
                twoPartTransitionWords: twoPartTransitionWordsDutch,
            };
        case "it":
            return {
                transitionWords: transitionWordsItalian,
                twoPartTransitionWords: twoPartTransitionWordsItalian,
            };
        case "pt":
            return {
                transitionWords: transitionWordsPortuguese,
                twoPartTransitionWords: twoPartTransitionWordsPortuguese,
            };
        default:
        case "en":
            return {
                transitionWords: transitionWordsEnglish,
                twoPartTransitionWords: twoPartTransitionWordsEnglish,
            };
    }
};
//# sourceMappingURL=getTransitionWords.js.map