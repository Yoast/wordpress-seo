// External dependencies.
import get from "lodash/get";
import debounce from "lodash/debounce";
import SynonymsSection from "yoast-components/composites/Plugin/Synonyms/components/SynonymsSection";
import { setSynonyms } from "yoast-components/composites/Plugin/Synonyms/actions/synonyms";

// Internal dependencies.
import configureStore from "../redux/store";
import { renderReactApp } from "../redux/utils/render";

const $ = jQuery;

class Synonyms {
	/**
	 * Initializes the Synonyms class.
	 *
	 * @param {Object} args          The arguments.
	 * @param {string} args.template The HTML template string of the wrapper.
	 * @param {string} args.label    The label of the synonyms section.
	 * @param {string} args.synonyms The synonyms.
	 *
	 * @returns {void}
	 */
	constructor( args = {} ) {
		this.template = args.template || "<div id='wpseosynonyms'></div>";
		this.label = args.label || "Keyword synonyms";
		this.synonyms = args.synonyms || "";

		this.setSynonyms = this.setSynonyms.bind( this );
		this.debouncedSetSynonyms = debounce( this.setSynonyms, 200 );
		this.handleStoreChange = this.handleStoreChange.bind( this );
	}

	/**
	 * Adds a YoastSEO.js callback for premium data.
	 *
	 * @returns {void}
	 */
	initializePremiumDataCallback() {
		const app = get( window, [ "YoastSEO", "app" ], false );
		if ( ! app ) {
			return;
		}

		app.callbacks.getPremiumData = () => {
			const state = this._store.getState();

			return {
				synonyms: state.synonyms,
			};
		};
	}

	/**
	 * Refresh YoastSEO.js
	 *
	 * @returns {void}
	 */
	refreshApp() {
		const app = get( window, [ "YoastSEO", "app" ], false );
		if ( ! app ) {
			return;
		}

		app.refresh();
	}

	/**
	 * Sets the synonyms in the store.
	 *
	 * @param {string} synonyms The synonyms to set.
	 *
	 * @returns {void}
	 */
	setSynonyms( synonyms ) {
		this._store.dispatch( setSynonyms( synonyms ) );
	}

	handleStoreChange() {
		const previousState = this._currentState;
		const currentState = this._store.getState();

		if ( previousState.synonyms !== currentState.synonyms ) {
			this._currentState = currentState;
			this.refreshApp();
		}
	}

	/**
	 * Initializes the DOM.
	 *
	 * @param {string} insertAfterID The ID of the HTML element to use as
	 *                               anchor for our element.
	 *
	 * @returns {void}
	 */
	initDOM( insertAfterID = "wpseofocuskeyword" ) {
		// Check if the given ID is on the page.
		const previousElement = $( `#${ insertAfterID }` );
		if ( previousElement.length === 0 ) {
			return;
		}

		// Insert the container on the page.
		const container = $( this.template )[ 0 ];
		previousElement.after( container );

		this._store = configureStore();
		this._currentState = this._store.getState();
		this._store.subscribe( this.handleStoreChange );

		const props = {
			label: this.label,
			synonyms: this.synonyms,
			onChange: this.debouncedSetSynonyms,
		};
		renderReactApp( container, SynonymsSection, this._store, props );

		// Add premium specific data to YoastSEO.js
		this.initializePremiumDataCallback();
	}
}

export default Synonyms;
