import { Button, Paper, Stepper, Title } from "@yoast/ui-library";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { __ } from "@wordpress/i18n";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ArrowRightIcon } from "@heroicons/react/outline";


/**
 * The google site kit connection guide widget.
 *
 * @param {boolean} setup Whether the setup is complete.
 * @param {boolean} active Whether the feature is active.
 * @param {boolean} connected Whether the connection is active.
 * @param {boolean} installed Whether the plugin is installed.
 * @param {boolean} featureActive Whether the feature is active.
 * @param {string} activateUrl The URL to activate Site Kit.
 * @param {string} installUrl The URL to install Site Kit.
 *
 * @returns {JSX.Element} The widget.
 */
export const GoogleSiteKitConnectionWidget = ( {
	installUrl,
	activateUrl,
	setupUrl,
	connected,
	active,
	setup,
	installed,
} ) => {
	const steps = [
		{ label: __( "INSTALL", "wordpress-seo" ) },
		{ label: __( "ACTIVATE", "wordpress-seo" ) },
		{ label: __( "SET UP", "wordpress-seo" ) },
		{ label: __( "CONNECT", "wordpress-seo" ) },
	];

	const learnMorelink = "https://yoa.st/dashboard-google-site-kit-learn-more";
	let buttonProps;
	let currentStep;
	let isComplete;

	switch ( true ) {
		case ( ! installed ):
			currentStep = 1;
			buttonProps = {
				children: __( "Install Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: installUrl,
			};
			break;
		case ( ! active ):
			currentStep = 2;
			buttonProps = {
				children: __( "Activate Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: activateUrl,
			};
			break;
		case ( ! setup ):
			currentStep = 3;
			buttonProps = {
				children: __( "Set up Site Kit by Google", "wordpress-seo" ),
				as: "a",
				href: setupUrl,
			};
			break;
		case ( ! connected ):
			currentStep = 4;
			buttonProps = { children: __( "Connect Site Kit by Google", "wordpress-seo" ) };
			break;
		case connected:
			isComplete = true;
			currentStep = 4;
			buttonProps = { children: "Take a quick tour" };
			break;
	}

	console.log( buttonProps, currentStep, isComplete );
	return <Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
		<div className="yst-flex yst-justify-center yst-mb-6"><YoastConnectSiteKit /></div>
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

			{ connected ? <Button>{ __( "Dismiss", "wordpress-seo" ) }</Button>
				: <Button as="a" variant="tertiary" href={ learnMorelink }>{ __( "Learn more", "wordpress-seo" ) }
					<ArrowRightIcon className="yst-w-3 yst-ml-2 yst-text-primary-500" />
				</Button>
			}
		</div>
	</Paper>;
};
