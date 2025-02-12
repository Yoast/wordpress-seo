import { CheckIcon } from "@heroicons/react/solid";
import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as SiteKitLogo } from "../../images/site-kit-logo.svg";
import { SiteKitConsentModal, UnsavedChangesModal as DisconnectModal } from "../shared-admin/components";
import { SimpleIntegration } from "./simple-integration";

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
 * @param {import("@wordpress/api-fetch").APIFetchOptions} options The request options.
 * @returns {Promise<any|Error>} The promise of a result, or an error.
 */
const fetchJson = async( options ) => {
	try {
		const response = await apiFetch( {
			...options,
			parse: false,
		} );
		if ( ! response.ok ) {
			throw new Error( "not ok" );
		}
		return response.json();
	} catch ( e ) {
		return Promise.reject( e );
	}
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
 * @param {boolean} isSetupCompleted Whether the integration has been set up.
 * @param {boolean} isInstalled Whether the integration is installed.
 * @param {boolean} initialIsConnected Whether the integration is connected.
 * @param {string} installUrl The installation url.
 * @param {string} activateUrl The activation url.
 * @param {string} setupUrl The setup url.
 * @param {string} consentManagementUrl The consent management url.
 *
 * @returns {WPElement} The Site Kit integration component.
 */
export const SiteKitIntegration = ( {
	isActive,
	isSetupCompleted,
	isInstalled,
	initialIsConnected,
	installUrl,
	activateUrl,
	setupUrl,
	consentManagementUrl,
} ) => {
	const [ isModalOpen, toggleModal ] = useToggleState( false );
	const [ isDisconnectModalOpen, toggleDisconnectModal ] = useToggleState( false );
	const [ isConnected, setConnected ] = useState( initialIsConnected );
	const stepsStatuses = [ isInstalled, isActive, isSetupCompleted, isConnected ];
	let currentStep = stepsStatuses.findIndex( status => ! status );
	const successfullyConnected = currentStep === -1;

	const consentLearnMoreLink = useSelect(
		select => select( "yoast-seo/settings" ).selectLink( "https://yoa.st/integrations-site-kit-consent-learn-more" ),
		[]
	);

	const manageConsent = useCallback( ( consent ) => {
		return fetchJson( {
			url: consentManagementUrl,
			data: { consent: String( consent ) },
			method: "POST",
		} ).then( ( { success } ) => {
			if ( success ) {
				setConnected( consent );
			}
		} );
	}, [ consentManagementUrl, setConnected ] );
	const grantConsent = useCallback( () => {
		manageConsent( true ).then( toggleModal );
	}, [ manageConsent, toggleModal ] );
	const revokeConsent = useCallback( () => {
		manageConsent( false ).then( toggleDisconnectModal );
	}, [ manageConsent, toggleDisconnectModal ] );

	if ( currentStep === -1 ) {
		currentStep = stepsStatuses.length - 1;
	}

	const buttonProps = [
		{
			children: __( "Install Site Kit by Google", "wordpress-seo" ),
			href: installUrl,
			as: "a",
		},
		{
			children: __( "Activate Site Kit by Google", "wordpress-seo" ),
			href: activateUrl,
			as: "a",
		},
		{
			children: __( "Set up Site Kit by Google", "wordpress-seo" ),
			href: setupUrl,
			as: "a",
		},
		{
			children: __( "Connect Site Kit by Google", "wordpress-seo" ),
			onClick: toggleModal,
		},
	];

	return (
		<>
			<SimpleIntegration
				integration={ integration }
				isActive={ successfullyConnected }
			>
				<span className="yst-flex yst-flex-col yst-flex-1">
					{ successfullyConnected ? <>
						<SuccessfullyConnected />
						<Button className="yst-w-full" id="site-kit-integration__button" variant="secondary" onClick={ toggleDisconnectModal }>
							{ __( "Disconnect", "wordpress-seo" ) }
						</Button>
					</> : <Button className="yst-w-full" id="site-kit-integration__button" { ...buttonProps[ currentStep ] } /> }

				</span>
			</SimpleIntegration>

			<DisconnectModal
				isOpen={ isDisconnectModalOpen }
				onClose={ toggleDisconnectModal }
				onDiscard={ revokeConsent }
				title={ __( "Are you sure?", "wordpress-seo" ) }
				description={ __( "By disconnecting, you will revoke your consent for Yoast to access your Site Kit data, meaning we can no longer show insights from Site Kit by Google on your dashboard. Do you want to proceed?", "wordpress-seo" ) }
				dismissLabel={ __( "No, stay connected", "wordpress-seo" ) }
				discardLabel={ __( "Yes, disconnect", "wordpress-seo" ) }
			/>

			<SiteKitConsentModal
				isOpen={ isModalOpen }
				onClose={ toggleModal }
				onGrantConsent={ grantConsent }
				learnMoreLink={ consentLearnMoreLink }
			/>
		</>
	);
};

SiteKitIntegration.propTypes = {
	isActive: PropTypes.bool.isRequired,
	isSetupCompleted: PropTypes.bool.isRequired,
	isInstalled: PropTypes.bool.isRequired,
	initialIsConnected: PropTypes.bool.isRequired,
	installUrl: PropTypes.string.isRequired,
	activateUrl: PropTypes.string.isRequired,
	setupUrl: PropTypes.string.isRequired,
	consentManagementUrl: PropTypes.string.isRequired,
};
