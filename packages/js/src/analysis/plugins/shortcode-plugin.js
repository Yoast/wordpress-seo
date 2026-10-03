/* global tinyMCE */
/* global wpseoScriptData */
/* global ajaxurl */
import { debounce, flatten } from "lodash";
import { applyFilters } from "@wordpress/hooks";
import { actions } from "@yoast/externals/redux";

const SHORTCODE_NAME_MATCHER = "[^<>&/\\[\\]\x00-\x20=]+?";
const SHORTCODE_ATTRIBUTES_MATCHER = "( [^\\]]+?)?";

const SHORTCODE_START_REGEX = new RegExp( "\\[" + SHORTCODE_NAME_MATCHER + SHORTCODE_ATTRIBUTES_MATCHER + "\\]", "g" );
const SHORTCODE_END_REGEX = new RegExp( "\\[/" + SHORTCODE_NAME_MATCHER + "\\]", "g" );

/**
 * @typedef ParsedShortcode
 * @type {object}
 * @property {string} shortcode The unparsed shortcode.
 * @property {string} output The parsed shortcode.
 */

/**
 * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for
 * shortcodes which it will preload using AJAX.
 */
class YoastShortcodePlugin {
	/**
	 * Constructs the YoastShortcodePlugin.
	 *
	 * @property {RegExp} shortcodesRegex Used to match a given string for a valid shortcode.
	 * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.
	 * @property {RegExp} nonCaptureRegex Used to match a given string for non-capturing shortcodes.
	 * @property {ParsedShortcode[]} parsedShortcodes Used to store parsed shortcodes.
	 *
	 * @param {Object}   interface                      Object Formerly Known as App, but for backwards compatibility
	 *                                                  still passed here as one argument.
	 * @param {function} interface.registerPlugin       Register a plugin with Yoast SEO.
	 * @param {function} interface.registerModification Register a modification with Yoast SEO.
	 * @param {function} interface.pluginReady          Notify Yoast SEO that the plugin is ready.
	 * @param {function} interface.pluginReloaded       Notify Yoast SEO that the plugin has been reloaded.
	 * @param {string[]} shortcodesToBeParsed The array of shortcodes to be parsed.
	 * @returns {void}
	 */
	constructor( { registerPlugin, registerModification, pluginReady, pluginReloaded }, shortcodesToBeParsed ) {
		this._registerModification = registerModification;
		this._pluginReady = pluginReady;
		this._pluginReloaded = pluginReloaded;

		registerPlugin( "YoastShortcodePlugin", { status: "loading" } );
		this.bindElementEvents();

		const shortcodesRegexString = "(" + shortcodesToBeParsed.join( "|" ) + ")";

		// The regex for matching shortcodes based on the list of shortcodes.
		this.shortcodesRegex = new RegExp( shortcodesRegexString, "g" );
		this.closingTagRegex = new RegExp( "\\[\\/" + shortcodesRegexString + "\\]", "g" );
		this.nonCaptureRegex = new RegExp( "\\[" + shortcodesRegexString + "[^\\]]*?\\]", "g" );

		/**
		 * The array of parsed shortcode objects.
		 * @type {ParsedShortcode[]}
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
	 * @param {string} data The text to remove unknown shortcodes.
	 * @returns {string} The text with removed unknown shortcodes.
	 */
	removeUnknownShortCodes( data ) {
		data = data.replace( SHORTCODE_START_REGEX, "" );
		data = data.replace( SHORTCODE_END_REGEX, "" );

		return data;
	}

	/**
	 * Replaces the unparsed shortcodes with the parsed ones.
	 * The callback used to replace the shortcodes.
	 *
	 * @param {string} data The text to replace the shortcodes in.
	 *
	 * @returns {string} The text with replaced shortcodes.
	 */
	replaceShortcodes( data ) {
		if ( typeof data === "string" ) {
			this.parsedShortcodes.forEach( ( { shortcode, output } ) => {
				data = data.replace( shortcode, output );
			} );
		}

		data = this.removeUnknownShortCodes( data );

		return data;
	}

	/* DATA SOURCING */

	/**
	 * Gets data from input fields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippet preview.
	 *
	 * @param {function} callback To declare either ready or reloaded after parsing.
	 *
	 * @returns {function} The callback function.
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
	 * Binds elements to be able to reload the dataset if shortcodes get added.
	 *
	 * @returns {void}
	 */
	bindElementEvents() {
		const contentElement = document.querySelector( ".wp-editor-area" );
		const callback = debounce( this.loadShortcodes.bind( this, this.declareReloaded.bind( this ) ), 500 );

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
	 * @returns {string} The content from tinyMCE.
	 */
	getContentTinyMCE() {
		let content = document.querySelector( ".wp-editor-area" ) ? document.querySelector( ".wp-editor-area" ).value : "";
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
	 * @returns {boolean|Array} Array with unparsed shortcodes.
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
	 * @param {string} shortcodeToCheck The shortcode to check.
	 *
	 * @returns {boolean} True when shortcode is not parsed yet.
	 */
	isUnparsedShortcode( shortcodeToCheck ) {
		return ! this.parsedShortcodes.some( ( { shortcode } ) => shortcode === shortcodeToCheck );
	}

	/**
	 * Gets the shortcodes from a given piece of text.
	 *
	 * @param {string} text Text to extract shortcodes from.
	 *
	 * @returns {boolean|Array} The matched shortcodes.
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
	 * @param {string} text Text to get the capturing shortcodes from.
	 *
	 * @returns {Array} The capturing shortcodes.
	 */
	matchCapturingShortcodes( text ) {
		// First identify which tags are being used in a capturing shortcode by looking for closing tags.
		const captureShortcodes = ( text.match( this.closingTagRegex ) || [] ).join( " " ).match( this.shortcodesRegex ) || [];

		return flatten( captureShortcodes.map( captureShortcode => {
			const captureRegex = "\\[" + captureShortcode + "[^\\]]*?\\].*?\\[\\/" + captureShortcode + "\\]";
			return text.match( new RegExp( captureRegex, "g" ) ) || [];
		} ) );
	}

	/**
	 * Matches the non-capturing shortcodes from a given piece of text.
	 *
	 * @param {string} text Text to get the non-capturing shortcodes from.
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
	 * @returns {boolean|function} The callback function or false if no function has been supplied.
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
	 * Saves the shortcodes that were parsed to `this.parsedShortcodes`, and then call the callback function.
	 *
	 * @param {string}   shortcodeResults Shortcodes that must be saved. This is the response from the AJAX request.
	 * @param {function} callback         Callback to execute after saving shortcodes.
	 *
	 * @returns {void}
	 */
	saveParsedShortcodes( shortcodeResults, callback ) {
		// Parse the stringified shortcode results to an array.
		const shortcodes = JSON.parse( shortcodeResults );

		// Push the shortcodes to the array of parsed shortcodes.
		this.parsedShortcodes.push( ...shortcodes );

		callback();
	}
}

export default YoastShortcodePlugin;

const {
	updateShortcodesForParsing,
} = actions;

/**
 * Initializes the shortcode plugin.
 *
 * @param {App} app The app object.
 * @param {Object} store The redux store.
 *
 * @returns {void}
 */
export function initShortcodePlugin( app, store ) {
	let shortcodesToBeParsed = [];
	shortcodesToBeParsed = applyFilters( "yoast.analysis.shortcodes", shortcodesToBeParsed );

	// Make sure the added shortcodes are valid. They are valid if they are included in `wpseo_shortcode_tags`.
	const validShortcodes = wpseoScriptData.analysis.plugins.shortcodes.wpseo_shortcode_tags;
	shortcodesToBeParsed = shortcodesToBeParsed.filter( shortcode => validShortcodes.includes( shortcode ) );

	// Parses the shortcodes when `shortcodesToBeParsed` is provided.
	if ( shortcodesToBeParsed.length > 0 ) {
		store.dispatch( updateShortcodesForParsing( shortcodesToBeParsed ) );

		window.YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( {
			registerPlugin: app.registerPlugin,
			registerModification: app.registerModification,
			pluginReady: app.pluginReady,
			pluginReloaded: app.pluginReloaded,
		}, shortcodesToBeParsed );
	}
}
