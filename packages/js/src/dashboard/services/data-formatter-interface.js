
/**
 * Knows how to format data.
 */
export class DataFormatterInterface {
	#numberFormat = {};

	/**
	 * @param {string} url The URL.
	 * @returns {URL|null} The URL or null.
	 */
	safeUrl = ( url ) => {
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
	safeNumberFormat = ( data, numberFormat ) => {
		try {
			return numberFormat.format( data );
		} catch {
			return data.toString( 10 );
		}
	};

	/**
	 * @param {string} [locale] The locale.
	 */
	constructor( { locale = "en-US" } = {} ) {
		if ( new.target === DataFormatterInterface ) {
			throw new Error( "DataFormatterInterface cannot be instantiated directly." );
		}

		this.#numberFormat.nonFractional = new Intl.NumberFormat( locale, { maximumFractionDigits: 0 } );
		this.#numberFormat.percentage = new Intl.NumberFormat( locale, { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 } );
		this.#numberFormat.twoFractions = new Intl.NumberFormat( locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 } );
	}

	/**
	 * Getter for the private attribute #numberFormat.
	 *
	 * @returns {NumberFormat} The number format object.
	 */
	getNumberFormat() {
		return this.#numberFormat;
	}

	/**
	 * @param {string} link The link.
	 * @returns {string} The formatted or original link.
	 */
	formatLandingPage( link ) {
		const url = this.safeUrl( link );
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
	// eslint-disable-next-line no-unused-vars
	format( data, name, context = {} ) {
		throw new Error( "You must implement the format() method before using it." );
	}
}
