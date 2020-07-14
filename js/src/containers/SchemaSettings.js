import map from "lodash/map";
import PropTypes from "prop-types";
import SchemaSettingsPortal from "../components/portals/SchemaSettingsPortal";

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

		return (
			<SchemaSettingsPortal
				key={ postType }
				target={ targetElement }
				postType={ postType }
				postTypeName={ targetElement.getAttribute( "data-schema-settings-post-type-name" ) }
				pageTypeFieldId={ targetElement.getAttribute( "data-schema-settings-page-type-field-id" ) }
				articleTypeFieldId={ targetElement.getAttribute( "data-schema-settings-article-type-field-id" ) }
			/>
		);
	} );
};

SchemaSettings.propTypes = {
	targets: PropTypes.object.isRequired,
};

export default SchemaSettings;
