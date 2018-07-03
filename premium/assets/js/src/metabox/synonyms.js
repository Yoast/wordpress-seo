/* global jQuery */

// External dependencies.
import React from "react";
import get from "lodash/get";
import {
	setSynonyms,
	setKeywordSynonyms,
	removeKeywordSynonyms,
} from "yoast-components/composites/Plugin/Synonyms/actions/synonyms";
import { __ } from "@wordpress/i18n";

// Internal dependencies.
import configureStore from "../redux/store";
import { renderReactApp } from "../redux/utils/render";
import SynonymsContainer from "./synonymsContainer";
import listenToActiveKeyword from "./KeywordTabWrapper";

const $ = jQuery;

class Synonyms {
	/**
	 * Initializes the Synonyms class.
	 *
	 * @param {Object} args               The arguments.
	 * @param {Object} args.app           The YoastSEO app.
	 * @param {Object} args.store         The store.
	 * @param {string} args.template      The HTML template string of the wrapper.
	 * @param {string} args.label         The label of the synonyms section.
	 * @param {string} args.hiddenFieldId The id of the hidden input field.
	 * @param {string} args.keywordQuery  The jQuery selector to find all the keywords.
	 *
	 * @returns {void}
	 */
	constructor( args = {} ) {
		this.initializeOptions( args );
		this.initializeApp( args.app );
		this.initializeStore( args.store );

		this._hiddenField = $( `#${ this._options.hiddenFieldId }` );
		if ( this._hiddenField.length === 0 ) {
			throw new Error( "Hidden form field not found." );
		}

		this.setSynonyms = this.setSynonyms.bind( this );
		this.handlePremiumStoreChange = this.handlePremiumStoreChange.bind( this );
		this.handleStoreChange = this.handleStoreChange.bind( this );

		window.getKeywords = this.getKeywords.bind( this );
	}

	/**
	 * Initializes the options and falls back with sensible defaults.
	 *
	 * @param {Object} options               The options object.
	 * @param {string} options.template      The HTML template string of the wrapper.
	 * @param {string} options.label         The label of the synonyms section.
	 * @param {string} options.hiddenFieldId The id of the hidden input field.
	 * @param {string} options.keywordQuery  The jQuery selector to find all the keywords.
	 *
	 * @returns {void}
	 */
	initializeOptions( options = {} ) {
		this._options = {
			template: options.template || "<div id='wpseosynonyms'></div>",
			label: options.label || __( "Keyword synonyms" ),
			hiddenFieldId: options.hiddenFieldId || "yoast_wpseo_keywordsynonyms",
			keywordQuery: options.keywordQuery || "#wpseo-meta-section-content .wpseo_keyword_tab .wpseo_tablink[data-keyword]",
		};
	}

	/**
	 * Initializes the app variable.
	 *
	 * @param {Object} app The YoastSEO app.
	 *
	 * @returns {void}
	 */
	initializeApp( app ) {
		this._app = app || get( window, [ "YoastSEO", "app" ], false );

		if ( ! this._app ) {
			throw new Error( "YoastSEO app does not exist." );
		}
	}

	/**
	 * Initializes the store variable.
	 *
	 * @param {Object} store The store.
	 *
	 * @returns {void}
	 */
	initializeStore( store ) {
		this._store = store || get( window, [ "YoastSEO", "store" ], false );

		if ( ! this._store ) {
			throw new Error( "YoastSEO store does not exist." );
		}
	}

	/**
	 * Adds a YoastSEO.js callback for premium data.
	 *
	 * @returns {void}
	 */
	initializePremiumDataCallback() {
		this._app.registerCustomDataCallback = () => {
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
		this._app.refresh();
	}

	/**
	 * Retrieves the active keyword from the store.
	 *
	 * @returns {string} The active keyword.
	 */
	getActiveKeyword() {
		return this._store.getState().activeKeyword;
	}

	/**
	 * Retrieves the keywords from the HTML page.
	 *
	 * @returns {Array} The keywords.
	 */
	getKeywords() {
		const elements = $( this._options.keywordQuery );
		const keywords = [];

		elements.each( ( index, element ) => {
			keywords.push( $( element ).data( "keyword" ) );
		} );

		return keywords;
	}

	/**
	 * Retrieves the active keyword index from the HTML page.
	 *
	 * @returns {number} The keywords.
	 */
	getActiveKeywordIndex() {
		const elements = $( this._options.keywordQuery );

		elements.each( ( index, element ) => {
			if ( $( element ).parent().hasClass( "active" ) ) {
				return index;
			}
		} );

		return -1;
	}

	/**
	 * Overwrites all the synonyms in the store.
	 *
	 * @param {string} synonyms The synonyms to set.
	 *
	 * @returns {void}
	 */
	setSynonyms( synonyms ) {
		this._premiumStore.dispatch( setSynonyms( synonyms ) );
	}

	/**
	 * Retrieves all the synonyms from the store.
	 *
	 * @returns {string} The current synonyms.
	 */
	getSynonyms() {
		return this._premiumStore.getState().synonyms;
	}

	/**
	 * Retrieves the synonyms from the hidden field.
	 *
	 * @returns {Object} The synonyms for each keyword.
	 */
	getSavedSynonyms() {
		return JSON.parse( this._hiddenField.val() || "[]" );
	}

	/**
	 * Updates the current keyword synonyms in the hidden input.
	 *
	 * @param {string} synonyms The current synonyms.
	 *
	 * @returns {void}
	 */
	updateHiddenField( synonyms ) {
		this._hiddenField.val( JSON.stringify( synonyms ) );
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
			if ( activeKeyword.length === 0 ) {
				return;
			}

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
		const container = $( this._options.template )[ 0 ];
		previousElement.after( container );

		// Create and expose a premium store.
		this._premiumStore = configureStore();
		YoastSEO.premiumStore = this._premiumStore;

		// Apply the saved synonyms to the store in order of the keyword tabs.
		const keywords = this.getKeywords();
		const savedSynonyms = this.getSavedSynonyms();
		const synonyms = keywords.map( ( value, index ) => savedSynonyms[ index ] || "" );
		this.setSynonyms( synonyms );

		// Initialize premium store listener.
		this._previousSynonyms = this.getSynonyms();
		this._premiumStore.subscribe( this.handlePremiumStoreChange );

		// Initialize store listener.
//		this._previousKeyword = this.getActiveKeyword();
//		this._store.subscribe( this.handleStoreChange );

		// Render react app.
		const props = {
			label: this._options.label,
		};
		const WrappedSynonyms = listenToActiveKeyword( this._premiumStore )( SynonymsContainer );
		renderReactApp( container, WrappedSynonyms, this._premiumStore, props );

		// Add premium specific data to YoastSEO.js.
		this.initializePremiumDataCallback();
	}
}

export default Synonyms;
