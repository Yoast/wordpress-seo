/* eslint-disable complexity */
import { Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Fragment } from "@wordpress/element";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents an integration.
 *
 * @param {object}  integration          The integration.
 * @param {boolean} isActive             Whether the integration state is active.
 * @param {boolean} isInstalled          Whether the integration state is active.
 * @param {boolean} isPrerequisiteActive Whether the plugin to which we want to integrate is active.
 * @param {string}  activationLink       The URL to activate Yoast WooCommerce SEO.
 *
 * @returns {WPElement} A card representing an integration.
 */
export const WoocommerceIntegration = ( {
	integration,
	isActive,
	isInstalled,
	isPrerequisiteActive,
	activationLink,
} ) => {
	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ ! isPrerequisiteActive && <Fragment>
				<span className="yst-text-gray-700 yst-font-medium">
					{
						__( "Plugin not detected", "wordpress-seo" )
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ isPrerequisiteActive && isActive && <Fragment>
				<span className="yst-text-gray-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ isPrerequisiteActive && ! isActive && isInstalled && <Fragment>
				<Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					variant="secondary"
					href={ activationLink }
					className="yst-w-full yst-text-gray-800 yst-text-center"
				>
					{ __( "Activate Yoast WooCommerce SEO", "wordpress-seo" ) }
				</Button>
			</Fragment> }
			{ isPrerequisiteActive && ! isActive && ! isInstalled && <Fragment>
				<Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					href={ integration.upsellLink }
					variant="upsell"
					className="yst-w-full yst-text-gray-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{ __( "Buy Yoast WooCommerce SEO", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</Fragment> }
		</SimpleIntegration>
	);
};
/* eslint-enable complexity */

WoocommerceIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.string,
		type: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
		usps: PropTypes.array,
		logo: PropTypes.func,
		isNew: PropTypes.bool,
		upsellLink: PropTypes.string,
	} ).isRequired,
	isActive: PropTypes.bool,
	isInstalled: PropTypes.bool,
	isPrerequisiteActive: PropTypes.bool,
	activationLink: PropTypes.string.isRequired,
};

WoocommerceIntegration.defaultProps = {
	isActive: true,
	isInstalled: true,
	isPrerequisiteActive: true,
};
