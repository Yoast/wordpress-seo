// External dependencies.
import get from "lodash/get";
import { setSynonyms } from "yoast-components/composites/Plugin/Synonyms/actions/synonyms";

// Internal dependencies.
import configureStore from "../redux/store";
import { renderReactApp } from "../redux/utils/render";
import SynonymsContainer from "./synonymsContainer";

const $ = jQuery;

class Synonyms {
	/**
	 * Initializes the Synonyms class.
	 *
	 * @param {Object} args               The arguments.
	 * @param {string} args.template      The HTML template string of the wrapper.
	 * @param {string} args.label         The label of the synonyms section.
	 * @param {string} args.synonyms      The synonyms.
	 * @param {string} args.hiddenFieldId The id of the hidden input field.
	 *
	 * @returns {void}
	 */
	constructor( args = {} ) {
		this.template = args.template || "<div id='wpseosynonyms'></div>";
		this.label = args.label || "Keyword synonyms";
		this.synonyms = args.synonyms || "";
		this.hiddenFieldId = args.hiddenFieldId || "yoast_wpseo_keywordsynonyms";

		this.setSynonyms = this.setSynonyms.bind( this );
		this.handlePremiumStoreChange = this.handlePremiumStoreChange.bind( this );
		this.handleStoreChange = this.handleStoreChange.bind( this );

		this.hiddenField = $( `#${ this.hiddenFieldId }` );
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

		app.registerCustomDataCallback = () => {
			return {
				synonyms: this.getSynonyms(),
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
	 * Retrieves the active keyword from the store.
	 *
	 * @returns {string} The active keyword.
	 */
	getActiveKeyword() {
		return YoastSEO.store.getState().activeKeyword;
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

	/**
	 * Retrieves the synonyms for the active keyword.
	 *
	 * @returns {string} The current synonyms.
	 */
	getSynonyms() {
		return this._store.getState().synonyms;
	}

	/**
	 * Retrieves the synonyms from the hidden field.
	 *
	 * @returns {Object} The synonyms for each keyword.
	 */
	getAllSynonyms() {
		return JSON.parse( this.hiddenField.val() || "{}" );
	}

	/**
	 * Updates the current keyword synonyms in the hidden input.
	 *
	 * @param {string} synonyms The current synonyms.
	 *
	 * @returns {void}
	 */
	updateHiddenField( synonyms ) {
		if ( this.hiddenField.length === 0 ) {
			return;
		}

		const activeKeyword = this.getActiveKeyword();
		if ( activeKeyword.length === 0 ) {
			return;
		}

		const allSynonyms = this.getAllSynonyms();
		allSynonyms[ activeKeyword ] = synonyms;

		this.hiddenField.val( JSON.stringify( allSynonyms ) );
	}

	/**
	 * Handles premium store changes.
	 *
	 * @returns {void}
	 */
	handlePremiumStoreChange() {
		const synonyms = this.getSynonyms();

		if ( this._previousSynonyms !== synonyms ) {
			this._previousSynonyms = synonyms;

			this.updateHiddenField( synonyms );
			this.refreshApp();
		}
	}

	/**
	 * Handles store changes.
	 *
	 * @returns {void}
	 */
	handleStoreChange() {
		const activeKeyword = this.getActiveKeyword();

		if ( this._previousKeyword !== activeKeyword ) {
			this._previousKeyword = activeKeyword;

			const allSynonyms = this.getAllSynonyms();
			const synonyms = allSynonyms[ activeKeyword ] || "";

			this.setSynonyms( synonyms );
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
	initializeDOM( insertAfterID = "wpseofocuskeyword" ) {
		// Check if the given ID is on the page.
		const previousElement = $( `#${ insertAfterID }` );
		if ( previousElement.length === 0 ) {
			return;
		}

		// Insert the container on the page.
		const container = $( this.template )[ 0 ];
		previousElement.after( container );

		// Create and expose a premium store.
		this._store = configureStore();
		YoastSEO.premiumStore = this._store;

		// Initialize premium store listener.
		this._previousSynonyms = this.getSynonyms();
		this._store.subscribe( this.handlePremiumStoreChange );

		// Initialize store listener.
		this._previousKeyword = this.getActiveKeyword();
		YoastSEO.store.subscribe( this.handleStoreChange );

		// Render react app.
		const props = {
			label: this.label,
			synonyms: this.synonyms,
			onChange: this.setSynonyms,
		};
		renderReactApp( container, SynonymsContainer, this._store, props );

		// Add premium specific data to YoastSEO.js.
		this.initializePremiumDataCallback();
	}
}

export default Synonyms;
