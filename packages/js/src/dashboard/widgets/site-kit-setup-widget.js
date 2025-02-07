import { Button, Paper, Stepper, Title, DropdownMenu } from "@yoast/ui-library";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { __ } from "@wordpress/i18n";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ArrowRightIcon, XIcon, TrashIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";

const steps = [
	__( "INSTALL", "wordpress-seo" ),
	__( "ACTIVATE", "wordpress-seo" ),
	__( "SET UP", "wordpress-seo" ),
	__( "CONNECT", "wordpress-seo" ),
];

/**
 * The google site kit connection guide widget.
 *
 * @param {function} onRemove The function to call when the widget is removed.
 * @param {DataProvider} dataProvider The data provider.
 *
 * @returns {JSX.Element} The widget.
 */
export const SiteKitSetupWidget = ( {
	onRemove,
	dataProvider,
} ) => {
	const {
		installUrl,
		activateUrl,
		setupUrl,
		isConnected,
		isActive,
		isSetupCompleted,
		isInstalled } = dataProvider.getSiteKitConfiguration();
	const learnMorelink = dataProvider.getLink( "siteKitLearnMorelink" );
	const handleOnRemove = useCallback( () => {
		onRemove( "siteKitSetup" );
	}, [ onRemove ] );

	const onRemovePermanently = useCallback( () => {
		// Implement the remove permanently functionality.
		handleOnRemove();
	}, [ handleOnRemove ] );

	const stepsStatuses = [ isInstalled, isActive, isSetupCompleted, isConnected ];

	let currentStep = stepsStatuses.findIndex( status => ! status );
	const overAllCompleted = currentStep === -1;

	if ( currentStep === -1 ) {
		currentStep = steps.length - 1;
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
		},
	];

	return <Paper className="yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md yst-relative">
		<DropdownMenu as="span" className="yst-absolute yst-top-4 yst-end-4">
			<DropdownMenu.IconTrigger screenReaderTriggerLabel={ __( "Open Site Kit widget dropdown menu", "wordpress-seo" ) } className="yst-float-end" />
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
					onClick={ onRemovePermanently }
				>
					<TrashIcon className="yst-w-4" />
					{ __( "Remove permanently", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
			</DropdownMenu.List>
		</DropdownMenu>

		<div className="yst-flex yst-justify-center yst-mb-6 yst-mt-4"><YoastConnectSiteKit /></div>
		<Stepper steps={ steps } currentStep={ currentStep }>
			{ steps.map( ( label, index ) => ( <Stepper.Step
				key={ label }
				isActive={ currentStep === index }
				isComplete={ stepsStatuses[ index ] }
			>
				{ label }
			</Stepper.Step> ) ) }
		</Stepper>
		<hr className="yst-bg-slate-200 yst-my-6" />
		<Title size="2">{ __( "Expand your dashboard with insights from Google!", "wordpress-seo" ) }</Title>
		<p  className="yst-my-4">{ __( "Bring together powerful tools like Google Analytics and Search Console for a complete overview of your website's performance, all in one seamless dashboard.", "wordpress-seo" ) }</p>

		<span className="yst-text-slate-800 yst-font-medium">{ __( "What you'll get:", "wordpress-seo" ) }</span>
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

			{ overAllCompleted
				? <>
					<Button>
						{ __( "Take a quick tour", "wordpress-seo" ) }
					</Button>
					<Button variant="tertiary" onClick={ onRemovePermanently }>{ __( "Dismiss", "wordpress-seo" ) }</Button>
				</>
				: <>
					<Button { ...buttonProps[ currentStep ] } />
					<Button as="a" variant="tertiary" href={ learnMorelink } className="yst-flex yst-items-center yst-gap-1">
						{ __( "Learn more", "wordpress-seo" ) }
						<ArrowRightIcon className="yst-w-3 yst-text-primary-500 rtl:yst-rotate-180" />
					</Button>
				</>
			}
		</div>
	</Paper>;
};


