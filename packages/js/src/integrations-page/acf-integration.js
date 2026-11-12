/* eslint-disable complexity */
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents the ACF logo.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
const AcfLogo = ( props ) => {
	return (
		<img
			src={ window.wpseoIntegrationsData.plugin_url + "/images/acf-logo.svg" }
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
 * @param {Object} props Component props.
 * @param {Object} props.integration The integration.
 * @param {string} [props.integration.name] The integration name.
 * @param {import("react").ReactNode} [props.integration.claim] The integration claim, shown as the card heading.
 * @param {string} [props.integration.slug] The integration slug.
 * @param {string} [props.integration.description] The integration description.
 * @param {Array} [props.integration.usps] The unique selling points of the integration.
 * @param {Function} [props.integration.logo] The logo component.
 * @param {boolean} [props.integration.isNew] Whether to show the "New" badge.
 * @param {boolean} [props.isActive=true] The integration state.
 * @param {boolean} [props.isInstalled=true] The integration state.
 * @param {boolean} props.isPrerequisiteActive Whether the plugin to which we want to integrate is active.
 * @param {string} props.installationLink The URL to install ACF Content Analysis for Yoast SEO.
 * @param {string} props.activationLink The URL to activate ACF Content Analysis for Yoast SEO.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const AcfIntegration = ( {
	integration,
	isActive = true,
	isInstalled = true,
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
