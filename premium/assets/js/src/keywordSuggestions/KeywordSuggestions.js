/* global jQuery, YoastSEO */

import React from "react";
import ReactDOM from "react-dom";
import { KeywordSuggestions as KeywordSuggestionsComponent } from "yoast-premium-components";

class KeywordSuggestions {
	constructor() {
		this.words = [];
	}

	/**
	 * Initializes into the DOM and adds all event handlers
	 *
	 * @returns {void}
	 */
	initializeDOM() {
		this.appendSuggestionsDiv();
		this.renderComponent();

		jQuery( window ).on( "YoastSEO:numericScore", this.updateWords.bind( this ) );
	}

	/**
	 * Updates the words from the researcher.
	 *
	 * @returns {void}
	 */
	updateWords() {
		const researcher = YoastSEO.app.researcher;

		const words = researcher.getResearch( "relevantWords" );

		this.words = words.map( ( word ) => {
			return word.getCombination();
		} ).slice( 0, 5 );

		this.renderComponent();
	}

	/**
	 * Updates the keyword field with the given word.
	 *
	 * @param {string} word The word to update the keyword field with.
	 * @returns {void}
	 */
	updateKeywordField( word ) {
		this.keywordField.val( word );

		YoastSEO.app.refresh();
	}

	/**
	 * Appends the suggestions div to the DOM
	 *
	 * @returns {void}
	 */
	appendSuggestionsDiv() {
		this.keywordField = jQuery( "#yoast_wpseo_focuskw_text_input" );

		this.suggestionsDiv = document.createElement( "div" );

		this.keywordField.after( this.suggestionsDiv );
	}

	/**
	 * Initializes the component inside the suggestions div.
	 *
	 * @returns {void}
	 */
	renderComponent() {
		ReactDOM.render(
			<KeywordSuggestionsComponent
				relevantWords={this.words}
				useAsFocusKeyword={this.updateKeywordField.bind( this )} />,
			this.suggestionsDiv
		);
	}
}

export default KeywordSuggestions;
