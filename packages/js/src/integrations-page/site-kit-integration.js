import { __, sprintf } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, createInterpolateElement, useMemo, useCallback } from "@wordpress/element";
import { SimpleIntegration } from "./simple-integration";
import { ReactComponent as SiteKitLogo } from "../../images/site-kit-logo.svg";
import { get } from "lodash";
import { useToggleState } from "@yoast/ui-library";
import { SiteKitConsentModal } from "../shared-admin/components";

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
	description: __( "View traffic and search rankings on your dashboard by connecting your Google account.", "wordpress-seo" ),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: false,
	logo: SiteKitLogo,
};

const buttonLabels = {
	install: sprintf(
		/* translators: 1: Site Kit by Google */
		__( "Install %1$s", "wordpress-seo" ),
		"Site Kit by Google"
	),
	activate: sprintf(
		/* translators: 1: Site Kit by Google */
		__( "Activate %1$s", "wordpress-seo" ),
		"Site Kit by Google"
	),
	setup: sprintf(
		/* translators: 1: Site Kit by Google */
		__( "Set up %1$s", "wordpress-seo" ),
		"Site Kit by Google"
	),
	connect: sprintf(
		/* translators: 1: Site Kit by Google */
		__( "Connect %1$s", "wordpress-seo" ),
		"Site Kit by Google"
	),
	disconnect: __( "Disconnect", "wordpress-seo" ),
};

/**
 * The Site Kit integration component.
 *
 * @returns {WPElement} The Site Kit integration component.
 */
export const SiteKitIntegration = () => {
	const isActive = get( window, "wpseoIntegrationsData.google_site_kit.active", false );
	const afterSetup = get( window, "wpseoIntegrationsData.google_site_kit.setup", false );
	const isInstalled = get( window, "wpseoIntegrationsData.google_site_kit.installed", false );
	const isConnected = get( window, "wpseoIntegrationsData.google_site_kit.connected", false );
	const [ isModalOpen, toggleModal ] = useToggleState( false );

	const getButtonConfig = useCallback( () => {
		const button = {
			className: "yst-mt-6 yst-w-full",
			as: "a",
			id: "google-site-kit-button",
		};

		if ( ! isInstalled ) {
			button.children = buttonLabels.install;
			button.href = "/wp-admin/plugins.php";
		} else if ( ! isActive ) {
			button.children = buttonLabels.activate;
			button.href = "/wp-admin/plugins.php";
		} else if ( ! afterSetup ) {
			button.children = buttonLabels.setup;
			button.href = "/wp-admin/admin.php?page=googlesitekit-splash";
		} else if ( ! isConnected ) {
			button.children = buttonLabels.connect;
			button.onClick = toggleModal;
			button.as = "button";
		} else if ( isConnected ) {
			button.children = buttonLabels.disconnect;
			button.variant = "secondary";
		}

		return button;
	}, [ isInstalled, isActive, afterSetup, isConnected ] );

	const notConnected = useMemo( () => ! isConnected || ! afterSetup, [ isConnected, afterSetup ] );
	const pluginNotDetected = useMemo( () => ! isActive || ! isInstalled, [ isActive, isInstalled ] );
	const successfullyConnected = useMemo( () => isActive && afterSetup && isConnected, [ isActive, afterSetup, isConnected ] );

	return (
		<>
			<SimpleIntegration
				integration={ siteKitIntegration }
				isActive={ isInstalled && isActive  }
				button={ getButtonConfig( isInstalled, isActive, afterSetup, isConnected ) }
			>

				{ successfullyConnected && <Fragment>
					<span className="yst-text-slate-700 yst-font-medium">{ __( "Successfully connected", "wordpress-seo" ) }</span>
					<CheckIcon
						className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
					/>
				</Fragment> }

				{ notConnected && isActive && <Fragment>
					<span className="yst-text-slate-700 yst-font-medium">
						{
							__( "Not connected", "wordpress-seo" )
						}
					</span>
					<XIcon
						className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
					/>
				</Fragment> }

				{ pluginNotDetected && <Fragment>
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
			<SiteKitConsentModal isOpen={ isModalOpen } onClose={ toggleModal } />
		</>
	);
};
