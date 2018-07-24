/* External dependencies */
import forEach from "lodash/forEach";
import defaults from "lodash/defaults";
import noop from "lodash/noop";

const DEFAULTS = {
	classicEditorHidden: noop,
	classicEditorShown: noop,
};

const DIVI_EDITOR_WRAPPER_ID = "et_pb_main_editor_wrap";

class CompatabilityHelper {
	constructor( callbacks ) {
		this.callbacks = defaults( callbacks, DEFAULTS );
		this.pageBuilder = this.determinePageBuilder();
	}

	determinePageBuilder() {
		if ( this.isDivi() ) {
			return "divi";
		}
		return "";
	}

	isDivi() {
		return !! document.getElementById( DIVI_EDITOR_WRAPPER_ID );
	}

	init() {
		switch( this.pageBuilder ) {
			case "divi":
				this.initDivi();
		}
	}

	isClassicEditorHidden() {
		if ( this.pageBuilder === "divi" ) {
			const classicEditorContainer = document.getElementById( DIVI_EDITOR_WRAPPER_ID );
			if( ! classicEditorContainer ) {
				return false;
			}
			return classicEditorContainer.classList.contains( "et_pb_hidden" );
		}
	}

	initDivi() {
		const classicEditorContainer = document.getElementById( DIVI_EDITOR_WRAPPER_ID );
		if( ! classicEditorContainer ) {
			return;
		}
		const observer = new MutationObserver( mutationsList => {
			forEach( mutationsList, mutation => {
				if( mutation.type === "attributes" && mutation.attributeName === "class" ) {
					if( mutation.target.classList.contains( "et_pb_hidden" ) ) {
						this.callbacks.classicEditorHidden();
					} else {
						this.callbacks.classicEditorShown();
					}
				}
			} );
		} );
		observer.observe( classicEditorContainer, { attributes: true } );
	}
}

export default CompatabilityHelper;
