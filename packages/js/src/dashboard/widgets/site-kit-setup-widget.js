import { ArrowRightIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, DropdownMenu, Paper, Stepper, Title, useToggleState } from "@yoast/ui-library";
import { noop } from "lodash";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { SiteKitConsentModal } from "../../shared-admin/components";
import { WidgetFactory } from "../services/widget-factory";

/**
 * @type {import("../index").SiteKitConfiguration} SiteKitConfiguration
 * @type {import("../services/data-provider").DataProvider} DataProvider
 * @type {import("../services/remote-data-provider").RemoteDataProvider} RemoteDataProvider
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
 * @property {SiteKitConfiguration} config The site kit configuration.
 * @property {function(RequestInit?)} grantConsent The grant consent function.
 * @property {function(RequestInit?)} dismissPermanently The dismiss permanently function.
 */

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {function} addSiteKitWidgets The function add the site kit widgets.
 * @returns {UseSiteKitConfiguration} The site kit configuration and helper methods.
 */
const useSiteKitConfiguration = ( dataProvider, remoteDataProvider, addSiteKitWidgets ) => {
	const [ config, setConfig ] = useState( () => dataProvider.getSiteKitConfiguration() );

	const grantConsent = useCallback( ( options ) => {
		remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "siteKitConsentManagement" ),
			{ consent: String( true ) },
			{ ...options, method: "POST" }
		).then( ( { success } ) => {
			if ( success ) {
				dataProvider.setSiteKitConnected( true );
				addSiteKitWidgets();
				setConfig( dataProvider.getSiteKitConfiguration() );
			}
		} ).catch( noop );
	}, [ dataProvider, remoteDataProvider, setConfig ] );

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

	return { config, grantConsent, dismissPermanently };
};

/**
 * The google site kit connection guide widget.
 *
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {function} removeWidget The function to remove a widget.
 * @param {function} addWidget The function to add a widget.
 *
 * @returns {JSX.Element} The widget.
 */
export const SiteKitSetupWidget = ( { dataProvider, remoteDataProvider, removeWidget, addWidget } ) => {
	const handleAddSiteKitWidgets = useCallback( () => {
		[ WidgetFactory.types.topPages ].forEach( ( type ) => addWidget( type ) );
	}, [ addWidget ] );

	const { config, grantConsent, dismissPermanently } = useSiteKitConfiguration( dataProvider, remoteDataProvider, handleAddSiteKitWidgets );
	const [ isConsentModalOpen, , , openConsentModal, closeConsentModal ] = useToggleState( false );

	const handleOnRemove = useCallback( () => {
		removeWidget( WidgetFactory.types.siteKitSetup );
	}, [ removeWidget ] );

	const handleRemovePermanently = useCallback( () => {
		dismissPermanently();
		handleOnRemove();
	}, [ handleOnRemove, dismissPermanently ] );

	const learnMoreLink = dataProvider.getLink( "siteKitLearnMore" );
	const consentLearnMoreLink = dataProvider.getLink( "siteKitConsentLearnMore" );

	const stepsStatuses = [ config.isInstalled, config.isActive, config.isSetupCompleted, config.isConnected ];
	let currentStep = stepsStatuses.findIndex( status => ! status );
	const overallCompleted = currentStep === -1;
	if ( overallCompleted ) {
		currentStep = steps.length - 1;
	}

	const buttonProps = [
		{
			children: __( "Install Site Kit by Google", "wordpress-seo" ),
			href: config.installUrl,
			as: "a",
		},
		{
			children: __( "Activate Site Kit by Google", "wordpress-seo" ),
			href: config.activateUrl,
			as: "a",
		},
		{
			children: __( "Set up Site Kit by Google", "wordpress-seo" ),
			href: config.setupUrl,
			as: "a",
		},
		{
			children: __( "Connect Site Kit by Google", "wordpress-seo" ),
			onClick: openConsentModal,
		},
	];

	return <Paper className="yst-grow xl:yst-col-span-2 yst-col-span-4 yst-p-8 yst-shadow-md yst-relative">
		<DropdownMenu as="span" className="yst-absolute yst-top-4 yst-end-4">
			<DropdownMenu.IconTrigger
				screenReaderTriggerLabel={ __( "Open Site Kit widget dropdown menu", "wordpress-seo" ) }
				className="yst-float-end"
			/>
			<DropdownMenu.List className="yst-mt-6 yst-w-56">
				<DropdownMenu.ButtonItem
					className="yst-text-slate-600 yst-border-b yst-border-slate-200 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4"
					onClick={ handleOnRemove }
				>
					<XIcon className="yst-w-4 yst-text-slate-400" />
					{ __( "Remove until next visit", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
				<DropdownMenu.ButtonItem
					className="yst-text-red-500 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4"
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
					isComplete={ stepsStatuses[ index ] }
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
		<div className="yst-flex yst-gap-1 yst-mt-6 yst-items-center">
			{ overallCompleted
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
