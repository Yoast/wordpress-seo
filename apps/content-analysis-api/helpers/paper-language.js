/**
 * Derives the language code from a Paper's validated locale.
 *
 * The contract validates and normalises `locale` onto the Paper (defaulting to `en_US`), so the
 * researcher language is taken from there rather than from the raw request body — keeping the routes
 * consistent with the values that passed through the contract.
 *
 * @param {Object} paper The Paper constructed via the contract.
 * @returns {string} The language code (the locale's prefix, e.g. `en` from `en_US`).
 */
const paperLanguage = ( paper ) => paper.getLocale().split( /[-_]/ )[ 0 ];

module.exports = { paperLanguage };
