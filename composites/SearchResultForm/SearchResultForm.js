import React from "react";
import { localize } from "i18n-calypso";

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

		this.classNames = {
			label: "yoast-search-result-form__label",
			field: "yoast-search-result-form__field",
			progress: "yoast-search-result-form__progress",
			progressState: "yoast-search-result-form__progress--",
			descriptionField: "yoast-search-result-form__description",
			button: "yoast-button yoast-search-result-form__close-button",
		};
	}

	/**
	 * Retrieves translatable strings to be used throughout the component.
	 *
	 * @returns {object} An object containing all the possible translations.
	 */
	getTranslations() {
		return {
			formTitle: this.props.translate( "Search Result Form" ),
			formDescription: this.props.translate( "You can click on each element in the preview to jump to the Snippet Editor." ),
			titleLabel: this.props.translate( "SEO title preview: " ),
			title: this.props.title || this.props.translate( "This is an example title - edit by clicking here" ),
			urlLabel: this.props.translate( "Slug preview: " ),
			descriptionLabel: this.props.translate( "Meta description preview: " ),
			description: this.props.description || this.props.translate( "Please provide a meta description by editing it here." ),
		};
	}

	/**
	 * Prepares the slug by removing the baseURL so that the user only edits the actual search results' slug / URL.
	 *
	 * @returns {string} The slug that should be editable.
	 */
	prepareSlug() {
		let baseUrl = "example.com/";

		return this.props.slug.replace( baseUrl, "" );
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
	 * Sets the appropiate class name for a specific field, based on its state.
	 *
	 * @param {string} field The field to look up the class name for.
	 * @returns {string} The class name of the field.
	 */
	setClassNameForField( field ) {
		if ( this.props.focusedField === field ) {
			return this.props.classNames.focused;
		}

		if ( this.props.hoveredField === field ) {
			return this.props.classNames.hovered;
		}

		return this.props.classNames.default;
	}

	/**
	 * Sets an appropiate class name for the progress bar based on its current textual score.
	 *
	 * @param {string} score The score to use for the class name (bad, ok or good).
	 * @returns {string} The class name to be used by the progress bar.
	 */
	setClassNameForProgressBar( score ) {
		return `${this.classNames.progress} ${this.classNames.progressState}${score}`;
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
					ref="formTitle"
					label="SEO Title"
					value={this.props.title}
					onChange={ this.props.onTitleChange }

					hasFocus={this.props.focusedField === "formTitle"}

					container-className={this.setClassNameForField( "formTitle" )}
					label-className={this.classNames.label}
					field-onFocus={this.props.eventHandler.bind( this, "previewTitleContainer", "formTitle" )}
					field-className={this.classNames.field}
					field-placeholder={translations.title} />

				<Progressbar
					value={this.props.titleLengthInPixels}
					min={0}
					max={600}
					optionalAttributes={ {
						className: this.setClassNameForProgressBar( this.props.titleRating ),
					} } />

				<Textfield
					name="slug"
					ref="formSlug"
					label="Slug"
					value={slug}
					onChange={ this.props.onSlugChange }

					hasFocus={this.props.focusedField === "formSlug"}

					container-className={this.setClassNameForField( "formSlug" )}
					label-className={this.classNames.label}
					field-onFocus={this.props.eventHandler.bind( this, "previewUrlContainer", "formSlug" )}
					field-className={this.classNames.field} />

				<Textfield
					name="description"
					ref="formDescription"
					label="Description"
					value={this.props.description}
					onChange={ this.props.onDescriptionChange }

					hasFocus={this.props.focusedField === "formDescription"}

					multiline={true}
					container-className={this.setClassNameForField( "formDescription" )}
					label-className={this.classNames.label}
					field-onFocus={this.props.eventHandler.bind( this, "previewDescriptionContainer", "formDescription" )}
					field-className={this.classNames.descriptionField}
					field-placeholder={translations.description} />

				<Progressbar
					value={this.props.descriptionLength}
					min={0}
					max={156}
					optionalAttributes={ {
						className: this.setClassNameForProgressBar( this.props.descriptionRating ),
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
	onSlugChange: React.PropTypes.func,
	onDescriptionChange: React.PropTypes.func,
	focusedField: React.PropTypes.string,
	hoveredField: React.PropTypes.string,
	translate: React.PropTypes.func.isRequired,
	classNames: React.PropTypes.object,
	eventHandler: React.PropTypes.func.isRequired,
	titleLengthInPixels: React.PropTypes.number,
	titleRating: React.PropTypes.string,
	descriptionLength: React.PropTypes.number,
	descriptionRating: React.PropTypes.string,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{date: string, description: string, url: string}}
 */
SearchResultForm.defaultProps = {
	date: "",
	slug: "example.com/example-post/",

	focusedField: "",
	hoveredField: "",

	onCloseButtonClick: () => {},
	onTitleChange: () => {},
	onSlugChange: () => {},
	onDescriptionChange: () => {},
};

export default localize( SearchResultForm );
