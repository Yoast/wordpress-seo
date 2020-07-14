import { Component, Fragment } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Alert, HelpIcon, Select } from "@yoast/components";
import PropTypes from "prop-types";
import linkHiddenFields, { linkFieldsShape } from "./higherorder/linkHiddenField";
import { schemaArticleTypeOptions, schemaPageTypeOptions } from "./SchemaOptions";

/**
 * Appends ' (default)' to the name of the default option.
 *
 * @param {Object[]} schemaTypeOptions The schema type options.
 * @param {string} defaultType The default value to change the name for.
 *
 * @returns {Object[]} A copy of the schema type options.
 */
const addDefaultToOptionName = ( schemaTypeOptions, defaultType ) => {
	const options = [];

	// Clone the schema type options, but with the new name for the default.
	schemaTypeOptions.forEach( ( option, index ) => {
		options.push( {
			value: option.value,
			name: option.name,
		} );

		if ( option.value === defaultType ) {
			options[ index ].name += ` (${ __( "default", "wordpress-seo" ) })`;
		}
	} );

	return options;
};

/**
 * Returns the content of the schema settings.
 *
 * @param {Object} props Component props.
 *
 * @returns {wp.Element} The schema settings content.
 */
class SchemaSettings extends Component {
	/**
	 * Constructs the component.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		// Save the initial value for the alert check.
		this.initialPageType = props.pageType.value;
		this.initialArticleType = props.articleType ? props.articleType.value : "none";

		// Adjust the default names. Only need to do this once, not supporting the prop change for simplicity.
		this.pageTypeOptions = addDefaultToOptionName( schemaPageTypeOptions, this.props.pageTypeDefault );
		this.articleTypeOptions = addDefaultToOptionName( schemaArticleTypeOptions, this.props.articleTypeDefault );
	}

	/**
	 * Determines whether to show the alert or not.
	 *
	 * @returns {boolean} True if a value differs from the initial value.
	 */
	shouldShowAlert() {
		if ( this.props.pageType && this.props.pageType.value !== this.initialPageType ) {
			return true;
		}

		if ( this.props.articleType && this.props.articleType.value !== this.initialArticleType ) {
			return true;
		}

		return false;
	}

	/**
	 * Renders the component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				<div className="yoast-field-group__title">
					<b>{ __( "Schema settings", "wordpress-seo" ) }</b>
					<HelpIcon
						linkTo="https://yoa.st/404"
						linkText={ __( "Learn more about the schema settings", "wordpress-seo" ) }
					/>
				</div>
				<p>
					{ sprintf(
						/* translators: %1$s expands to an indexable object's name, e.g. Posts or Pages. */
						__(
							"Choose how your %1$s should be described by default in your site's schema.org markup. " +
							"You can change these settings for individual %1$s.",
							"wordpress-seo"
						),
						this.props.postTypeName,
					) }
				</p>
				{ this.shouldShowAlert() && <Alert type="warning">
					{ sprintf(
						/* translators: %1$s expands to an indexable object's name, e.g. Posts or Pages. */
						_n(
							"Upon saving, this setting will apply to all of your %1$s. %1$s that are manually configured will be left untouched.",
							"Upon saving, these settings will apply to all of your %1$s. %1$s that are manually configured will be left untouched.",
							this.props.articleType ? 2 : 1,
							"wordpress-seo",
						),
						this.props.postTypeName,
					) }
				</Alert> }
				<Select
					id={ `schema-page-type-${ this.props.postType }` }
					name="schema_page_type"
					options={ this.pageTypeOptions }
					label={ __( "Default Page type", "wordpress-seo" ) }
					onChange={ this.props.pageType.onChange }
					selected={ this.props.pageType.value }
				/>
				{ this.props.articleType && <Select
					id={ `schema-article-type-${ this.props.postType }` }
					name="schema_article_type"
					options={ this.articleTypeOptions }
					label={ __( "Default Article type", "wordpress-seo" ) }
					onChange={ this.props.articleType.onChange }
					selected={ this.props.articleType.value }
				/> }
			</Fragment>
		);
	}
}

SchemaSettings.propTypes = {
	postType: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	pageType: linkFieldsShape.isRequired,
	articleType: linkFieldsShape,
	pageTypeDefault: PropTypes.string,
	articleTypeDefault: PropTypes.string,
};

SchemaSettings.defaultProps = {
	articleType: {
		value: "none",
		onChange: () => {},
	},
	pageTypeDefault: "web-page",
	articleTypeDefault: "none",
};

export default linkHiddenFields( props => {
	return [
		{
			name: "pageType",
			fieldId: props.pageTypeFieldId,
		},
		{
			name: "articleType",
			fieldId: props.articleTypeFieldId,
		},
	];
} )( SchemaSettings );
