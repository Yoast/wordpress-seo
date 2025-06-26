/* eslint-disable complexity */
import { LockOpenIcon } from "@heroicons/react/outline";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { PropTypes } from "prop-types";
import { SimpleIntegration } from "./simple-integration";

/**
 * @param {Object} integration The integration object.
 * @param {boolean} [isActive=true] Whether the integration is active.
 * @param {boolean} [isInstalled=true] Whether the integration is installed.
 * @param {boolean} [isPrerequisiteActive=true] Whether the prerequisite plugin is active.
 * @param {string} activationLink The URL to activate Yoast WooCommerce SEO.
 * @returns {JSX.Element} A card representing an integration.
 */
export const WoocommerceIntegration = ( {
	integration,
	isActive = true,
	isInstalled = true,
	isPrerequisiteActive = true,
	activationLink,
} ) => {
	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ ! isPrerequisiteActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">
					{
						__( "Plugin not detected", "wordpress-seo" )
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ isPrerequisiteActive && isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
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
					className="yst-w-full yst-text-slate-800 yst-text-center"
				>
					{
						sprintf(
							/* translators: 1: Yoast WooCommerce SEO */
							__( "Activate %s", "wordpress-seo" ),
							"Yoast WooCommerce SEO"
						)
					}
				</Button>
			</Fragment> }
			{ isPrerequisiteActive && ! isActive && ! isInstalled && <Fragment>
				<Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					href={ integration.upsellLink }
					variant="upsell"
					className="yst-w-full yst-text-slate-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{
						sprintf(
							/* translators: 1: Yoast WooCommerce SEO */
							__( "Buy %s", "wordpress-seo" ),
							"Yoast WooCommerce SEO"
						)
					}
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</Fragment> }
		</SimpleIntegration>
	);
};

WoocommerceIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.node,
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
