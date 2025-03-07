
import { ArrowRightIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, DropdownMenu, Paper, Stepper, Title, useToggleState, Alert } from "@yoast/ui-library";
import { noop } from "lodash";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { SiteKitConsentModal } from "../../shared-admin/components";

/**
 * @type {import("../index").SiteKitConfiguration} SiteKitConfiguration
 * @type {import("../services/data-provider").DataProvider} DataProvider
 * @type {import("../services/remote-data-provider").RemoteDataProvider} RemoteDataProvider
 * @type {import("../index").Capabilities} Capabilities
 */

/** @type {string[]} */
const steps = [
	__( "INSTALL", "wordpress-seo" ),
	__( "ACTIVATE", "wordpress-seo" ),
	__( "SET UP", "wordpress-seo" ),
	__( "CONNECT", "wordpress-seo" ),
];

/**
 * @typedef {Object} UseSiteKitConfiguration
 * @property {function(RequestInit?)} grantConsent The grant consent function.
 * @property {function(RequestInit?)} dismissPermanently The dismiss permanently function.
 */

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @returns {UseSiteKitConfiguration} The site kit helper methods.
 */
const useSiteKitConfiguration = ( dataProvider, remoteDataProvider ) => {
	const grantConsent = useCallback( ( options ) => {
		remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "siteKitConsentManagement" ),
			{ consent: String( true ) },
			{ ...options, method: "POST" }
		).then( ( { success } ) => {
			if ( success ) {
				dataProvider.setSiteKitConsentGranted( true );
			}
		} ).catch( noop );
	}, [ dataProvider, remoteDataProvider ] );

	const dismissPermanently = useCallback( ( options ) => {
		remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "siteKitConfigurationDismissal" ),
			// eslint-disable-next-line camelcase
			{ is_dismissed: String( true ) },
			{ ...options, method: "POST" }
		).catch( noop );
		// There is no point in waiting for the response, just remove the widget.
		dataProvider.setSiteKitConfigurationDismissed( true );
	}, [ remoteDataProvider, dataProvider ] );

	return { grantConsent, dismissPermanently };
};

/**
 * The no permission warning component.
 *
 * @param {Capabilities} capabilities The capabilities.
 * @param {number} currentStep The current step.
 *
 * @returns {JSX.Element} The no permission warning component.
 */
const NoPermissionWarning = ( { capabilities, currentStep } ) => {
	if ( currentStep === -1 ) {
		return null;
	}

	if ( ! capabilities.installPlugins && currentStep < 3 ) {
		return <Alert className="yst-mt-6" type="info">
			{  __( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin.", "wordpress-seo" ) }
		</Alert>;
	}

	if ( ! capabilities.viewSearchConsoleData && currentStep === 3 ) {
		return <Alert className="yst-mt-6" type="info">
			{ __( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up.", "wordpress-seo" ) }
		</Alert>;
	}
};

/**
 * The google site kit connection guide widget.
 *
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 *
 * @returns {JSX.Element} The widget.
 */
export const SiteKitSetupWidget = ( { dataProvider, remoteDataProvider } ) => {
	const handleOnRemove = useCallback( () => {
		dataProvider.setSiteKitConfigurationDismissed( true );
	}, [ dataProvider ] );

	const { grantConsent, dismissPermanently } = useSiteKitConfiguration( dataProvider, remoteDataProvider );
	const [ isConsentModalOpen, , , openConsentModal, closeConsentModal ] = useToggleState( false );

	const siteKitConfiguration = dataProvider.getSiteKitConfiguration();
	const capabilities = siteKitConfiguration.capabilities;

	const handleRemovePermanently = useCallback( () => {
		dismissPermanently();
	}, [ dismissPermanently ] );

	const learnMoreLink = dataProvider.getLink( "siteKitLearnMore" );
	const consentLearnMoreLink = dataProvider.getLink( "siteKitConsentLearnMore" );


	let currentStep = dataProvider.getSiteKitCurrentConnectionStep();
	const isSiteKitConnectionCompleted = dataProvider.isSiteKitConnectionCompleted();
	if ( isSiteKitConnectionCompleted ) {
		currentStep = steps.length - 1;
	}

	const checkCapability = ( url, capability = capabilities.installPlugins ) => {
		return capability ? url : null;
	};

	const buttonProps = [
		{
			children: __( "Install Site Kit by Google", "wordpress-seo" ),
			href: checkCapability( siteKitConfiguration.installUrl ),
			as: "a",
			disabled: ! capabilities.installPlugins,
		},
		{
			children: __( "Activate Site Kit by Google", "wordpress-seo" ),
			href: checkCapability( siteKitConfiguration.activateUrl ),
			as: "a",
			disabled: ! capabilities.installPlugins,
		},
		{
			children: __( "Set up Site Kit by Google", "wordpress-seo" ),
			href: checkCapability( siteKitConfiguration.setupUrl ),
			as: "a",
			disabled: ! capabilities.installPlugins,
		},
		{
			children: __( "Connect Site Kit by Google", "wordpress-seo" ),
			disabled: ! capabilities.viewSearchConsoleData,
			onClick: openConsentModal,
		},
	];

	return <Paper className="yst-grow xl:yst-col-span-2 yst-col-span-4 yst-p-8 yst-shadow-md yst-relative">
		<DropdownMenu as="span" className="yst-absolute yst-top-4 yst-end-4">
			<DropdownMenu.IconTrigger
				screenReaderTriggerLabel={ __( "Open Site Kit widget dropdown menu", "wordpress-seo" ) }
				className="yst-float-end"
			/>
			<DropdownMenu.List className="yst-mt-8 yst-w-56">
				<DropdownMenu.ButtonItem
					className="yst-text-slate-600 yst-border-b yst-border-slate-200 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4 yst-font-normal"
					onClick={ handleOnRemove }
				>
					<XIcon className="yst-w-4 yst-text-slate-400" />
					{ __( "Remove until next visit", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
				<DropdownMenu.ButtonItem
					className="yst-text-red-500 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4 yst-font-normal"
					onClick={ handleRemovePermanently }
				>
					<TrashIcon className="yst-w-4" />
					{ __( "Remove permanently", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
			</DropdownMenu.List>
		</DropdownMenu>
		<div className="yst-flex yst-justify-center yst-mb-6 yst-mt-4"><YoastConnectSiteKit width="252" height="60" /></div>
		<Stepper steps={ steps } currentStep={ currentStep }>
			{ steps.map( ( label, index ) => (
				<Stepper.Step
					key={ label }
					isActive={ currentStep === index }
					isComplete={ dataProvider.getStepsStatuses()[ index ] }
				>
					{ label }
				</Stepper.Step>
			) ) }
		</Stepper>
		<hr className="yst-bg-slate-200 yst-my-6" />
		<Title size="2">{ __( "Expand your dashboard with insights from Google!", "wordpress-seo" ) }</Title>
		<p className="yst-my-4">
			{ __( "Bring together powerful tools like Google Analytics and Search Console for a complete overview of your website's performance, all in one seamless dashboard.", "wordpress-seo" ) }
		</p>
		<span className="yst-text-slate-800 yst-font-medium">
			{ __( "What you'll get:", "wordpress-seo" ) }
		</span>
		<ul>
			<li className="yst-gap-2 yst-flex yst-mt-2">
				<CheckCircleIcon className="yst-w-5 yst-text-green-400" />
				{ __( "Actionable insights into traffic, SEO, and user behavior to grow your audience.", "wordpress-seo" ) }
			</li>
			<li className="yst-gap-2 yst-flex yst-mt-2">
				<CheckCircleIcon className="yst-w-5 yst-text-green-400" />
				{ __( "Key performance metrics to fine-tune your website and optimize like a pro.", "wordpress-seo" ) }
			</li>
		</ul>

		<NoPermissionWarning capabilities={ capabilities } currentStep={ currentStep } />

		<div className="yst-flex yst-gap-1 yst-mt-6 yst-items-center">
			{ isSiteKitConnectionCompleted
				? <>
					<Button onClick={ handleOnRemove }>
						{ __( "Got it!", "wordpress-seo" ) }
					</Button>
				</>
				: <>
					<Button { ...buttonProps[ currentStep ] } />
					<Button as="a" variant="tertiary" href={ learnMoreLink } className="yst-flex yst-items-center yst-gap-1">
						{ __( "Learn more", "wordpress-seo" ) }
						<ArrowRightIcon className="yst-w-3 yst-text-primary-500 rtl:yst-rotate-180" />
					</Button>
					<SiteKitConsentModal
						isOpen={ currentStep === steps.length - 1 && isConsentModalOpen }
						onClose={ closeConsentModal }
						onGrantConsent={ grantConsent }
						learnMoreLink={ consentLearnMoreLink }
					/>
				</>
			}
		</div>
	</Paper>;
};
