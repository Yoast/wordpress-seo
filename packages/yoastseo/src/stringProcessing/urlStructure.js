import core from "tokenizer2/core";

/**
 * Contains a URL tokenizer that is capable of tokenizing a URL structure string.
 *
 * @type {Object}
 */
var urlTokenizer;

/**
 * Contains the tokens as parsed by the urlTokenizer.
 *
 * @type {Object[]}
 */
let tokens;

/**
 * Matches static parts of a URL, because we use %% as placeholder markers we don't support percentage signs in the URL.
 *
 * @type {RegExp}
 */
const staticRegex = /^[^%]+$/;

/**
 * Matches variable parts of a URL, format is %%placeholder%%.
 *
 * @type {RegExp}
 */
const variableRegex = /^%%[^%]+%%$/;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 *
 * @since 1.8.0
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	urlTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	urlTokenizer.addRule( staticRegex, "static" );
	urlTokenizer.addRule( variableRegex, "variable" );
}


/**
 * Represents a URL structure. Placeholders can be defined using %%placeholder%% and can later be filled using the `applyData` method.
 *
 * @since 1.8.0
 */
class UrlStructure {
	/**
	 * Sets the structure to the passed structure.
	 *
	 * @since 1.8.0
	 *
	 * @param {Array} structure The structure of the URL.
	 */
	constructor( structure ) {
		this._structure = structure;
	}

	/**
	 * Builds a URL from this URL structure and the given data.
	 *
	 * @since 1.8.0
	 *
	 * @param {Object} data A key value store of all the variable parts of the URL structure.
	 * @returns {string} A URL with all variables parts filled.
	 */
	buildUrl( data ) {
		return this._structure.reduce( ( url, urlPart ) => {
			if ( "variable" === urlPart.type ) {
				urlPart = this._buildVariablePart( data, urlPart );
			} else {
				urlPart = urlPart.value;
			}

			return url + urlPart;
		}, "" );
	}

	/**
	 * Builds a URL part for a small part of the URL.
	 *
	 * @since 1.8.0
	 *
	 * @private
	 *
	 * @param {Object} data The data to fill the URL parts.
	 * @param {Object} urlPartConfig The config for the URL part.
	 * @returns {string} A URL part.
	 */
	_buildVariablePart( data, urlPartConfig ) {
		if ( ! data.hasOwnProperty( urlPartConfig.name ) ) {
			throw new TypeError( 'Data doesn\'t have required property "' + urlPartConfig.name + '"' );
		}

		return data[ urlPartConfig.name ];
	}

	/**
	 * Returns the structure.
	 *
	 * @since 1.8.0
	 *
	 * @returns {Array} The structure of the URL.
	 */
	getStructure() {
		return this._structure;
	}

	/**
	 * Parses a URL for static and variable parts. Variables should be surrounded by double percentage signs.
	 *
	 * @since 1.8.0
	 *
	 * @param {string} url The URL to parse.
	 * @returns {UrlStructure} The parsed url structure.
	 */
	static fromUrl( url ) {
		createTokenizer();

		urlTokenizer.onText( url );
		urlTokenizer.end();

		tokens = tokens.map( ( token ) => {
			const urlPart = {
				type: token.type,
				value: token.src,
			};

			if ( "variable" === token.type ) {
				// Strip the %% at the start and the end of the variable URL part.
				urlPart.name = urlPart.value.substr( 2, urlPart.value.length - 4 );
			}

			return urlPart;
		} );

		return new UrlStructure( tokens );
	}
}

export default UrlStructure;
