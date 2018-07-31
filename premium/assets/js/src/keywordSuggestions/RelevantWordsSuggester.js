/* global jQuery, YoastSEO */

import React from "react";
import ReactDOM from "react-dom";
import StyledSection from "yoast-components/forms/StyledSection/StyledSection";
import { translate } from "yoast-components/utils/i18n";

class RelevantWordsSuggester {

	/**
	 * @param {ProminentWordStorage} prominentWordStorage      The class that handles the focus keyword storage.
	 * @param {function}             updateStore               Dispatches an action to update the Redux store (and
	 *                                                         update the component).
	 * @param {bool}                 contentEndpointsAvailable Whether or not the content endpoints are available.
	 *
	 * @returns {void}
	 */
	constructor( { prominentWordStorage, updateStore, contentEndpointsAvailable = true } ) {
		this._prominentWordStorage = prominentWordStorage;
		this._updateStore = updateStore;
		this._contentEndpointsAvailable = contentEndpointsAvailable;
		this._storageEnabled = false;
		this.words = null;
	}

	/**
	 * Adds all event handlers.
	 *
	 * @returns {void}
	 */
	suggest() {
		if ( this._contentEndpointsAvailable  ) {
			// Be mindful of our impact, only start polling and savings prominent words after 10 seconds.
			window.setTimeout( this.startStoringWords.bind( this ), 10000 );
		}
	}

	/**
	 * Stores the prominent words.
	 *
	 * @returns {void}
	 */
	startStoringWords() {
		this._storageEnabled = true;

		// If we have ever retrieved words we can trigger the first storage call.
		if ( this.words !== null ) {
			this._prominentWordStorage.saveProminentWords( this.words );
		}
	}

	/**
	 * Updates the words from the researcher.
	 *
	 * @returns {void}
	 */
	updateWords() {
		const researcher = YoastSEO.app.researcher;

		this.words = researcher.getResearch( "relevantWords" );

		if ( this._storageEnabled ) {
			this._prominentWordStorage.saveProminentWords( this.words );
		}

		this._updateStore( this.words );
	}
}

export default RelevantWordsSuggester;
