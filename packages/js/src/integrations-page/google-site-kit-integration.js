import { __, sprintf } from "@wordpress/i18n";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { SimpleIntegration } from "./simple-integration";
import { ReactComponent as SiteKitLogo } from "../../images/site-kit-logo.svg";
import { useToggleState } from "@yoast/ui-library";
import { SiteKitConsentModal } from "../shared-admin/components";

const integration = {
	name: __( "Site Kit by Google", "wordpress-seo" ),
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: bold close tag. */
			__( "Get valuable insights with %1$sSite Kit by Google%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		), {
			strong: <strong />,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-google-site-kit-learn-more",
	logoLink: "https://yoa.st/integrations-google-site-kit",
	slug: "google-site-kit",
	description: __( "View traffic and search rankings on your dashboard by connecting your Google account.", "wordpress-seo" ),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: false,
	logo: SiteKitLogo,
};

/**
 * The NotConnected component.
 *
 * @param {boolean} isConnected Whether the integration is connected.
 * @param {boolean} afterSetup Whether the integration has been set up.
 * @param {boolean} isActive Whether the integration is active.
 *
 * @returns {JSX.Element} The NotConnected component.
 */
const NotConnected = ( { isConnected, afterSetup, isActive } ) => {
	return ( ! isConnected || ! afterSetup ) && isActive && <>
		<span className="yst-text-slate-700 yst-font-medium">
			{ __( "Not connected", "wordpress-seo" ) }
		</span>
		<XIcon
			className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
		/>
	</>;
};

NotConnected.propTypes = {
	isConnected: PropTypes.bool.isRequired,
	afterSetup: PropTypes.bool.isRequired,
	isActive: PropTypes.bool.isRequired,
};

/**
 * Plugin not detected.
 *
 * @param {boolean} isActive Whether the integration is active.
 * @param {boolean} isInstalled Whether the integration is installed.
 *
 * @returns {JSX.Element} The PluginNotDetected component.
 */
const PluginNotDetected = ( { isActive, isInstalled } ) => {
	return ( ! isActive || ! isInstalled ) && <>
		<span className="yst-text-slate-700 yst-font-medium">
			{ __( "Plugin not detected", "wordpress-seo" ) }
		</span>
		<XIcon
			className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
		/>
	</>;
};

PluginNotDetected.propTypes = {
	isActive: PropTypes.bool.isRequired,
	isInstalled: PropTypes.bool.isRequired,
};

/**
 * The successfully Connected component.
 *
 * @param {boolean} isActive Whether the integration is active.
 * @param {boolean} afterSetup Whether the integration has been set up.
 * @param {boolean} isConnected Whether the integration is connected.
 *
 * @returns {JSX.Element} The SuccessfullyConnected component.
 */
const SuccessfullyConnected = ( { isActive, afterSetup, isConnected } ) => {
	return isActive && afterSetup && isConnected && <>
		<span className="yst-text-slate-700 yst-font-medium">
			{ __( "Successfully connected", "wordpress-seo" ) }
		</span>
		<CheckIcon
			className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
		/>
	</>;
};

SuccessfullyConnected.propTypes = {
	isActive: PropTypes.bool.isRequired,
	afterSetup: PropTypes.bool.isRequired,
	isConnected: PropTypes.bool.isRequired,
};

/**
 * The Site Kit integration component.
 *
 * @param {boolean} isActive Whether the integration is active.
 * @param {boolean} afterSetup Whether the integration has been set up.
 * @param {boolean} isInstalled Whether the integration is installed.
 * @param {boolean} isConnected Whether the integration is connected.
 * @param {string} installUrl The installation url.
 * @param {string} activateUrl The ctivationUrl.
 * @param {string} setupUrl The setup url.
 *
 * @returns {WPElement} The Site Kit integration component.
 */
export const GoogleSiteKitIntegration = ( { isActive, afterSetup, isInstalled, isConnected, installUrl, activateUrl, setupUrl } ) => {
	const [ isModalOpen, toggleModal ] = useToggleState( false );

	const buttonProps = {
		install: {
			children: __( "Install Site Kit by Google", "wordpress-seo" ),
			as: "a",
			href: installUrl,
		},
		activate: {
			children: __( "Activate Site Kit by Google", "wordpress-seo" ),
			as: "a",
			href: activateUrl,
		},
		setup: {
			children: __( "Set up Site Kit by Google", "wordpress-seo" ),
			as: "a",
			href: setupUrl,
		},
		connect: {
			children: __( "Connect Site Kit by Google", "wordpress-seo" ),
			as: "button",
		},
		disconnect: {
			children: __( "Disconnect", "wordpress-seo" ),
			as: "button",
			variant: "secondary",
		},
	};

	const getButtonProps = useCallback( () => {
		switch ( true ) {
			case ( ! isInstalled ):
				return buttonProps.install;
			case ( ! isActive ):
				return buttonProps.activate;
			case ( ! afterSetup ):
				return buttonProps.setup;
			case ( ! isConnected ):
				return { ...buttonProps.connect, onClick: toggleModal };
			case ( isConnected ):
				return buttonProps.disconnect;
		}
	}, [ isInstalled, isActive, afterSetup, isConnected ] );

	return (
		<>
			<SimpleIntegration
				integration={ integration }
				isActive={ isInstalled && isActive }
				button={ {
					className: "yst-mt-6 yst-w-full",
					id: "google-site-kit-button",
					...getButtonProps( isInstalled, isActive, afterSetup, isConnected ),
				} }
			>
				<SuccessfullyConnected isActive={ isActive } afterSetup={ afterSetup } isConnected={ isConnected } />
				<NotConnected isConnected={ isConnected } afterSetup={ afterSetup } isActive={ isActive } />
				<PluginNotDetected isActive={ isActive } isInstalled={ isInstalled } />
			</SimpleIntegration>
			<SiteKitConsentModal isOpen={ isModalOpen } onClose={ toggleModal } />
		</>
	);
};

GoogleSiteKitIntegration.propTypes = {
	isActive: PropTypes.bool.isRequired,
	afterSetup: PropTypes.bool.isRequired,
	isInstalled: PropTypes.bool.isRequired,
	isConnected: PropTypes.bool.isRequired,
	installUrl: PropTypes.string.isRequired,
	activateUrl: PropTypes.string.isRequired,
	setupUrl: PropTypes.string.isRequired,
};
