import React from "react";

import SearchResultPreview from '../SearchResultPreview/SearchResultPreview';
import SearchResultForm from '../SearchResultForm/SearchResultForm';

class SearchResultEditor extends React.Component {

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

	stripSpaces( text ) {
		// Replace multiple spaces with single space
		text = text.replace( /\s{2,}/g, " " );

		// Replace spaces followed by periods with only the period.
		text = text.replace( /\s\./g, "." );

		// Remove first/last character if space
		text = text.replace( /^\s+|\s+$/g, "" );

		return text;
	}

	stripHTML( text ) {
		text = text.replace( /(<([^>]+)>)/ig, " " );
		text = this.stripSpaces( text );
		return text;
	}

	onEditButtonClick() {
		this.setState( {
			displayForm: !this.state.displayForm
		} );
	}

	onInputChangeHandler(stateName, event) {
		let newValue = event.target.value;
		let state = {};

		state[stateName] = newValue;

		this.setState( state );
	}

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

	formatSlug() {
		return `${this.props.baseUrl}${this.state.formSlug}`;
	}

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

SearchResultEditor.propTypes = {
};

SearchResultEditor.defaultProps = {
	baseUrl: "example.com/"
};

export default SearchResultEditor;
