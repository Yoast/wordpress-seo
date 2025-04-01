import { TrashIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, DropdownMenu, Stepper, Title, useToggleState } from "@yoast/ui-library";
import { noop } from "lodash";
import { ReactComponent as YoastConnectSiteKitSuccess } from "../../../images/yoast-connect-google-site-kit-success.svg";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { SiteKitConsentModal } from "../../shared-admin/components";
import { LearnMoreLink } from "../components/learn-more-link";
import { Widget } from "./widget";

/**
 * @type {import("../index").SiteKitConfiguration} SiteKitConfiguration
 * @type {import("../services/data-provider").DataProvider} DataProvider
 * @type {import("../services/remote-data-provider").RemoteDataProvider} RemoteDataProvider
 * @type {import("../index").CapabilitiesForSiteKit} Capabilities for site kit.
 */

/** @type {string[]} */
const steps = [
	__( "INSTALL", "wordpress-seo" ),
	__( "ACTIVATE", "wordpress-seo" ),
	__( "SET UP", "wordpress-seo" ),
	__( "CONNECT", "wordpress-seo" ),
];

/** @type {Object<string, number>} */
export const STEP_NAME = {
	install: 0,
	activate: 1,
	setup: 2,
	grantConsent: 3,
	successfullyConnected: -1,
};

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
 * The site kit setup widget title and description.
 *
 * @param {boolean} isSiteKitConnectionCompleted If the site kit connection is completed.
 *
 * @returns {JSX.Element} The title and description component.
 */
const SiteKitSetupWidgetTitleAndDescription = ( { isSiteKitConnectionCompleted } ) => ( <>
	<Title size="2" className="yst-mb-4">
		{ isSiteKitConnectionCompleted
			? __( "You’ve successfully connected your site with Site Kit by Google!", "wordpress-seo" )
			: __( "Expand your dashboard with insights from Google!", "wordpress-seo" )
		}
	</Title>
	{ ! isSiteKitConnectionCompleted && <p className="yst-mb-4">
		{ __( "Bring together powerful tools like Google Analytics and Search Console for a complete overview of your website's performance, all in one seamless dashboard.", "wordpress-seo" ) }
	</p> }
</> );

/* eslint-disable complexity */
/**
 * The no permission warning component.
 *
 * @param {CapabilitiesForSiteKit} capabilities The capabilities for the site kit.
 * @param {number} currentStep The current step.
 * @param {boolean} isVersionSupported Whether the version is supported.
 * @param {boolean} isConsentGranted Whether the consent is granted.
 *
 * @returns {JSX.Element} The no permission warning component.
 */
const SiteKitAlert = ( { capabilities, currentStep, isVersionSupported, isConsentGranted } ) => {
	const alertClass = "yst-mt-6";

	if ( ! isVersionSupported && ( currentStep > STEP_NAME.install || currentStep === STEP_NAME.successfullyConnected ) ) {
		if ( isConsentGranted ) {
			return <Alert className={ alertClass } variant="error">
				{ __( "Your current version of the Site Kit by Google plugin is no longer compatible with Yoast SEO. Please update to the latest version to restore the connection.", "wordpress-seo" ) }
			</Alert>;
		}

		return <Alert className={ alertClass }>
			{ __( "You are using an outdated version of the Site Kit by Google plugin. Please update to the latest version to connect Yoast SEO with Site Kit by Google.", "wordpress-seo" ) }
		</Alert>;
	}

	if ( currentStep === STEP_NAME.successfullyConnected ) {
		return null;
	}

	if ( ! capabilities.installPlugins && currentStep < STEP_NAME.grantConsent ) {
		return <Alert className={ alertClass }>
			{ __( "Please contact your WordPress admin to install, activate, and set up the Site Kit by Google plugin.", "wordpress-seo" ) }
		</Alert>;
	}

	if ( ! capabilities.viewSearchConsoleData && currentStep === STEP_NAME.grantConsent ) {
		return <Alert className={ alertClass }>
			{ __( "You don’t have view access to Site Kit by Google. Please contact the admin who set it up.", "wordpress-seo" ) }
		</Alert>;
	}
};

/**
 * @param {number} currentStep The current step.
 * @param {SiteKitConfiguration} config The Site Kit configuration.
 * @param {boolean} isConnectionCompleted Whether the Site Kit connection is completed.
 * @param {function} onDismissWidget The callback to dismiss the setup widget.
 * @param {function} onShowConsent The callback to show the grant consent modal / connect Site Kit.
 * @returns {JSX.Element} The element.
 */
const SiteKitSetupAction = ( { currentStep, config, isConnectionCompleted, onDismissWidget, onShowConsent } ) => {
	const getUrl = useCallback( ( url, capability = "installPlugins" ) => config.capabilities?.[ capability ] ? url : null, [ config.capabilities ] );

	if ( ! config.isVersionSupported && ( currentStep > STEP_NAME.install || currentStep === STEP_NAME.successfullyConnected ) ) {
		return <Button as="a" href={ config.updateUrl }>
			{ __( "Update Site Kit by Google", "wordpress-seo" ) }
		</Button>;
	}
	if ( isConnectionCompleted ) {
		return <Button onClick={ onDismissWidget }>
			{ __( "Got it!", "wordpress-seo" ) }
		</Button>;
	}

	switch ( currentStep ) {
		case STEP_NAME.install:
			return <Button
				as="a"
				href={ getUrl( config.installUrl ) }
				disabled={ ! config.capabilities.installPlugins }
				aria-disabled={ ! config.capabilities.installPlugins }
			>
				{ __( "Install Site Kit by Google", "wordpress-seo" ) }
			</Button>;
		case STEP_NAME.activate:
			return <Button
				as="a"
				href={ getUrl( config.activateUrl ) }
				disabled={ ! config.capabilities.installPlugins }
				aria-disabled={ ! config.capabilities.installPlugins }
			>
				{ __( "Activate Site Kit by Google", "wordpress-seo" ) }
			</Button>;
		case STEP_NAME.setup:
			return <Button
				as="a"
				href={ getUrl( config.setupUrl ) }
				disabled={ ! config.capabilities.installPlugins }
				aria-disabled={ ! config.capabilities.installPlugins }
			>
				{ __( "Set up Site Kit by Google", "wordpress-seo" ) }
			</Button>;
		case STEP_NAME.grantConsent:
			return <Button
				disabled={ ! config.capabilities.viewSearchConsoleData }
				onClick={ onShowConsent }
			>
				{ __( "Connect Site Kit by Google", "wordpress-seo" ) }
			</Button>;
	}

	return null;
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

	const handleRemovePermanently = useCallback( () => {
		dismissPermanently();
	}, [ dismissPermanently ] );

	const learnMoreLink = dataProvider.getLink( "siteKitLearnMore" );
	const consentLearnMoreLink = dataProvider.getLink( "siteKitConsentLearnMore" );

	const config = dataProvider.getSiteKitConfiguration();
	const currentStep = dataProvider.getSiteKitCurrentConnectionStep();
	const isConnectionCompleted = dataProvider.isSiteKitConnectionCompleted() && config.isVersionSupported;

	return (
		<Widget className="yst-paper__content yst-relative @3xl:yst-col-span-2 yst-col-span-4">
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
			<div className="yst-flex yst-justify-center yst-mb-6 yst-mt-4">{ isConnectionCompleted
				? <YoastConnectSiteKitSuccess className="yst-aspect-[21/5] yst-max-w-[252px]" />
				: <YoastConnectSiteKit className="yst-aspect-[21/5] yst-max-w-[252px]" />
			}</div>
			{ config.isVersionSupported && <Stepper steps={ steps } currentStep={ currentStep } className="yst-mb-6">
				{ steps.map( ( label, index ) => (
					<Stepper.Step
						key={ label }
						isActive={ currentStep === index }
						isComplete={ currentStep > index || isConnectionCompleted }
					>
						{ label }
					</Stepper.Step>
				) ) }
			</Stepper> }
			<hr className="yst-bg-slate-200 yst-mb-6" />
			<div className="yst-max-w-2xl">
				<SiteKitSetupWidgetTitleAndDescription isSiteKitConnectionCompleted={ isConnectionCompleted } />
				<span className="yst-text-slate-800 yst-font-medium">{ isConnectionCompleted
					? __( "You're all set, here are some benefits:", "wordpress-seo" )
					: __( "Here's what you'll unlock:", "wordpress-seo" )
				}</span>
				<ul>
					<li className="yst-gap-2 yst-flex yst-mt-2 yst-items-start">
						<CheckCircleIcon className="yst-w-5 yst-text-green-400 yst-shrink-0" />
						{ __( "Grow your audience with actionable SEO and user behavior insights.", "wordpress-seo" ) }
					</li>
					<li className="yst-gap-2 yst-flex yst-mt-2 yst-items-start">
						<CheckCircleIcon className="yst-w-5 yst-text-green-400 yst-shrink-0" />
						{ __( "Fine-tune your SEO and optimize your content using key performance metrics (KPI).", "wordpress-seo" ) }
					</li>
				</ul>
				<SiteKitAlert
					capabilities={ config.capabilities }
					currentStep={ currentStep }
					isVersionSupported={ config.isVersionSupported }
					isConsentGranted={ config.connectionStepsStatuses.isConsentGranted }
				/>

			</div>
			<div className="yst-flex yst-gap-1 yst-mt-6 yst-items-center">
				<SiteKitSetupAction
					currentStep={ currentStep }
					config={ config }
					isConnectionCompleted={ isConnectionCompleted }
					onDismissWidget={ handleOnRemove }
					onShowConsent={ openConsentModal }
				/>
				{ ! isConnectionCompleted &&
					<>
						<LearnMoreLink as={ Button } variant="tertiary" href={ learnMoreLink } />
						<SiteKitConsentModal
							isOpen={ currentStep === STEP_NAME.grantConsent && isConsentModalOpen }
							onClose={ closeConsentModal }
							onGrantConsent={ grantConsent }
							learnMoreLink={ consentLearnMoreLink }
						/>
					</>
				}
			</div>
		</Widget>
	);
};
