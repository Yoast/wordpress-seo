import { __, sprintf } from "@wordpress/i18n";
import { CheckIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { SimpleIntegration } from "./simple-integration";
import { ReactComponent as SiteKitLogo } from "../../images/site-kit-logo.svg";
import { Button, useToggleState } from "@yoast/ui-library";
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
	learnMoreLink: "https://yoa.st/google-site-kit-learn-more",
	logoLink: "https://yoa.st/integrations-logo-google-site-kit",
	slug: "google-site-kit",
	description: __( "View traffic and search rankings on your dashboard by connecting your Google account.", "wordpress-seo" ),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: true,
	logo: SiteKitLogo,
};

/**
 * The successfully connected component.
 *
 * @returns {JSX.Element} The SuccessfullyConnected component.
 */
const SuccessfullyConnected = () => {
	return <span className="yst-flex yst-justify-between yst-pb-4 yst-border-b yst-mb-6 yst-border-slate-200 yst--mt-2">
		<span className="yst-text-slate-700 yst-font-medium">
			{ __( "Successfully connected", "wordpress-seo" ) }
		</span>
		<CheckIcon
			className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
		/>
	</span>;
};

/**
 * The Site Kit integration component.
 *
 * @param {boolean} isActive Whether the integration is active.
 * @param {boolean} afterSetup Whether the integration has been set up.
 * @param {boolean} isInstalled Whether the integration is installed.
 * @param {boolean} isConnected Whether the integration is connected.
 * @param {string} installUrl The installation url.
 * @param {string} activateUrl The activation url.
 * @param {string} setupUrl The setup url.
 *
 * @returns {WPElement} The Site Kit integration component.
 */
export const GoogleSiteKitIntegration = ( { isActive, afterSetup, isInstalled, isConnected, installUrl, activateUrl, setupUrl } ) => {
	const [ isModalOpen, toggleModal ] = useToggleState( false );

	const getButtonProps = useCallback( () => {
		if ( ! isInstalled ) {
			return {
				children: __( "Install Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: installUrl,
			};
		}
		if ( ! isActive ) {
			return {
				children: __( "Activate Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: activateUrl,
			};
		}
		if ( ! afterSetup ) {
			return {
				children: __( "Set up Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: setupUrl,
			};
		}
		if ( ! isConnected ) {
			return {
				children: __( "Connect Site Kit by Google", "wordpress-seo" ),
				as: "button",
				onClick: toggleModal,
			};
		}

		return {
			children: __( "Disconnect", "wordpress-seo" ),
			as: "button",
			variant: "secondary",
		};
	}, [ isInstalled, isActive, afterSetup, isConnected, installUrl, activateUrl, toggleModal ] );


	const successfullyConnected = isInstalled && isActive && afterSetup && isConnected;
	return (
		<>
			<SimpleIntegration
				integration={ integration }
				isActive={ successfullyConnected }
			>
				<span className="yst-flex yst-flex-col yst-flex-1">
					{ successfullyConnected && <SuccessfullyConnected  /> }
					<Button className="yst-w-full" id="google-site-kit-button" { ...getButtonProps( isInstalled, isActive, afterSetup, isConnected ) } />
				</span>
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
