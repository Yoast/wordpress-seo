/* eslint-disable complexity */
import { Button } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";
import { Fragment } from "@wordpress/element";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents the ACF logo.
 *
 * @param {object}  props The props.
 *
 * @returns {WPElement} A card representing an integration.
 */
const AcfLogo = ( props ) => {
	return (
		<img
			src={ window.wpseoIntegrationsData.plugin_url + "/images/acf-logo.png" }
			height="50"
			width="50"
			alt={
				sprintf(
					/* translators: 1: Yoast SEO, 2: ACF */
					__( "%1$s integrates with %2$s", "wordpress-seo" ),
					"Yoast SEO",
					"ACF"
				)
			}
			{ ...props }
		/>
	);
};

/**
 * Represents an integration.
 *
 * @param {object}  integration          The integration.
 * @param {boolean} isActive             The integration state.
 * @param {boolean} isInstalled          The integration state.
 * @param {boolean} isPrerequisiteActive Whether the plugin to which we want to integrate is active.
 * @param {string}  installationLink     The URL to install ACF Content Analysis for Yoast SEO.
 * @param {string}  activationLink       The URL to activate ACF Content Analysis for Yoast SEO.
 *
 * @returns {WPElement} A card representing an integration.
 */
export const AcfIntegration = ( {
	integration,
	isActive,
	isInstalled,
	isPrerequisiteActive,
	installationLink,
	activationLink,
} ) => {
	integration.logo = AcfLogo;

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
							/* translators: 1: ACF, 2: Yoast SEO */
							__( "Activate %1$s Content Analysis for %2$s", "wordpress-seo" ),
							"ACF",
							"Yoast SEO"
						)
					}
				</Button>
			</Fragment> }
			{ isPrerequisiteActive && ! isActive && ! isInstalled && <Fragment>
				<Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					href={ installationLink }
					variant="secondary"
					className="yst-w-full yst-text-slate-800 yst-text-center"
				>
					{
						sprintf(
							/* translators: 1: ACF, 2: Yoast SEO */
							__( "Install %1$s Content Analysis for %2$s", "wordpress-seo" ),
							"ACF",
							"Yoast SEO"
						)
					}
				</Button>
			</Fragment> }
		</SimpleIntegration>
	);
};
/* eslint-enable complexity */

AcfIntegration.propTypes = {
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
	isInstalled: PropTypes.bool,
	isPrerequisiteActive: PropTypes.bool,
	installationLink: PropTypes.string,
	activationLink: PropTypes.string,
};

AcfIntegration.defaultProps = {
	isActive: true,
	isInstalled: true,
};
