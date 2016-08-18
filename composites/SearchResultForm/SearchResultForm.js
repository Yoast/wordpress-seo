import React from "react";
import {localize} from "i18n-calypso";

import Section from "../../forms/Section";
import Button from "../../forms/Button";
import Textfield from "../../forms/composites/Textfield";
import Progressbar from "../../forms/Progressbar";

/**
 * Represents a SearchResultForm, allowing for a search result (as shown by Google), to be altered.
 */
class SearchResultForm extends React.Component {

	/**
	 * Instantiates a new instance of the SearchResultForm.
	 *
	 * @param {Object} props The properties to use within the form.
	 * @constructor
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Retrieves translatable strings to be used throughout the component.
	 * 
	 * @returns {{formTitle: string, formDescription: string, titleLabel: string, title: string, urlLabel: string, descriptionLabel: string, description: string}}
	 */
	getTranslations() {
		return {
			formTitle:          this.props.translate( "Search Result Form" ),
			formDescription:    this.props.translate( "You can click on each element in the preview to jump to the Snippet Editor." ),
			titleLabel:         this.props.translate( "SEO title preview: " ),
			title:              this.props.title || this.props.translate( "This is an example title - edit by clicking here" ),
			urlLabel:           this.props.translate( "Slug preview: " ),
			descriptionLabel:   this.props.translate( "Meta description preview: " ),
			description:        this.props.description || this.props.translate( "Please provide a meta description by editing it here." ),
		};
	}

	/**
	 * Prepares the slug by removing the baseURL so that the user only edits the actual search results' slug / URL.
	 *
	 * @returns {string} The slug that should be editable.
	 */
	prepareSlug() {
		let baseUrl = "example.com/";

		return this.props.slug.replace(baseUrl, "");
	}

	/**
	 * Renders a close button to be used by the SearchResultForm.
	 *
	 * @returns {JSX.Element} A representation of a close button component.
	 */
	renderCloseButton() {
		return ( <Button text={ this.props.translate( "Close search result form" ) }
						 className="yoast-button yoast-search-result-form__close-button"
						 onClick={ this.props.onCloseButtonClick }
						 optionalAttributes={ { "aria-expanded": false } } /> );
	}

	/**
	 * Renders the SearchResultForm.
	 *
	 * @returns {JSX.Element} A representation of the SearchResultForm.
	 */
	render() {
		let translations = this.getTranslations();
		let slug = this.prepareSlug();

		return (
			<Section level={3} className="yoast-search-result-form">
				<p className="screen-reader-text">{translations.formDescription}</p>

				<Textfield
					name="title"
					label="SEO Title"
					onChange={ this.props.onTitleChange }
					value={this.props.title}
					label-className="yoast-search-result-form__label"
					field-className="yoast-search-result-form__field"
					field-placeholder={translations.title} />

				<Progressbar
					value={this.props.titleLengthInPixels}
					min={0}
					max={600}
					optionalAttributes={ {
						className: "yoast-search-result-form__progress yoast-search-result-form__progress--" + this.props.titleRating
					} } />

				<Textfield
					name="url"
					label="Slug"
					onChange={ this.props.onUrlChange }
					value={slug}
					label-className="yoast-search-result-form__label"
					field-className="yoast-search-result-form__field" />

				<Textfield
					name="description"
					label="Description"
					onChange={ this.props.onDescriptionChange }
					value={this.props.description}
					multiline={true}
					label-className="yoast-search-result-form__label"
					field-className="yoast-search-result-form__description"
					field-placeholder={translations.description} />

				<Progressbar
					value={this.props.descriptionLength}
					min={0}
					max={156}
					optionalAttributes={ {
						className: "yoast-search-result-form__progress yoast-search-result-form__progress--" + this.props.descriptionRating
					} } />

				{ this.renderCloseButton() }
			</Section>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{date: string, description: string, title: string, url: string}}
 */
SearchResultForm.propTypes = {
	date: React.PropTypes.string,
	description: React.PropTypes.string,
	title: React.PropTypes.string,
	slug: React.PropTypes.string,
	baseUrl: React.PropTypes.string,
	onCloseButtonClick: React.PropTypes.func,
	onTitleChange: React.PropTypes.func,
	onUrlChange: React.PropTypes.func,
	onDescriptionChange: React.PropTypes.func,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{date: string, description: string, url: string}}
 */
SearchResultForm.defaultProps = {
	date: "Dec 12, 2014",
	slug: "example.com/example-post/",
	onCloseButtonClick: () => {},
	onTitleChange: () => {},
	onUrlChange: () => {},
	onDescriptionChange: () => {},
};

export default localize( SearchResultForm );
