import React from "react";
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

	/**
	 * Represents the SearchResultPreview composite component.
	 *
	 * @returns {JSX} A representation of the SearchResultPreview component.
	 */
	render() {
		let editButton = "";

		let previewTitle = this.props.previewTitle;
		let previewDescription = this.props.previewDescription;

		let titleLabel = this.props.titleLabel;
		let urlLabel = this.props.urlLabel;
		let metaDescriptionLabel = this.props.metaDescriptionLabel;

		let editText = this.props.editText;

		if ( this.props.onEditButtonClick ) {
			editButton = <Button text={editText} className="yoast-edit-button" onClick={this.props.onEditButtonClick} optionalAttributes={ { "aria-expanded": false } } />;
		}

		return (
			<Section level={3} headingText={previewTitle} headingClassName="yoast-snippet-preview__heading yoast-icon__eye" className="yoast-snippet-preview">
				<p className="screen-reader-text">{previewDescription}</p>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{titleLabel}</span>
                    <span className="yoast-snippet-preview__title">{this.props.title}</span>
				</div>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{urlLabel}</span>
					<span className="yoast-snippet-preview__url">{this.props.url}</span>
				</div>

				<div className="yoast-snippet-preview__field">
					<span className="screen-reader-text">{metaDescriptionLabel}</span>
					{ this.renderDate() }
					<span className="yoast-snippet-preview__description">{this.props.metaDescription}</span>
				</div>

				{editButton}
			</Section>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{editText: string, metaDescriptionLabel: string, previewDescription: string, previewTitle: string, titleLabel: string, urlLabel: string, date: string, metaDescription: string, title: string, url: string}}
 */
SearchResultPreview.propTypes = {
	editText:React.PropTypes.string,
	metaDescriptionLabel: React.PropTypes.string,
	previewDescription: React.PropTypes.string,
	previewTitle: React.PropTypes.string,
	titleLabel: React.PropTypes.string,
	urlLabel: React.PropTypes.string,

	date: React.PropTypes.string,
	metaDescription: React.PropTypes.string,
	title: React.PropTypes.string,
	url: React.PropTypes.string,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{editText: string, metaDescriptionLabel: string, previewDescription: string, previewTitle: string, titleLabel: string, urlLabel: string, date: string, metaDescription: string, title: string, url: string}}
 */
SearchResultPreview.defaultProps = {
	editText: "Edit",
	metaDescriptionLabel: "",
	previewDescription: "Description",
	previewTitle: "Title",
	titleLabel: "",
	urlLabel: "",

	date: "",
	metaDescription: "Please provide a meta description",
	title: "Please enter a title...",
	url: "example.com",
};

export default SearchResultPreview;

