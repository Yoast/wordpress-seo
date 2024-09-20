import { __, _n } from "@wordpress/i18n";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { AlertsList } from "./alerts-list";
import { AlertTitle } from "./alert-title";
import { Collapsible } from "./collapsible";
import { AlertsContext } from "../contexts/alerts-context";

/**
 * @returns {JSX.Element} The problems component.
 */
export const Problems = () => {
	const problemsList = [
		{
			message: "Huge SEO issue: You're blocking access to robots. If you want search engines to show this site in their results, you must go to your Reading Settings and uncheck the box for Search Engine Visibility. I don't want this site to show in the search results.",
		},
		{
			message: "You still have the default WordPress tagline, even an empty one is probably better. You can fix this in the customizer.",
		},
	];

	const hiddenProblems = 1;

	const hiddenProblemsLabel = _n(
		"hidden problem",
		"hidden problems",
		hiddenProblems,
		"wordpress-seo"
	);

	const problemsTheme = {
		Icon: ExclamationCircleIcon,
		bulletClass: "yst-fill-red-500",
		iconClass: "yst-text-red-500",
	};

	return (
		<Paper>
			<Paper.Content>
				<AlertsContext.Provider value={ problemsTheme }>
					<AlertTitle title={ __( "Problems", "wordpress-seo" ) } counts={ 2 } />
					<p className="yst-mt-2 yst-text-sm">{ __( "We have detected the following issues that affect the SEO of your site.", "wordpress-seo" ) }</p>
					<AlertsList items={ problemsList } />

					<Collapsible label={ `${ hiddenProblems } ${ hiddenProblemsLabel }` }>
						<AlertsList items={ problemsList } hidden={ true } />
					</Collapsible>
				</AlertsContext.Provider>
			</Paper.Content>
		</Paper>
	);
};
