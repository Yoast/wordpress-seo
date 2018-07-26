/* External dependencies */
import defaults from "lodash/defaults";
import noop from "lodash/noop";

/* Internal dependencies */
import DiviHelper from "./diviHelper";

const DEFAULTS = {
	classicEditorHidden: noop,
	classicEditorShown: noop,
};

/**
 * Adds support (compatability) for Page builders.
 */
class CompatabilityHelper {
	/**
	 * The CompatabilityHelper constructor.
	 *
	 * Determines what (supported) page builder is active.
	 *
	 * @param {Object}   callbacks                     The listener callbacks.
	 * @param {Function} callbacks.classicEditorHidden Callback called when TinyMCE is hidden.
	 * @param {Function} callbacks.classicEditorShown  Callback called when TinyMCE is shown.
	 */
	constructor( callbacks ) {
		this.callbacks = defaults( callbacks, DEFAULTS );
		this.pageBuilder = this.determinePageBuilder();
	}

	/**
	 * Determines what supported page builder is active.
	 *
	 * @returns {string} The active page builder.
	 */
	determinePageBuilder() {
		if ( DiviHelper.isActive() ) {
			return "divi";
		}
		return "";
	}

	/**
	 * Initializes listeners for page builder events regarding the classic editor.
	 *
	 * @returns {void}
	 */
	init() {
		if ( this.pageBuilder === "divi" ) {
			const diviHelper = new DiviHelper();
			diviHelper.listen( this.callbacks );
		}
	}

	/**
	 * Returns whether the classic editor is hidden.
	 *
	 * @returns {boolean} Whether the classic editor is hidden.
	 */
	isClassicEditorHidden() {
		if ( this.pageBuilder === "divi" ) {
			return DiviHelper.isTinyMCEHidden();
		}
		return false;
	}
}

export default CompatabilityHelper;
