const LOCALE_VARIANTS = [ "_formal", "_informal", "_ao90" ];

/**
 * Removes variant suffixes from locale, to make it a valid ISO 639-1 language.
 * @param {string} locale The locale.
 * @returns {string} The locale, with variant suffixes stripped out.
 */
export const removesLocaleVariantSuffixes = ( locale ) => {
	for ( const variant of LOCALE_VARIANTS ) {
		if ( locale.endsWith( variant ) ) {
			return locale.slice( 0, ( -variant.length ) );
		}
	}

	return locale;
};
