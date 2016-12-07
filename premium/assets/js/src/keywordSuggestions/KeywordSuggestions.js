/* global jQuery, YoastSEO */

import React from "react";
import ReactDOM from "react-dom";
import { KeywordSuggestions as KeywordSuggestionsComponent } from "yoast-premium-components";
import StyledSection from "yoast-components/forms/StyledSection/StyledSection";
import { translate } from "yoast-components/utils/i18n";

class KeywordSuggestions {

	/**
	 * @param {ProminentWordStorage} prominentWordStorage The class that handles the focus keyword storage.
	 * @param {bool} insightsEnabled Whether or not the insights UI is enabled.
	 * @param {bool} contentEndpointsAvailable Whether or not the content endpoints are available.
	 */
	constructor( { prominentWordStorage, insightsEnabled, contentEndpointsAvailable = true } ) {
		this._insightsEnabled = insightsEnabled;
		this._storageEnabled = false;
		this._contentEndpointsAvailable = contentEndpointsAvailable;
		this.words = null;
		this._prominentWordStorage = prominentWordStorage;

		jQuery( window ).on( "YoastSEO:numericScore", this.updateWords.bind( this ) );
	}

	/**
	 * Initializes into the DOM and adds all event handlers.
	 *
	 * @returns {void}
	 */
	initializeDOM() {
		if ( this._insightsEnabled ) {
			this.appendSuggestionsDiv();
			this.renderComponent();
		}

		if ( this._contentEndpointsAvailable  ) {
			// Be mindful of our impact, only start polling and savings prominent words after 10 seconds.
			window.setTimeout( this.startStoringWords.bind( this ), 10000 );
		}
	}

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

		if ( this._insightsEnabled ) {
			this.renderComponent();
		}
	}


	/**
	 * Appends the suggestions div to the DOM.
	 *
	 * @returns {void}
	 */
	appendSuggestionsDiv() {
		let contentDiv = jQuery( "#wpseo_content" );

		let tbody = contentDiv.find( "tbody" );
		let newRow = jQuery( "<tr><td></td></tr>");

		tbody.append( newRow );

		let td = newRow.find( "td" );

		this.suggestionsDiv = document.createElement( "div" );

		td.html( this.suggestionsDiv );
	}

	/**
	 * Initializes the component inside the suggestions div.
	 *
	 * @returns {void}
	 */
	renderComponent() {
		let words = this.words;
		if ( words === null ) {
			words = [];
		}

		let keywordSuggestions = ( <KeywordSuggestionsComponent relevantWords={words} /> );
		let title = translate( "Insights" );

		ReactDOM.render(
			<StyledSection title={title} icon="file-text-o" sectionContent={keywordSuggestions} />,
			this.suggestionsDiv
		);
	}
}

export default KeywordSuggestions;
