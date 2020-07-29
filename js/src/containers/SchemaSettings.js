import { __ } from "@wordpress/i18n";
import map from "lodash/map";
import PropTypes from "prop-types";
import SchemaSettingsPortal from "../components/portals/SchemaSettingsPortal";

/**
 * Appends ' (default)' to the name of the default option.
 *
 * @param {Object[]} schemaTypeOptions The schema type options.
 * @param {string} defaultType The default value to change the name for.
 *
 * @returns {Object[]} A copy of the schema type options.
 */
const addDefaultToOptionName = ( schemaTypeOptions, defaultType ) => {
	const defaultString = __( "default", "wordpress-seo" );

	// Clone the schema type options, but with the new name for the default.
	const options = schemaTypeOptions.map( option => {
		if ( option.value !== defaultType ) {
			return { ...option };
		}

		return {
			value: option.value,
			name: `${ option.name } (${ defaultString })`,
		};
	} );

	return options;
};

/**
 * Renders the schema settings.
 *
 * @param {Object} props The component props.
 *
 * @returns {wp.Element[]} Array of portals to instances of the schema settings.
 */
const SchemaSettings = ( props ) => {
	return map( props.targets, ( targetElement ) => {
		const postType = targetElement.getAttribute( "data-schema-settings-post-type" );
		const pageTypeDefault = targetElement.getAttribute( "data-schema-settings-page-type-default" );
		const articleTypeDefault = targetElement.getAttribute( "data-schema-settings-article-type-default" );
		const pageTypeOptions = addDefaultToOptionName( window.wpseoScriptData.searchAppearance.schema.pageTypeOptions, pageTypeDefault );
		const articleTypeOptions = addDefaultToOptionName( window.wpseoScriptData.searchAppearance.schema.articleTypeOptions, articleTypeDefault );

		return (
			<SchemaSettingsPortal
				key={ postType }
				target={ targetElement }
				postType={ postType }
				postTypeName={ targetElement.getAttribute( "data-schema-settings-post-type-name" ) }
				pageTypeFieldId={ targetElement.getAttribute( "data-schema-settings-page-type-field-id" ) }
				articleTypeFieldId={ targetElement.getAttribute( "data-schema-settings-article-type-field-id" ) }
				pageTypeOptions={ pageTypeOptions }
				articleTypeOptions={ articleTypeOptions }
			/>
		);
	} );
};

SchemaSettings.propTypes = {
	targets: PropTypes.object.isRequired,
};

export default SchemaSettings;
