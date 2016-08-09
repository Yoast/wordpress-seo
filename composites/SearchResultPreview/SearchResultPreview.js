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
	 * @param {object} props The props to be used by the SearchResultPreview.
	 */
	constructor( props ) {
		super( props );
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

		return ( <span className="yoast-snippet-preview__date">{ this.props.date } - </span> );
	}

	renderEditButton() {
		if ( ! this.props.onEditButtonClick ) {
			return "";
		}

		return ( <Button text={ this.props.translate( "Edit snippet" ) } className="yoast-button__edit" onClick={ this.props.onEditButtonClick } optionalAttributes={ { "aria-expanded": false } } /> );
	}

	/**
	 * Represents the SearchResultPreview composite component.
	 *
	 * @returns {JSX} A representation of the SearchResultPreview component.
	 */
	render() {
		let previewTitle = this.props.translate( "Search Result Preview" );
		let previewDescription = this.props.translate( "You can click on each element in the preview to jump to the Snippet Editor." );

		let titleLabel = this.props.translate( "SEO title preview: " );
		let title = this.props.title || this.props.translate( "This is an example title - edit by clicking here" );

		let urlLabel = this.props.translate( "Slug preview: " );

		let metaDescriptionLabel = this.props.translate( "Meta description preview: " );
		let metaDescription = this.props.metaDescription || this.props.translate( "Please provide a meta description by editing the snippet below." );

		return (
			<Section level={3} headingText={previewTitle} headingClassName="yoast-snippet-preview__heading yoast-icon__eye" className="yoast-snippet-preview">
				<p className="screen-reader-text">{previewDescription}</p>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{titleLabel}</span>
                    <span className="yoast-snippet-preview__title">{title}</span>
				</div>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{urlLabel}</span>
					<span className="yoast-snippet-preview__url">{this.props.url}</span>
				</div>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{metaDescriptionLabel}</span>
					{ this.renderDate() }
					<span className="yoast-snippet-preview__description">{metaDescription}</span>
				</div>

				{ this.renderEditButton() }
			</Section>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{date: string, metaDescription: string, title: string, url: string}}
 */
SearchResultPreview.propTypes = {
	date: React.PropTypes.string,
	metaDescription: React.PropTypes.string,
	title: React.PropTypes.string,
	url: React.PropTypes.string,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{date: string, metaDescription: string, url: string}}
 */
SearchResultPreview.defaultProps = {
	date: "Dec 12, 2014",
	url: "example.com/example-slug",
	onEditButtonClick: () => {}
};

export default localize( SearchResultPreview );

