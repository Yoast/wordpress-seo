import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";
import { SimpleIntegration } from "./simple-integration";

// Flag to check if the Schema Framework is enabled.
// eslint-disable-next-line dot-notation
const isSchemaFrameworkEnabled = Boolean( window.wpseoIntegrationsData[ "schema_framework_enabled" ] );

/**
 * Represents an integration.
 *
 * @param {Object} integration The integration.
 * @param {boolean} [isActive=true] The integration state.
 * @param {boolean} [isSchemaAPIIntegration=false] Whether this is a Schema API integration.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const PluginIntegration = ( { integration, isActive = true, isSchemaAPIIntegration = false } ) => {
	const isSchemaFrameworkDisabled = isSchemaAPIIntegration && ! isSchemaFrameworkEnabled;

	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ isSchemaFrameworkDisabled && <Fragment>
				<span className="yst-text-red-600 yst-font-medium">{ __( "Schema Framework disabled", "wordpress-seo" ) }</span>
			</Fragment> }
			{ ! isSchemaFrameworkDisabled && isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ ! isSchemaFrameworkDisabled && ! isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">
					{
						__( "Plugin not detected", "wordpress-seo" )
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
				/>
			</Fragment> }
		</SimpleIntegration>
	);
};

PluginIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.node,
		slug: PropTypes.string,
		description: PropTypes.string,
		usps: PropTypes.array,
		logo: PropTypes.func,
		isNew: PropTypes.bool,
	} ).isRequired,
	isActive: PropTypes.bool,
	isSchemaAPIIntegration: PropTypes.bool,
};
