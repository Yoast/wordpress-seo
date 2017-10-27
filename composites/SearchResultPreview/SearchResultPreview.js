import React from "react";
import PropTypes from "prop-types";

import { localize } from "../../utils/i18n";
import Section from "../../forms/Section";
import Button from "../../forms/Button";

/**
 * The SearchResultPreview component.
 */
class SearchResultPreview extends React.Component {
	/**
	 * Constructs the SearchResultPreview.
	 *
	 * @param {Object} props The props to be used by the SearchResultPreview.
	 */
	constructor( props ) {
		super( props );

		this.classNames = {
			section: "yoast-search-result-preview",
			sectionHeading: "yoast-search-result-preview__heading yoast-icon__eye",
			screenReaderText: "screen-reader-text",
			title: "yoast-search-result-preview__title",
			description: "yoast-search-result-preview__description",
			url: "yoast-search-result-preview__url",
			edit: "yoast-button__edit",
			date: "yoast-search-result-preview__date",
		};
	}

	/**
	 * Retrieves the various translations to be used within the component.
	 *
	 * @returns {Object} An object containing the various translations.
	 */
	getTranslations() {
		return {
			previewTitle: this.props.translate( "Search Result Preview" ),
			previewDescription: this.props.translate( "You can click on each element in the preview to jump to the Snippet Editor." ),
			titleLabel: this.props.translate( "SEO title preview: " ),
			title: this.props.title || this.props.translate( "This is an example title - edit by clicking here" ),
			urlLabel: this.props.translate( "URL preview: " ),
			descriptionLabel: this.props.translate( "Meta description preview: " ),
			description: this.props.description || this.props.translate( "Please provide a meta description by editing the snippet below." ),
		};
	}

	/**
	 * Renders out the date as shown by Google.
	 *
	 * @returns {JSX|string} The date or an empty string if no date is available.
	 */
	renderDate() {
		if ( this.props.date === "" ) {
			return "";
		}

		return ( <span className={this.classNames.date}>{ this.props.date } - </span> );
	}

	/**
	 * Renders out the edit button (if applicable).
	 *
	 * @returns {string|JSX.Element} The edit button or an empty string if no button event is available.
	 */
	renderEditButton() {
		if ( ! this.props.onEditButtonClick ) {
			return "";
		}

		return ( <Button text={ this.props.translate( "Edit snippet" ) }
		                 className={this.classNames.edit}
		                 onClick={ this.props.onEditButtonClick }
		                 optionalAttributes={ { "aria-expanded": false } } /> );
	}

	/**
	 * Measures the title and description length the first time the component is mounted.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.props.measureTitle( this.getPreviewTitleWidth() );
		this.props.measureDescription( this.props.description.length );
	}

	/**
	 * Determines whether or not the compenent was updated and if so, updates the input values.
	 *
	 * @param {Object} prevProps The previous value of the props, before being updated.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( this.props.title !== prevProps.title ) {
			// Recalculate width
			this.props.measureTitle( this.getPreviewTitleWidth() );
		}

		if ( this.props.description !== prevProps.description ) {
			// Recalculate width
			this.props.measureDescription( this.props.description.length );
		}
	}

	/**
	 * Gets the width of the preview title element.
	 *
	 * @returns {number} The width of the referenced element or 0 if nothing was found.
	 */
	getPreviewTitleWidth() {
		return this.previewTitle.getBoundingClientRect().width || 0;
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
	 * Defines the various event handlers.
	 *
	 * @param {string} previewField The preview field that is possibly effected by the event.
	 * @param {string} formField The form field that is possibly effected by the event.
	 * @returns {Object} A list of the various event handlers.
	 */
	mouseEventHandlers( previewField, formField ) {
		let handlers = {
			onMouseEnter: this.props.eventHandler.bind( this, previewField, formField ),
			onMouseLeave: this.props.eventHandler.bind( this, previewField, formField ),
			onClick: this.props.eventHandler.bind( this, previewField, formField ),
		};

		return handlers;
	}

	/**
	 * Represents the SearchResultPreview composite component.
	 *
	 * @returns {JSX.Element} A representation of the SearchResultPreview component.
	 */
	render() {
		let translations = this.getTranslations();

		return (
			<Section
				level={3}
				headingText={translations.previewTitle}
				headingClassName={this.classNames.sectionHeading}
				className={this.classNames.section}>
				<p className={this.classNames.screenReaderText}>{translations.previewDescription}</p>

				<div
					className={this.setClassNameForField( "previewTitleContainer" )}
					{...this.mouseEventHandlers( "previewTitleContainer", "formTitle" )}>
					<span className={this.classNames.screenReaderText}>{translations.titleLabel}</span>
					<span
						ref={ previewTitle => {
							this.previewTitle = previewTitle;
						} }
						className={this.classNames.title}>
						{translations.title}
					</span>
				</div>

				<div
					className={this.setClassNameForField( "previewUrlContainer" )}
					{...this.mouseEventHandlers( "previewUrlContainer", "formSlug" )}>
					<span className={this.classNames.screenReaderText}>{translations.urlLabel}</span>
					<span className={this.classNames.url}>{this.props.url}</span>
				</div>

				<div
					className={this.setClassNameForField( "previewDescriptionContainer" )}
					{...this.mouseEventHandlers( "previewDescriptionContainer", "formDescription" )}>
					<span className={this.classNames.screenReaderText}>{translations.descriptionLabel}</span>
					{ this.renderDate() }
					<span
						className={this.classNames.description}>{translations.description.substr( 0, 156 )}</span>
				</div>

				{ this.renderEditButton() }
			</Section>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{date: string, description: string, title: string, url: string}}
 */
SearchResultPreview.propTypes = {
	date: PropTypes.string,
	description: PropTypes.string,
	title: PropTypes.string,
	url: PropTypes.string,
	onEditButtonClick: PropTypes.func,
	classNames: PropTypes.object,
	eventHandler: PropTypes.func,
	translate: PropTypes.func.isRequired,
	measureTitle: PropTypes.func,
	measureDescription: PropTypes.func,
	focusedField: PropTypes.string,
	hoveredField: PropTypes.string,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{date: string, description: string, url: string}}
 */
SearchResultPreview.defaultProps = {
	date: "",
	url: "example.com/example-url",
	onEditButtonClick: () => {},
};

export default localize( SearchResultPreview );

