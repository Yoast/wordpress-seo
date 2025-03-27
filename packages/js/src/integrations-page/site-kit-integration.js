/* eslint-disable complexity */
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
import classNames from "classnames";
import { values } from "lodash";
import { STEP_NAME } from "../dashboard/widgets/site-kit-setup-widget";

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
	learnMoreLink: "https://yoa.st/integrations-about-site-kit",
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
 * The wrapper for content with bottom border.
 *
 * @param {JSX.Element} children The children.
 * @param {string} className The class name.
 * @returns {JSX.Element} The top footer wrapper.
 */
const ContentWithBottomDivider = ( { children, className = "" } ) => {
	return <span className={ classNames( "yst-pb-4 yst-border-b yst-mb-6 yst-border-slate-200 yst--mt-2", className ) }>
		{ children }
	</span>;
};

ContentWithBottomDivider.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * The successfully connected component.
 *
 * @returns {JSX.Element} The SuccessfullyConnected component.
 */
const SuccessfullyConnected = () => {
	return <ContentWithBottomDivider className="yst-text-slate-700 yst-font-medium yst-flex yst-justify-between">
		{ __( "Successfully connected", "wordpress-seo" ) }
		<CheckIcon
			className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
		/>
	</ContentWithBottomDivider>;
};

/**
 * Status info component.
 *
 * @param {CapabilitiesForSiteKit} capabilities The capabilities.
 * @param {number} currentStep The current step.
 * @param {boolean} successfullyConnected Whether the connection was successful.
 * @param {boolean} isVersionSupported Whether the version is supported.
 *
 * @returns {JSX.Element} The status info component.
 */
const StatusInfo = ( { capabilities, currentStep, successfullyConnected, isVersionSupported } ) => {
	const warningClass = "yst-text-slate-500 yst-italic";
	if ( ! capabilities.installPlugins && currentStep < STEP_NAME.grantConsent && currentStep !== STEP_NAME.successfullyConnected ) {
		return <ContentWithBottomDivider className={ warningClass }>
			{ __( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin.", "wordpress-seo" ) }
		</ContentWithBottomDivider>;
	}

	if ( ! capabilities.viewSearchConsoleData && ( currentStep === STEP_NAME.grantConsent || currentStep === STEP_NAME.successfullyConnected ) ) {
		return <ContentWithBottomDivider className={ warningClass }>
			{ __( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up.", "wordpress-seo" ) }
		</ContentWithBottomDivider>;
	}

	if ( ! isVersionSupported ) {
		return <ContentWithBottomDivider className={ warningClass }>
			{ sprintf(
			/* translators: %s for Yoast SEO. */
				__( "Update Site Kit by Google to the latest version to connect %s.", "wordpress-seo" ),
				"Yoast SEO"
			) }
		</ContentWithBottomDivider>;
	}

	if ( successfullyConnected && capabilities.viewSearchConsoleData ) {
		return <SuccessfullyConnected />;
	}
};

StatusInfo.propTypes = {
	capabilities: PropTypes.objectOf( PropTypes.bool ).isRequired,
	currentStep: PropTypes.number.isRequired,
	successfullyConnected: PropTypes.bool.isRequired,
	isVersionSupported: PropTypes.bool.isRequired,
};

/**
 * The Site Kit integration component.
 *
 * @param {import("../dashboard/index").SiteKitConnectionStepsStatuses} connectionStepsStatuses The Site Kit configuration.
 * @param {string} installUrl The installation url.
 * @param {string} activateUrl The activation url.
 * @param {string} setupUrl The setup url.
 * @param {string} updateUrl The update url.
 * @param {string} consentManagementUrl The consent management url.
 * @param {import("../dashboard/index").CapabilitiesForSiteKit} capabilities The user capabilities.
 * @param {boolean} isVersionSupported Whether the version is supported.
 *
 * @returns {WPElement} The Site Kit integration component.
 */
export const SiteKitIntegration = ( {
	installUrl,
	activateUrl,
	setupUrl,
	updateUrl,
	consentManagementUrl,
	capabilities,
	connectionStepsStatuses,
	isVersionSupported,
} ) => {
	const [ isModalOpen, toggleModal ] = useToggleState( false );
	const [ isDisconnectModalOpen, toggleDisconnectModal ] = useToggleState( false );
	const [ isConsentGranted, setConnected ] = useState( connectionStepsStatuses.isConsentGranted );
	const stepsStatuses = values( { ...connectionStepsStatuses, isConsentGranted } );
	const currentStep = stepsStatuses.findIndex( status => ! status );
	const successfullyConnected = currentStep === STEP_NAME.successfullyConnected;

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

	const buttonProps = [
		{
			children: __( "Install Site Kit by Google", "wordpress-seo" ),
			href: capabilities.installPlugins ? installUrl : null,
			as: "a",
			disabled: ! capabilities.installPlugins,
			"aria-disabled": ! capabilities.installPlugins,
		},
		{
			children: __( "Activate Site Kit by Google", "wordpress-seo" ),
			href: capabilities.installPlugins ? activateUrl : null,
			as: "a",
			disabled: ! capabilities.installPlugins,
			"aria-disabled": ! capabilities.installPlugins,
		},
		{
			children: __( "Set up Site Kit by Google", "wordpress-seo" ),
			href: capabilities.installPlugins ? setupUrl : null,
			as: "a",
			disabled: ! capabilities.installPlugins,
			"aria-disabled": ! capabilities.installPlugins,
		},
		{
			children: __( "Connect Site Kit by Google", "wordpress-seo" ),
			onClick: toggleModal,
			disabled: ! capabilities.viewSearchConsoleData,
		},
	];

	const getButtonProps = useCallback( ( step ) => {
		if ( ! isVersionSupported ) {
			return {
				children: __( "Update Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: updateUrl,
			};
		}
		if ( step === STEP_NAME.successfullyConnected ) {
			return {
				children: __( "Disconnect", "wordpress-seo" ),
				variant: "secondary",
				disabled: ! capabilities.viewSearchConsoleData,
				onClick: toggleDisconnectModal,
			};
		}
		return buttonProps[ step ];
	}, [ capabilities ] );


	return (
		<>
			<SimpleIntegration
				integration={ integration }
				isActive={ successfullyConnected }
			>
				<span className="yst-flex yst-flex-col yst-flex-1">
					<StatusInfo
						capabilities={ capabilities }
						currentStep={ currentStep }
						successfullyConnected={ successfullyConnected }
						isVersionSupported={ isVersionSupported }
					/>

					<Button
						className="yst-w-full"
						id="site-kit-integration__button"
						{ ...getButtonProps( currentStep ) }
					/>

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
	installUrl: PropTypes.string.isRequired,
	activateUrl: PropTypes.string.isRequired,
	setupUrl: PropTypes.string.isRequired,
	updateUrl: PropTypes.string.isRequired,
	consentManagementUrl: PropTypes.string.isRequired,
	capabilities: PropTypes.objectOf( PropTypes.bool ).isRequired,
	connectionStepsStatuses: PropTypes.objectOf( PropTypes.bool ).isRequired,
	isVersionSupported: PropTypes.bool.isRequired,
};
