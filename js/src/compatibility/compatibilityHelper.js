/* External dependencies */
import defaults from "lodash/defaults";
import noop from "lodash/noop";

/* Internal dependencies */
import DiviHelper from "./diviHelper";
import VisualComposerHelper from "./visualComposerHelper";

const DEFAULTS = {
	classicEditorHidden: noop,
	classicEditorShown: noop,
	pageBuilderLoaded: noop,
};

/**
 * Adds support (compatibility) for Page builders.
 */
class CompatibilityHelper {
	/**
	 * The CompatibilityHelper constructor.
	 *
	 * Determines what (supported) page builder is active.
	 */
	constructor() {
		this.determineActivePageBuilders();
	}

	/**
	 * Determines what supported page builder is active.
	 *
	 * @returns {void}
	 */
	determineActivePageBuilders() {
		if ( DiviHelper.isActive() ) {
			this.diviActive = true;
		}
		if( VisualComposerHelper.isActive() ) {
			this.vcActive = true;
		}
	}

	/**
	 * Determines if a page builder is active.
	 *
	 * @returns {boolean} True whether a page is active.
	 */
	isPageBuilderActive() {
		return this.diviActive || this.vcActive;
	}

	/**
	 * Initializes listeners for page builder events regarding the classic editor.
	 *
	 * @param {Object}   callbacks                     The listener callbacks.
	 * @param {Function} callbacks.classicEditorHidden Callback called when TinyMCE is hidden.
	 * @param {Function} callbacks.classicEditorShown  Callback called when TinyMCE is shown.
	 *
	 * @returns {void}
	 */
	listen( callbacks ) {
		this.callbacks = defaults( callbacks, DEFAULTS );

		if ( this.diviActive ) {
			const diviHelper = new DiviHelper();
			diviHelper.listen( callbacks );
		}
	}

	/**
	 * Returns whether the classic editor is hidden.
	 *
	 * @returns {boolean} Whether the classic editor is hidden.
	 */
	isClassicEditorHidden() {
		return !! ( this.diviActive && DiviHelper.isTinyMCEHidden() );
	}
}

export default CompatibilityHelper;
