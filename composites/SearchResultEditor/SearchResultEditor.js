import React from "react";

import SearchResultPreview from '../SearchResultPreview/SearchResultPreview';
import SearchResultForm from '../SearchResultForm/SearchResultForm';

/**
 * Represents a SearchResultEditor, allowing for a search result (as shown by Google), to be previewed and altered, if necessary.
 */
class SearchResultEditor extends React.Component {

	/**
	 * Instantiates a new instance of the SearchResultEditor and sets its default state.
	 * Also adds some method binding and scoping.
	 *
	 * @param {Object} props The properties to use within the editor.
	 * @constructor
	 */
	constructor(props) {
		super(props);

		this.state = {
			displayForm: true,
			formTitle: "",
			formSlug: "",
			formDescription: "",
			titleLengthRating: "bad",
			titleLengthInPixels: 0,
			descriptionLengthRating: "bad",
			descriptionLength: 0,
		};

		this.onEditButtonClick = this.onEditButtonClick.bind(this);
	}

	/**
	 * Removes all unnecessary spaces from a piece of text.
	 *
	 * @param {string} text The text to strip the spaces from.
	 * @returns {string} The text, cleared of all unnecessary spaces.
	 */
	stripSpaces( text ) {
		// Replace multiple spaces with single space
		text = text.replace( /\s{2,}/g, " " );

		// Replace spaces followed by periods with only the period.
		text = text.replace( /\s\./g, "." );

		// Remove first/last character if space
		text = text.replace( /^\s+|\s+$/g, "" );

		return text;
	}

	/**
	 * Strips HTML from a piece of text.
	 *
	 * @param {string} text The text to strip the HTML from.
	 * @returns {string} The text without any HTML tags.
	 */
	stripHTML( text ) {
		text = text.replace( /(<([^>]+)>)/ig, " " );
		text = this.stripSpaces( text );

		return text;
	}

	/**
	 * Handles the onEditButtonClick event.
	 *
	 * @returns {void}
	 */
	onEditButtonClick() {
		this.setState( {
			displayForm: !this.state.displayForm
		} );
	}

	/**
	 * Handles the onInputChange event and updates the input field with its new value.
	 *
	 * @param {string} stateProperty The state property to be updated.
	 * @param {Event} event The event being triggered.
	 *
	 * @returns {void}
	 */
	onInputChangeHandler(stateProperty, event) {
		let newValue = event.target.value;
		let state = {};

		state[stateProperty] = newValue;

		this.setState( state );
	}

	/**
	 * Returns a represenation of the SearchResultForm, based on whether or not the displayForm state is true.
	 *
	 * @returns {JSX.Element} The representation of the SearchResultForm.
	 */
	getSearchResultForm() {
		if ( ! this.state.displayForm ) {
			return null;
		}

		return (
			<SearchResultForm
				title={this.state.formTitle}
				slug={this.state.formSlug}
				description={this.state.formDescription}

				titleRating={this.state.titleLengthRating}
			    descriptionRating={this.state.descriptionLengthRating}

			    titleLengthInPixels={this.state.titleLengthInPixels}
			    descriptionLength={this.state.descriptionLength}

				onCloseButtonClick={ this.onEditButtonClick }
			    onTitleChange={ this.onInputChangeHandler.bind(this, 'formTitle') }
			    onUrlChange={ this.onInputChangeHandler.bind(this, 'formSlug' ) }
			    onDescriptionChange={ this.onInputChangeHandler.bind(this, 'formDescription' ) }
			/>
		);
	}

	/**
	 * Formats the slug to be displayed in the preview.
	 * This is currently still a very crude implementation and might possible need refinement.
	 *
	 * @returns {string} The formatted slug.
	 */
	formatSlug() {
		return `${this.props.baseUrl}${this.state.formSlug}`;
	}

	/**
	 * Rates the title length based on its length in pixels on screen.
	 *
	 * @param {number} length The width of the title, in pixels.
	 */
	rateTitleLength( length ) {
		let rating = "bad";

		if ( ( length > 0 && length < 400 ) || length > 600 ) {
			rating = "ok";
		}

		if ( ( length >= 400 && length <= 600 ) ) {
			rating = "good";
		}

		this.setState( { titleLengthRating: rating, titleLengthInPixels: length } )
	}

	/**
	 * Rates the description length based the amount of characters.
	 *
	 * @param {number} length The length of the description, in characters.
	 */
	rateDescriptionLength( length ) {
		let rating = "bad";

		if ( ( length > 0 && length <= 120 ) || length > 157 ) {
			rating = "ok";
		}

		if ( ( length >= 120 && length <= 157 ) ) {
			rating = "good";
		}

		this.setState( { descriptionLengthRating: rating, descriptionLength: length } )
	}

	/**
	 * Renders the SearchResultEditor, preview and form.
	 *
	 * @returns {JSX.Element} A representation of the SearchResultEditor.
	 */
	render() {
		return (
			<div className="yoast-search-result-editor">
				<SearchResultPreview
				    title={ this.stripHTML( this.state.formTitle ) }
				    url={this.formatSlug()}
				    description={ this.stripHTML( this.state.formDescription ) }

					measureTitle={this.rateTitleLength.bind(this)}
					measureDescription={this.rateDescriptionLength.bind(this)}
					onEditButtonClick={this.onEditButtonClick}
				/>

				{this.getSearchResultForm()}
			</div>
		);
	}

}

/**
 * Sets the appropiate type for the props.
 *
 * @type {{ baseUrl: string }}
 */
SearchResultEditor.propTypes = {
	baseUrl: React.PropTypes.string.isRequired,
};

/**
 * Sets the default value for the props.
 *
 * @type {{baseUrl: string}}
 */
SearchResultEditor.defaultProps = {
	baseUrl: "example.com/"
};

export default SearchResultEditor;
