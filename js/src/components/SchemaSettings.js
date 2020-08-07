import { Component, Fragment } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Alert, Select, FieldGroup } from "@yoast/components";
import PropTypes from "prop-types";
import linkHiddenFields, { linkFieldsShape } from "./higherorder/linkHiddenField";

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
				<FieldGroup
					label={ __( "Schema settings", "wordpress-seo" ) }
					linkTo="https://yoa.st/404"
					linkText={ __( "Learn more about the schema settings", "wordpress-seo" ) }
					description={ sprintf(
						/* translators: %1$s expands to an indexable object's name, e.g. Posts or Pages. */
						__(
							"Choose how your %1$s should be described by default in your site's schema.org markup. " +
							"You can change these settings for individual %1$s.",
							"wordpress-seo"
						),
						this.props.postTypeName,
					) }
				/>
				{ this.shouldShowAlert() && <Alert type="warning">
					{ sprintf(
						/* translators: %1$s expands to an indexable object's name, e.g. Posts or Pages. */
						_n(
							"Upon saving, this setting will apply to all of your %1$s. %1$s that are manually configured will be left untouched.",
							"Upon saving, these settings will apply to all of your %1$s." +
							" %1$s that are manually configured will be left untouched.",
							this.props.articleType ? 2 : 1,
							"wordpress-seo",
						),
						this.props.postTypeName,
					) }
				</Alert> }
				<Select
					id={ `schema-page-type-${ this.props.postType }` }
					name="schema_page_type"
					options={ this.props.pageTypeOptions }
					label={ __( "Default Page type", "wordpress-seo" ) }
					onChange={ this.props.pageType.onChange }
					selected={ this.props.pageType.value }
				/>
				{ this.props.articleType && <Select
					id={ `schema-article-type-${ this.props.postType }` }
					name="schema_article_type"
					options={ this.props.articleTypeOptions }
					label={ __( "Default Article type", "wordpress-seo" ) }
					onChange={ this.props.articleType.onChange }
					selected={ this.props.articleType.value }
				/> }
			</Fragment>
		);
	}
}

export const schemaTypeOptionsPropType = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string,
	value: PropTypes.string,
} ) );

SchemaSettings.propTypes = {
	postType: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	pageType: linkFieldsShape.isRequired,
	articleType: linkFieldsShape,
	pageTypeOptions: schemaTypeOptionsPropType.isRequired,
	articleTypeOptions: schemaTypeOptionsPropType.isRequired,
};

SchemaSettings.defaultProps = {
	articleType: null,
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
