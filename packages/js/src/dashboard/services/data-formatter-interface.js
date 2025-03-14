
/**
 * Knows how to format data.
 */
export class DataFormatterInterface {
	#locale;
	#numberFormat = {};

	/**
	 * @param {string} [locale] The locale.
	 */
	constructor( { locale = "en-US" } = {} ) {
		if ( new.target === DataFormatterInterface ) {
			throw new Error( "DataFormatterInterface cannot be instantiated directly." );
		}

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
	 * @param {string} url The URL.
	 * @returns {URL|null} The URL or null.
	 */
	static safeUrl = ( url ) => {
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
	static safeNumberFormat = ( data, numberFormat ) => {
		try {
			return numberFormat.format( data );
		} catch {
			return data.toString( 10 );
		}
	};

	/**
	 * Getter for the private attribute #numberFormat.
	 *
	 * @returns {NumberFormat} The number format object.
	 */
	get numberFormat() {
		return this.#numberFormat;
	}

	/**
	 * Getter for the private attribute #locale.
	 *
	 * @returns {string} The locale.
	 */
	get locale() {
		return this.#locale;
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
