/* global jQuery, YoastSEO */

import React from "react";
import ReactDOM from "react-dom";
import { KeywordSuggestions as KeywordSuggestionsComponent } from "yoast-premium-components";
import a11ySpeak from "a11y-speak";

class KeywordSuggestions {
	constructor( multiKeyword ) {
		this.words = [];
		this._multiKeyword = multiKeyword;
		this._maxKeywordsReached = false;
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
		jQuery( this._multiKeyword ).on( "changedCurrentKeywords", this.changedCurrentKeywords.bind( this ) );
	}

	/**
	 * Updates the words from the researcher.
	 *
	 * @returns {void}
	 */
	updateWords() {
		const researcher = YoastSEO.app.researcher;

		this.words = researcher.getResearch( "relevantWords" );

		// this.words = words.slice( 0, 3 ).map( ( word ) => {
		// 	return word.getCombination();
		// } );

		this.renderComponent();
	}

	/**
	 * Wrapper around the multi keyword addKeywordTab function
	 *
	 * @param {string} keyword The keyword to add the tab for.
	 * @returns {boolean} Whether adding the tab has succeeded.
	 */
	addKeywordTab( keyword ) {
		if ( ! this._multiKeyword.canAddTab() ) {
			return false;
		}

		let addedTab = this._multiKeyword.addKeywordTab( keyword, "na", false );
		this._multiKeyword.updateKeywordTab( addedTab );

		return true;
	}

	/**
	 * Adds a focus keyword to multi keyword if possible.
	 *
	 * @param {string} keyword The keyword to be added.
	 * @returns {void}
	 */
	addFocusKeyword( keyword ) {
		if ( ! this.addKeywordTab( keyword ) ) {
			this.showMaxKeywordsMessage();
		}

		this.renderComponent();
	}

	/**
	 * Shows and tells the user that the maximum amount of keywords has been reached.
	 *
	 * @returns {void}
	 */
	showMaxKeywordsMessage() {
		this.setErrorMessage( "You have reached the maximum amount of keywords." );
	}

	/**
	 * Handles a change in current keywords from the multi keyword.
	 *
	 * @returns {void}
	 */
	changedCurrentKeywords() {
		// If the user is able to add keywords again, clear the previously received message.
		if ( this._multiKeyword.canAddTab() ) {
			this.setErrorMessage( "" );
		}

		this.renderComponent();
	}

	/**
	 * Sets the error message to be shown and spoken to the user.
	 *
	 * @param {string} errorMessage The error message to communicate.
	 * @returns {void}
	 */
	setErrorMessage( errorMessage ) {
		this._errorMessage = errorMessage;
		a11ySpeak( this._errorMessage, "assertive" );
	}

	/**
	 * Appends the suggestions div to the DOM
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
			/>,
			this.suggestionsDiv
		);
	}
}

export default KeywordSuggestions;
