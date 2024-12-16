import { __ } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";
import { Fragment } from "@wordpress/element";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents an integration.
 *
 * @param {object}  integration The integration.
 * @param {boolean} isActive    The integration state.
 *
 * @returns {WPElement} A card representing an integration.
 */
export const PluginIntegration = ( { integration, isActive } ) => {
	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ ! isActive && <Fragment>
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
};

PluginIntegration.defaultProps = {
	isActive: true,
};
