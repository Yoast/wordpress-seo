import PropTypes from "prop-types";
import SchemaSettings, { schemaTypeOptionsPropType } from "../SchemaSettings";
import Portal from "./Portal";

/**
 * Renders a portal for the schema settings.
 *
 * @param {Object} target The target element or element ID in which to render the portal.
 * @param {string} postType The post type.
 * @param {string} postTypeName The post type name.
 * @param {string} pageTypeFieldId The ID of the page type field.
 * @param {string} articleTypeFieldId The ID of the article type field.
 * @param {string} pageTypeOptions The page type options.
 * @param {string} articleTypeOptions The article type options.
 *
 * @returns {null|wp.Element} The schema settings.
 */
export default function SchemaSettingsPortal( {
	target,
	postType,
	postTypeName,
	pageTypeFieldId,
	articleTypeFieldId,
	pageTypeOptions,
	articleTypeOptions,
} ) {
	return (
		<Portal target={ target }>
			<SchemaSettings
				postType={ postType }
				postTypeName={ postTypeName }
				pageTypeFieldId={ pageTypeFieldId }
				articleTypeFieldId={ articleTypeFieldId }
				pageTypeOptions={ pageTypeOptions }
				articleTypeOptions={ articleTypeOptions }
			/>
		</Portal>
	);
}

SchemaSettingsPortal.propTypes = {
	target: PropTypes.object.isRequired,
	postType: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	pageTypeFieldId: PropTypes.string.isRequired,
	articleTypeFieldId: PropTypes.string,
	pageTypeOptions: schemaTypeOptionsPropType.isRequired,
	articleTypeOptions: schemaTypeOptionsPropType.isRequired,
};

SchemaSettingsPortal.defaultProps = {
	articleTypeFieldId: "",
};
