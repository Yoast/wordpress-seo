import React from "react";
import {localize} from "i18n-calypso";

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
	}

	/**
	 * Retrieves the various translations to be used within the component.
	 * 
	 * @returns {Object} An object containing the various translations.
	 */
	getTranslations() {
		return {
			previewTitle:       this.props.translate( "Search Result Preview" ),
			previewDescription: this.props.translate( "You can click on each element in the preview to jump to the Snippet Editor." ),
			titleLabel:         this.props.translate( "SEO title preview: " ),
			title:              this.props.title || this.props.translate( "This is an example title - edit by clicking here" ),
			urlLabel:           this.props.translate( "URL preview: " ),
			descriptionLabel:   this.props.translate( "Meta description preview: " ),
			description:        this.props.description || this.props.translate( "Please provide a meta description by editing the snippet below." ),
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

		return ( <span className="yoast-search-result-preview__date">{ this.props.date } - </span> );
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
		                 className="yoast-button__edit"
		                 onClick={ this.props.onEditButtonClick }
		                 optionalAttributes={ { "aria-expanded": false } } /> );
	}

	/**
	 * Measures the title and description length the first time the component is mounted.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.props.measureTitle( this.getFieldWidthByReference("previewTitle") );
		this.props.measureDescription( this.props.description.length );
	}

	/**
	 * Determines whether or not the compenent was updated and if so, updates the input values.
	 *
	 * @param {Object} prevProps The previous value of the props, before being updated.
	 * @param {Object} prevState The previous state of the component, before being updated.
	 *
	 * @returns {void}
	 */
	componentDidUpdate(prevProps, prevState) {
		if ( this.props.title !== prevProps.title ) {
			// Recalculate width
			this.props.measureTitle( this.getFieldWidthByReference("previewTitle") );
		}

		if ( this.props.description !== prevProps.description ) {
			// Recalculate width
			this.props.measureDescription( this.props.description.length );
		}
	}

	/**
	 * Gets the width of a specific, referred element.
	 *
	 * @param {string} reference The reference to look up an element by.
	 * @returns {number} The width of the referenced element or 0 if nothing was found.
	 */
	getFieldWidthByReference(reference) {
		return this.refs[reference].getBoundingClientRect().width || 0;
	}

	/**
	 * Sets the appropiate class name for a specific field, based on its state.
	 *
	 * @param {string} field The field to look up the class name for.
	 * @returns {string} The class name of the field.
	 */
	setClassNameForField(field) {
		if (this.props.focusedField === field) {
			return this.props.classNames.focused;
		}

		if ( this.props.hoveredField === field) {
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
	mouseEventHandlers(previewField, formField) {
		let handlers = {
			onMouseEnter: this.props.eventHandler.bind(this, previewField, formField),
			onMouseLeave: this.props.eventHandler.bind(this, previewField, formField),
			onClick: this.props.eventHandler.bind(this, previewField, formField),
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
			<Section level={3} headingText={translations.previewTitle} headingClassName="yoast-search-result-preview__heading yoast-icon__eye" className="yoast-search-result-preview">
				<p className="screen-reader-text">{translations.previewDescription}</p>

				<div ref="previewTitleContainer" className={this.setClassNameForField("previewTitleContainer")} {...this.mouseEventHandlers("previewTitleContainer", "formTitle")}>
					<span className="screen-reader-text">{translations.titleLabel}</span>
                    <span ref="previewTitle"
                          className="yoast-search-result-preview__title">{translations.title}</span>
				</div>

				<div ref="previewUrlContainer" className={this.setClassNameForField("previewUrlContainer")} {...this.mouseEventHandlers("previewUrlContainer", "formSlug")}>
					<span className="screen-reader-text">{translations.urlLabel}</span>
					<span ref="previewUrl"
					      className="yoast-search-result-preview__url">{this.props.url}</span>
				</div>

				<div ref="previewDescriptionContainer" className={this.setClassNameForField("previewDescriptionContainer")}  {...this.mouseEventHandlers("previewDescriptionContainer", "formDescription")}>
					<span className="screen-reader-text">{translations.descriptionLabel}</span>
					{ this.renderDate() }
					<span ref="previewDescription"
					      className="yoast-search-result-preview__description">{translations.description.substr( 0, 156 )}</span>
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
	date: React.PropTypes.string,
	description: React.PropTypes.string,
	title: React.PropTypes.string,
	url: React.PropTypes.string,
	onEditButtonClick: React.PropTypes.func,
	classNames: React.PropTypes.object,
	eventHandler: React.PropTypes.func,
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

