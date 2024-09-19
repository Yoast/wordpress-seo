import { __, _n } from "@wordpress/i18n";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { List } from "./list";
import { BoxTitle } from "./box-title";
import { HiddenAlertsCollapsible } from "./hidden-alerts-collapsible";

/**
 * @returns {JSX.Element} The problems component.
 */
export const Problems = () => {
	const problemsList = [
		{
			message: __( "Huge SEO issue: You're blocking access to robots. If you want search engines to show this site in their results, you must go to your Reading Settings and uncheck the box for Search Engine Visibility. I don't want this site to show in the search results.", "wordpress-seo" ),
		},
		{
			message: __( "You still have the default WordPress tagline, even an empty one is probably better. You can fix this in the customizer.", "wordpress-seo" ),
		},
	];

	const hiddenProblems = 1;

	const hiddenProblemsLabel = _n(
		"hidden problem.",
		"hidden problems.",
		hiddenProblems,
		"wordpress-seo"
	);

	return (
		<Paper className="yst-p-8 yst-flex-1 yst-flex-col">
			<BoxTitle title={ __( "Problems", "wordpress-seo" ) } counts={ 2 } Icon={ ExclamationCircleIcon } />
			<p className="yst-mt-2 yst-text-sm">{ __( "We have detected the following issues that affect the SEO of your site.", "wordpress-seo" ) }</p>
			<List items={ problemsList } />

			<HiddenAlertsCollapsible label={ `${ hiddenProblems } ${ hiddenProblemsLabel }` }>
				<List items={ problemsList } hidden={ true } />
			</HiddenAlertsCollapsible>
		</Paper>
	);
};
