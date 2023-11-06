/* global tinyMCE */
/* global wpseoScriptData */
/* global ajaxurl */
/* global _ */

const shortcodeNameMatcher = "[^<>&/\\[\\]\x00-\x20=]+?";
const shortcodeAttributesMatcher = "( [^\\]]+?)?";

const shortcodeStartRegex = new RegExp( "\\[" + shortcodeNameMatcher + shortcodeAttributesMatcher + "\\]", "g" );
const shortcodeEndRegex = new RegExp( "\\[/" + shortcodeNameMatcher + "\\]", "g" );

/**
 * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for
 * shortcodes which it will preload using AJAX.
 */
class YoastShortcodePlugin {
	/**
	 * Constructs the YoastShortcodePlugin.
	 *
	 * @property {RegExp} keywordRegex Used to match a given string for valid shortcode keywords.
	 * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.
	 * @property {RegExp} nonCaptureRegex Used to match a given string for non-capturing shortcodes.
	 * @property {Array} parsedShortcodes Used to store parsed shortcodes.
	 *
	 * @param {Object}   interface                      Object Formerly Known as App, but for backwards compatibility
	 *                                                  still passed here as one argument.
	 * @param {function} interface.registerPlugin       Register a plugin with Yoast SEO.
	 * @param {function} interface.registerModification Register a modification with Yoast SEO.
	 * @param {function} interface.pluginReady          Notify Yoast SEO that the plugin is ready.
	 * @param {function} interface.pluginReloaded       Notify Yoast SEO that the plugin has been reloaded.
	 * @param {Array}	shortcodesToBeParsed The array of shortcodes to be parsed.
	 * @returns {void}
	 */
	constructor( { registerPlugin, registerModification, pluginReady, pluginReloaded }, shortcodesToBeParsed ) {
		this._registerModification = registerModification;
		this._pluginReady = pluginReady;
		this._pluginReloaded = pluginReloaded;

		registerPlugin( "YoastShortcodePlugin", { status: "loading" } );
		this.bindElementEvents();

		const keywordRegexString = "(" + shortcodesToBeParsed.join( "|" ) + ")";

		// The regex for matching shortcodes based on the available shortcode keywords.
		this.keywordRegex = new RegExp( keywordRegexString, "g" );
		this.closingTagRegex = new RegExp( "\\[\\/" + keywordRegexString + "\\]", "g" );
		this.nonCaptureRegex = new RegExp( "\\[" + keywordRegexString + "[^\\]]*?\\]", "g" );

		/**
		 * The array of parsedShortcode objects.
		 *
		 * @type {Object[]}
		 */
		this.parsedShortcodes = [];

		this.loadShortcodes( this.declareReady.bind( this ) );
	}

	/* YOAST SEO CLIENT */

	/**
	 * Declares ready with YoastSEO.
	 *
	 * @returns {void}
	 */
	declareReady() {
		this._pluginReady( "YoastShortcodePlugin" );
		this.registerModifications();
	}

	/**
	 * Declares reloaded with YoastSEO.
	 *
	 * @returns {void}
	 */
	declareReloaded() {
		this._pluginReloaded( "YoastShortcodePlugin" );
	}

	/**
	 * Registers the modifications for the content in which we want to replace shortcodes.
	 *
	 * @returns {void}
	 */
	registerModifications() {
		this._registerModification( "content", this.replaceShortcodes.bind( this ), "YoastShortcodePlugin" );
	}


	/**
	 * Removes all unknown shortcodes. Not all plugins properly registered their shortcodes in the WordPress backend.
	 * Since we cannot use the data from these shortcodes they must be removed.
	 *
	 * @param {String} data The text to remove unknown shortcodes.
	 * @returns {String} The text with removed unknown shortcodes.
	 */
	removeUnknownShortCodes( data ) {
		data = data.replace( shortcodeStartRegex, "" );
		data = data.replace( shortcodeEndRegex, "" );

		return data;
	}

	/**
	 * The callback used to replace the shortcodes.
	 *
	 * @param {String} data The text to replace the shortcodes in.
	 *
	 * @returns {String} The text with replaced shortcodes.
	 */
	replaceShortcodes( data ) {
		const parsedShortcodes = this.parsedShortcodes;

		if ( typeof data === "string" && parsedShortcodes.length > 0 ) {
			parsedShortcodes.forEach( ( { shortcode, output } ) => {
				data = data.replace( shortcode, output );
			} );
		}

		data = this.removeUnknownShortCodes( data );

		return data;
	}

	/* DATA SOURCING */

	/**
	 * Get data from input fields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippet preview.
	 *
	 * @param {function} callback To declare either ready or reloaded after parsing.
	 *
	 * @returns {void}
	 */
	loadShortcodes( callback ) {
		const unparsedShortcodes = this.getUnparsedShortcodes( this.getShortcodes( this.getContentTinyMCE() ) );
		if ( unparsedShortcodes.length > 0 ) {
			this.parseShortcodes( unparsedShortcodes, callback );
		} else {
			return callback();
		}
	}

	/**
	 * Bind elements to be able to reload the dataset if shortcodes get added.
	 *
	 * @returns {void}
	 */
	bindElementEvents() {
		const contentElement = document.getElementById( "content" ) || false;
		const callback =  _.debounce(	this.loadShortcodes.bind( this, this.declareReloaded.bind( this ) ), 500 );

		if ( contentElement ) {
			contentElement.addEventListener( "keyup", callback );
			contentElement.addEventListener( "change", callback );
		}

		if ( typeof tinyMCE !== "undefined" && typeof tinyMCE.on === "function" ) {
			tinyMCE.on( "addEditor", function( e ) {
				e.editor.on( "change", callback );
				e.editor.on( "keyup", callback );
			} );
		}
	}

	/**
	 * Gets content from the content field, if tinyMCE is initialized, use the getContent function to
	 * get the data from tinyMCE.
	 *
	 * @returns {String} The content from tinyMCE.
	 */
	getContentTinyMCE() {
		let content = document.getElementById( "content" ) ? document.getElementById( "content" ).value : "";
		if ( typeof tinyMCE !== "undefined" && typeof tinyMCE.editors !== "undefined" && tinyMCE.editors.length !== 0 ) {
			content = tinyMCE.get( "content" ) ? tinyMCE.get( "content" ).getContent() : "";
		}

		return content;
	}

	/* SHORTCODE PARSING */

	/**
	 * Returns the unparsed shortcodes out of a collection of shortcodes.
	 *
	 * @param {Array} shortcodes The shortcodes to check.
	 *
	 * @returns {Boolean|Array} Array with unparsed shortcodes.
	 */
	getUnparsedShortcodes( shortcodes ) {
		if ( typeof shortcodes !== "object" ) {
			console.error( "Failed to get unparsed shortcodes. Expected parameter to be an array, instead received " + typeof shortcodes );
			return false;
		}

		return shortcodes.filter( shortcode => this.isUnparsedShortcode( shortcode ) );
	}

	/**
	 * Checks if a given shortcode was already parsed.
	 *
	 * @param {String} shortcodeToCheck The shortcode to check.
	 *
	 * @returns {Boolean} True when shortcode is not parsed yet.
	 */
	isUnparsedShortcode( shortcodeToCheck ) {
		return ! this.parsedShortcodes.some( ( { shortcode } ) => shortcode === shortcodeToCheck );
	}

	/**
	 * Gets the shortcodes from a given piece of text.
	 *
	 * @param {String} text Text to extract shortcodes from.
	 *
	 * @returns {Boolean|Array} The matched shortcodes.
	 */
	getShortcodes( text ) {
		if ( typeof text !== "string" ) {
			console.error( "Failed to get shortcodes. Expected parameter to be a string, instead received" + typeof text );
			return false;
		}

		const captures = this.matchCapturingShortcodes( text );

		// Remove the capturing shortcodes from the text before trying to match the non-capturing shortcodes.
		captures.forEach( capture => {
			text = text.replace( capture, "" );
		} );

		const nonCaptures = this.matchNonCapturingShortcodes( text );

		return captures.concat( nonCaptures );
	}

	/**
	 * Matches the capturing shortcodes from a given piece of text.
	 *
	 * @param {String} text Text to get the capturing shortcodes from.
	 *
	 * @returns {Array} The capturing shortcodes.
	 */
	matchCapturingShortcodes( text ) {
		let captures = [];

		// First identify which tags are being used in a capturing shortcode by looking for closing tags.
		const captureKeywords = ( text.match( this.closingTagRegex ) || [] ).join( " " ).match( this.keywordRegex ) || [];

		// Fetch the capturing shortcodes and strip them from the text, so we can easily match the non-capturing shortcodes.
		captureKeywords.forEach( captureKeyword => {
			const captureRegex = "\\[" + captureKeyword + "[^\\]]*?\\].*?\\[\\/" + captureKeyword + "\\]";
			const matches = text.match( new RegExp( captureRegex, "g" ) ) || [];

			captures = captures.concat( matches );
		} );

		return captures;
	}

	/**
	 * Matches the non-capturing shortcodes from a given piece of text.
	 *
	 * @param {String} text Text to get the non-capturing shortcodes from.
	 *
	 * @returns {Array}	The non-capturing shortcodes.
	 */
	matchNonCapturingShortcodes( text ) {
		return text.match( this.nonCaptureRegex ) || [];
	}

	/**
	 * Parses the unparsed shortcodes through AJAX and clears them.
	 *
	 * @param {Array} shortcodes shortcodes to be parsed.
	 * @param {function} callback function to be called in the context of the AJAX callback.
	 *
	 * @returns {void}
	 */
	parseShortcodes( shortcodes, callback ) {
		if ( typeof callback !== "function" ) {
			console.error( "Failed to parse shortcodes. Expected parameter to be a function, instead received " + typeof callback );
			return false;
		}

		if ( typeof shortcodes === "object" && shortcodes.length > 0 ) {
			jQuery.post(
				ajaxurl,
				{
					action: "wpseo_filter_shortcodes",
					_wpnonce: wpseoScriptData.analysis.plugins.shortcodes.wpseo_filter_shortcodes_nonce,
					data: shortcodes,
				},
				function( shortcodeResults ) {
					this.saveParsedShortcodes( shortcodeResults, callback );
				}.bind( this )
			);
		} else {
			return callback();
		}
	}

	/**
	 * Saves the shortcodes that were parsed with AJAX to `this.parsedShortcodes`
	 *
	 * @param {Array}    shortcodeResults Shortcodes that must be saved.
	 * @param {function} callback         Callback to execute of saving shortcodes.
	 *
	 * @returns {void}
	 */
	saveParsedShortcodes( shortcodeResults, callback ) {
		shortcodeResults = JSON.parse( shortcodeResults );

		shortcodeResults.forEach( result => {
			this.parsedShortcodes.push( result );
		} );

		callback();
	}
}


export default YoastShortcodePlugin;
