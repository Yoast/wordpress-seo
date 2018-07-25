/* External dependencies */
import defaults from "lodash/defaults";
import noop from "lodash/noop";

/* Internal dependencies */
import DiviHelper from "./divi";

const DEFAULTS = {
	classicEditorHidden: noop,
	classicEditorShown: noop,
};

class CompatabilityHelper {
	constructor( callbacks ) {
		this.callbacks = defaults( callbacks, DEFAULTS );
		this.pageBuilder = this.determinePageBuilder();
	}

	determinePageBuilder() {
		if ( DiviHelper.isActive() ) {
			return "divi";
		}
		return "";
	}

	init() {
		if ( this.pageBuilder === "divi" ) {
			const diviHelper = new DiviHelper();
			diviHelper.listen( this.callbacks );
		}
	}

	isClassicEditorHidden() {
		if ( this.pageBuilder === "divi" ) {
			return DiviHelper.isTinyMCEHidden();
		}
	}
}

export default CompatabilityHelper;
