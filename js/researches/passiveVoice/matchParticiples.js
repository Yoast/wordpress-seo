"use strict";
var find = require("lodash/find");
var forEach = require("lodash/forEach");
var memoize = require("lodash/memoize");
var includes = require("lodash/includes");
var irregularsEnglish = require("../english/passiveVoice/irregulars")();
var irregularsRegularFrench = require("../french/passiveVoice/irregulars")().irregularsRegular;
var irregularsIrregularFrench = require("../french/passiveVoice/irregulars")().irregularsIrregular;
var irregularsEndingInSFrench = require("../french/passiveVoice/irregulars")().irregularsEndingInS;
var spanishParticiples = require("../spanish/passiveVoice/participles")();
// The language-specific participle regexes.
var languageVariables = {
    en: {
        regularParticiplesRegex: /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig,
    },
    fr: {
        regularParticiplesRegex: /\S+(é|ée|és|ées)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig,
    },
};
/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check.
 * @param {string} language The language in which to match.
 *
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function (word, language) {
    // In Spanish we don't match participles with a regular regex pattern.
    if (language === "es") {
        return [];
    }
    // Matches all words with a language-specific participle suffix.
    var regularParticiplesRegex = languageVariables[language].regularParticiplesRegex;
    return word.match(regularParticiplesRegex) || [];
};
/**
 * Returns an array of matches of irregular participles with suffixes.
 *
 * @param {string} word The word to match on.
 * @param {Array} irregulars The list of irregulars to match.
 * @param {string} suffixes The suffixes to match the word with.
 * @param {Array} matches The array into which to push the matches.
 * @returns {Array} A list with matched irregular participles.
 */
var matchFrenchParticipleWithSuffix = function (word, irregulars, suffixes) {
    var matches = [];
    forEach(irregulars, function (irregular) {
        var irregularParticiplesRegex = new RegExp("^" + irregular + suffixes + "?$", "ig");
        var participleMatch = word.match(irregularParticiplesRegex);
        if (participleMatch) {
            matches.push(participleMatch[0]);
        }
    });
    return matches;
};
/**
 * Returns the matches for a word in the list of irregulars.
 *
 * @param {string} word The word to match in the list.
 * @param {string} language The language for which to match.
 *
 * @returns {Array} A list with the matches.
 */
var irregularParticiples = function (word, language) {
    var matches = [];
    switch (language) {
        case "fr":
            // Match different classes of participles with suffixes.
            matches = matches.concat(matchFrenchParticipleWithSuffix(word, irregularsRegularFrench, "(e|s|es)"));
            matches = matches.concat(matchFrenchParticipleWithSuffix(word, irregularsEndingInSFrench, "(e|es)"));
            // Match irregular participles that don't require adding a suffix.
            find(irregularsIrregularFrench, function (irregularParticiple) {
                if (irregularParticiple === word) {
                    matches.push(irregularParticiple);
                }
            });
            break;
        case "es":
            // In Spanish, we only match passives from a word list.
            if (includes(spanishParticiples, word)) {
                matches.push(word);
            }
            break;
        case "en":
        default:
            find(irregularsEnglish, function (irregularParticiple) {
                if (irregularParticiple === word) {
                    matches.push(irregularParticiple);
                }
            });
            break;
    }
    return matches;
};
module.exports = function () {
    return {
        regularParticiples: memoize(regularParticiples),
        irregularParticiples: memoize(irregularParticiples),
    };
};
//# sourceMappingURL=matchParticiples.js.map