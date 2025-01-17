import { Button, Paper, Stepper, Title } from "@yoast/ui-library";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { __ } from "@wordpress/i18n";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ArrowRightIcon } from "@heroicons/react/outline";


/**
 * The google site kit connection guide widget.
 *
 * @returns {JSX.Element} The widget.
 */
export const GoogleSiteKitConnectionWidget = () => {
	const steps = [
		{ label: __( "INSTALL", "wordpress-seo" ) },
		{ label: __( "ACTIVATE", "wordpress-seo" ) },
		{ label: __( "SET UP", "wordpress-seo" ) },
		{ label: __( "CONNECT", "wordpress-seo" ) },
	];

	return <Paper className="yst-@container yst-grow yst-max-w-screen-sm yst-p-8 yst-shadow-md">
		<div className="yst-flex yst-justify-center yst-mb-6"><YoastConnectSiteKit /></div>
		<Stepper steps={ steps } currentStep={ 1 } isComplete={ false } />
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
			<Button>{ __( "Connect Site Kit by Google", "wordpress-seo" ) }</Button>
			<Button as="a" variant="tertiary">{ __( "Learn more", "wordpress-seo" ) }
				<ArrowRightIcon className="yst-w-3 yst-ml-2 yst-text-primary-500" />
			</Button>
		</div>
	</Paper>;
};
