"use strict";
/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function (locale) {
    return locale.split("_")[0];
};
//# sourceMappingURL=getLanguage.js.map