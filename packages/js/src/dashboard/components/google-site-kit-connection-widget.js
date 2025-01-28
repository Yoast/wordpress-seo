import { Button, Paper, Stepper, Title, DropdownMenu } from "@yoast/ui-library";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { __ } from "@wordpress/i18n";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ArrowRightIcon, XIcon, TrashIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";

/**
 * Get the button and stepper props based on the current state.
 *
 * @param {boolean} isInstalled Whether the plugin is isInstalled.
 * @param {boolean} isActive Whether the feature is active.
 * @param {boolean} isSetup Whether the setup is complete.
 * @param {boolean} isConnected Whether the connection is active.
 * @param {string} installUrl The URL to install Site Kit.
 * @param {string} activateUrl The URL to activate Site Kit.
 * @param {string} setupUrl The URL to setup Site Kit.
 *
 * @returns {Object} The button and stepper props.
 */
const getButtonAndStepperProps = ( isInstalled, isActive, isSetup, isConnected, installUrl, activateUrl, setupUrl ) => {
	let buttonProps;
	let currentStep;
	let isComplete = false;

	switch ( true ) {
		case ( ! isInstalled ):
			currentStep = 1;
			buttonProps = {
				children: __( "Install Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: installUrl,
			};
			break;
		case ( ! isActive ):
			currentStep = 2;
			buttonProps = {
				children: __( "Activate Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: activateUrl,
			};
			break;
		case ( ! isSetup ):
			currentStep = 3;
			buttonProps = {
				children: __( "Set up Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: setupUrl,
			};
			break;
		case ( ! isConnected ):
			currentStep = 4;
			buttonProps = { children: __( "Connect Site Kit by Google", "wordpress-seo" ) };
			break;
		case isConnected:
			isComplete = true;
			currentStep = 4;
			buttonProps = { children: "Take a quick tour" };
			break;
	}
	return { buttonProps, currentStep, isComplete };
};

const steps = [
	__( "INSTALL", "wordpress-seo" ),
	__( "ACTIVATE", "wordpress-seo" ),
	__( "SET UP", "wordpress-seo" ),
	__( "CONNECT", "wordpress-seo" ),
];

/**
 * The google site kit connection guide widget.
 *
 * @param {boolean} isInstalled Whether the plugin is installed.
 * @param {boolean} isActive Whether the feature is active.
 * @param {boolean} isSetup Whether the setup is complete.
 * @param {boolean} isConnected Whether the connection is active.
 * @param {string} installUrl The URL to install Site Kit.
 * @param {string} activateUrl The URL to activate Site Kit.
 * @param {string} setupUrl The URL to setup Site Kit.
 * @param {function} onRemove The function to call when the widget is removed.
 * @param {function} onRemovePermanently The function to call when the widget is removed permanently.
 *
 * @returns {JSX.Element} The widget.
 */
export const GoogleSiteKitConnectionWidget = ( {
	installUrl,
	activateUrl,
	setupUrl,
	isConnected,
	isActive,
	isSetup,
	isInstalled,
	onRemove,
	onRemovePermanently,
} ) => {
	const learnMorelink = useSelect( select => select( "@yoast/general" ).selectLink( "https://yoa.st/google-site-kit-learn-more" ), [] );

	const { buttonProps, currentStep, isComplete } = getButtonAndStepperProps(
		isInstalled, isActive, isSetup, isConnected, installUrl, activateUrl, setupUrl );
	return <Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md yst-relative">

		<DropdownMenu className="yst-absolute yst-top-4 yst-end-4">
			<DropdownMenu.IconTrigger screenReaderTriggerLabel={ __( "Open menu", "wordpress-seo" ) } className="yst-absolute yst-top-0 yst-end-0" />
			<DropdownMenu.List className="yst-absolute yst-top-5 yst-end-0">
				<DropdownMenu.ButtonItem className="yst-text-slate-600" onClick={ onRemove }>
					<XIcon className="yst-w-4 yst-text-slate-400" />
					{ __( "Remove until next visit", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
				<DropdownMenu.ButtonItem className="yst-text-red-500" onClick={ onRemovePermanently }>
					<TrashIcon className="yst-w-4" />
					{ __( "Remove permanently", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
			</DropdownMenu.List>
		</DropdownMenu>

		<div className="yst-flex yst-justify-center yst-mb-6 yst-mt-4"><YoastConnectSiteKit /></div>
		<Stepper steps={ steps } currentStep={ currentStep } isComplete={ isComplete } />
		<hr className="yst-bg-slate-200 yst-my-6" />
		<Title size="2">{ __( "Expand your dashboard with insights from Google!", "wordpress-seo" ) }</Title>
		<p  className="yst-my-4">{ __( "Bring together powerful tools like Google Analytics and Search Console for a complete overview of your website's performance, all in one seamless dashboard.", "wordpress-seo" ) }</p>

		<span className="yst-text-slate-800 yst-font-medium">{ __( "What you'll get:", "wordpress-seo" ) }</span>
		<ul>
			<li className="yst-gap-2 yst-flex yst-mt-2"><CheckCircleIcon className="yst-w-5 yst-text-green-400" />
				{ __( "Actionable insights into traffic, SEO, and user behavior to grow your audience.", "wordpress-seo" ) }</li>
			<li className="yst-gap-2 yst-flex yst-mt-2"><CheckCircleIcon className="yst-w-5 yst-text-green-400" />
				{ __( "Key performance metrics to fine-tune your website and optimize like a pro.", "wordpress-seo" ) }</li>
		</ul>
		<div className="yst-flex yst-gap-0.5 yst-mt-6 yst-items-center">
			<Button { ...buttonProps } />

			{ isConnected ? <Button>{ __( "Dismiss", "wordpress-seo" ) }</Button>
				: <Button as="a" variant="tertiary" href={ learnMorelink }>{ __( "Learn more", "wordpress-seo" ) }
					<ArrowRightIcon className="yst-w-3 yst-ml-2 yst-text-primary-500" />
				</Button>
			}
		</div>
	</Paper>;
};


