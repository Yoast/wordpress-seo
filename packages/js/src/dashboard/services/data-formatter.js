import { SCORE_META } from "../scores/score-meta";

/**
 * @param {string} url The URL.
 * @returns {URL|null} The URL or null.
 */
const safeUrl = ( url ) => {
	try {
		return new URL( url );
	} catch {
		return null;
	}
};

/**
 * @param {number} data The data.
 * @param {NumberFormat} numberFormat The number formatter.
 * @returns {string} The formatted number or number as string.
 */
const safeNumberFormat = ( data, numberFormat ) => {
	try {
		return numberFormat.format( data );
	} catch {
		return data.toString( 10 );
	}
};

/**
 * Knows how to format data.
 */
export class DataFormatter {
	#locale;
	#numberFormat = {};

	/**
	 * @param {string} [locale] The locale.
	 */
	constructor( { locale = "en-US" } = {} ) {
		this.#locale = locale;
		this.#numberFormat.nonFractional = new Intl.NumberFormat( locale, { maximumFractionDigits: 0 } );
		this.#numberFormat.compactNonFractional = new Intl.NumberFormat( locale, {
			maximumFractionDigits: 0,
			notation: "compact",
			compactDisplay: "short",
		} );
		this.#numberFormat.percentage = new Intl.NumberFormat( locale, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 } );
		this.#numberFormat.twoFractions = new Intl.NumberFormat( locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 } );
	}

	/**
	 * @param {string} link The link.
	 * @returns {string} The formatted or original link.
	 */
	formatLandingPage( link ) {
		const url = safeUrl( link );
		if ( url === null ) {
			return link;
		}

		// Dropping: hostname, protocol, port, search and hash.
		return url.pathname;
	}

	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original data.
	 */
	format( data, name, context = {} ) { // eslint-disable-line complexity
		switch ( name ) {
			case "subject":
				switch ( context.widget ) {
					case "topPages":
						return this.formatLandingPage( data );
					case "topQueries":
						return String( data );
					default:
						return data;
				}
			case "clicks":
			case "impressions":
				return safeNumberFormat( data, this.#numberFormat.nonFractional );
			case "ctr":
			case "difference":
				return safeNumberFormat( data, this.#numberFormat.percentage );
			case "position":
				return safeNumberFormat( data, this.#numberFormat.twoFractions );
			case "seoScore":
				return Object.keys( SCORE_META ).includes( data ) ? data : "notAnalyzed";
			case "date":
				return new Date(
					Date.UTC( data.slice( 0, 4 ), data.slice( 4, 6 ) - 1, data.slice( 6, 8 ) )
				).toLocaleDateString(
					this.#locale,
					{ month: "short", day: "numeric" }
				);
			case "sessions":
				if ( context.compact ) {
					return safeNumberFormat( data || 0, this.#numberFormat.compactNonFractional );
				}
				return safeNumberFormat( data || 0, this.#numberFormat.nonFractional );
			default:
				return data;
		}
	}
}
