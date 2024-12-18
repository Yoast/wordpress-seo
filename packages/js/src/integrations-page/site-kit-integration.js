import { __, sprintf } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, createInterpolateElement } from "@wordpress/element";
import { SimpleIntegration } from "./simple-integration";
import { ReactComponent as SiteKitLogo } from "../../images/site-kit-logo.svg";
import { get } from "lodash";

const siteKitIntegration = {
	name: "Site Kit by Google",
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: Site Kit by Google; 3: bold close tag. */
			__( "Get valuable insights with %1$s%2$s%3$s", "wordpress-seo" ),
			"<strong>",
			"Site Kit by Google",
			"</strong>"
		), {
			strong: <strong />,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-google-site-kit",
	logoLink: "https://yoa.st/integrations-google-site-kit",
	slug: "google-site-kit",
	description: sprintf(
		/* translators: 1: Wincher */
		__( "View traffic and search rankings on your dashboard by connecting your Google account.", "wordpress-seo" ),
		"Wincher"
	),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: false,
	logo: SiteKitLogo,
};

/**
 * Represents an integration.
 *
 * @param {object}  integration The integration.
 * @param {boolean} isActive    The integration state.
 *
 * @returns {WPElement} A card representing an integration.
 */
export const SiteKitIntegration = () => {
	const isActive = get( window, "wpseoIntegrationsData.google_site_kit_plugin_active", "0" ) === "1";
	const isConnected = get( window, "wpseoIntegrationsData.google_site_kit_connected", "0" ) === "1";

	return (
		<SimpleIntegration
			integration={ siteKitIntegration }
			isActive={ isActive }
		>

			{ isActive && isConnected && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }

			{ ! isConnected && isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">
					{
						__( "Not connected", "wordpress-seo" )
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
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
