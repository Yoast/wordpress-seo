import { __, _n } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { Paper } from "@yoast/ui-library";
import { AlertsList } from "./alerts-list";
import { AlertsTitle } from "./alerts-title";
import { Collapsible } from "./collapsible";

import { AlertsContext } from "../contexts/alerts-context";
import { STORE_NAME } from "../constants/index";

/**
 * @returns {JSX.Element} The problems component.
 */
export const Problems = () => {
	const problemsList = useSelect( ( select ) => select( STORE_NAME ).selectActiveProblems(), [] );
	const dismissedProblemsList = useSelect( ( select ) => select( STORE_NAME ).selectDismissedProblems(), [] );

	const dismissedProblems = dismissedProblemsList.length;

	const dismissedProblemsLabel = _n(
		"hidden problem",
		"hidden problems",
		dismissedProblems,
		"wordpress-seo"
	);

	const problemsTheme = {
		Icon: ExclamationCircleIcon,
		bulletClass: "yst-fill-red-500",
		iconClass: "yst-text-red-500",
	};

	return (
		<Paper>
			<Paper.Content className="yst-max-w-[600px] yst-flex yst-flex-col yst-gap-y-6">
				<AlertsContext.Provider value={ { ...problemsTheme } }>
					<AlertsTitle title={ __( "Problems", "wordpress-seo" ) } counts={ problemsList.length }>
						<p className="yst-mt-2 yst-text-sm">
							{ problemsList.length > 0
								? __( "We have detected the following issues that affect the SEO of your site.", "wordpress-seo" )
								: __( "Good job! We could detect no serious SEO problems.", "wordpress-seo" )
							}
						</p>
					</AlertsTitle>
					<AlertsList items={ problemsList } />

					{ dismissedProblems > 0 && (
						<Collapsible label={ `${ dismissedProblems } ${ dismissedProblemsLabel }` }>
							<AlertsList className="yst-pb-6" items={ dismissedProblemsList } />
						</Collapsible>
					) }
				</AlertsContext.Provider>
			</Paper.Content>
		</Paper>
	);
};
