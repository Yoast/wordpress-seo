/* global jQuery, YoastSEO */

import React from "react";
import ReactDOM from "react-dom";
import { KeywordSuggestions as KeywordSuggestionsComponent } from "yoast-premium-components";

class KeywordSuggestions {
	constructor( multiKeyword ) {
		this.words = [];
		this._multiKeyword = multiKeyword;
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
		jQuery( this._multiKeyword ).on( "changedCurrentKeywords", this.renderComponent.bind( this ) );
	}

	/**
	 * Updates the words from the researcher.
	 *
	 * @returns {void}
	 */
	updateWords() {
		const researcher = YoastSEO.app.researcher;

		const words = researcher.getResearch( "relevantWords" );

		this.words = words.slice( 0, 5 ).map( ( word ) => {
			return word.getCombination();
		} );

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
	 * Adds a focus keyword to multi keyword if possible.
	 *
	 * @param {string} keyword The keyword to be added.
	 * @returns {void}
	 */
	addFocusKeyword( keyword ) {
		if ( ! this._multiKeyword.canAddTab() ) {
			return;
		}

		let addedTab = this._multiKeyword.addKeywordTab( keyword, "na", false );
		this._multiKeyword.updateKeywordTab( addedTab );

		this.renderComponent();
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
	 * Retrieves the current keywords from the multi keyword object.
	 *
	 * @returns {string[]} The current keywords in a flat array of strings.
	 */
	getCurrentKeywords() {
		let currentKeywords = this._multiKeyword.getKeywords();

		return currentKeywords.map( keywordObject => keywordObject.keyword );
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
				currentKeywords={this.getCurrentKeywords()}
				useAsFocusKeyword={this.updateKeywordField.bind( this )}
				addFocusKeyword={this.addFocusKeyword.bind( this )} />,
			this.suggestionsDiv
		);
	}
}

export default KeywordSuggestions;
