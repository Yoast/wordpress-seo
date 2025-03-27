import { SkeletonLoader } from "@yoast/ui-library";
import { ContentStatusDescription } from "./content-status-description";
import { ScoreChart, ScoreChartSkeletonLoader } from "./score-chart";
import { ScoreList, ScoreListSkeletonLoader } from "./score-list";

/**
 * @type {import("../index").Score} Score
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * @type {{container: string, list: string, chart: string}}
 */
const CLASSNAMES = {
	container: "yst-flex yst-flex-col @md:yst-flex-row yst-gap-12 yst-mt-6",
	list: "yst-grow",
	// Calculation: (line-height 1rem + py 0.375rem * 2) * 4 + (spacing 0.75rem * 2 + border 1px ) * 3 = 11.5rem + 3px.
	chart: "yst-w-[calc(11.5rem+3px)] yst-aspect-square",
};

/**
 * @returns {JSX.Element} The element.
 */
const ScoreContentSkeletonLoader = () => (
	<>
		<SkeletonLoader className="yst-w-full">&nbsp;</SkeletonLoader>
		<div className={ CLASSNAMES.container }>
			<ScoreListSkeletonLoader className={ CLASSNAMES.list } />
			<ScoreChartSkeletonLoader className={ CLASSNAMES.chart } />
		</div>
	</>
);

/**
 * @param {Score[]} [scores=[]] The scores.
 * @param {boolean} isLoading Whether the scores are still loading.
 * @param {Object.<ScoreType,string>} descriptions The descriptions.
 * @param {string} idSuffix The suffix for the IDs.
 * @returns {JSX.Element} The element.
 */
export const ScoreContent = ( { scores = [], isLoading, descriptions, idSuffix } ) => {
	if ( isLoading ) {
		return <ScoreContentSkeletonLoader />;
	}

	return (
		<>
			<ContentStatusDescription scores={ scores } descriptions={ descriptions } />
			<div className={ CLASSNAMES.container }>
				{ scores && <ScoreList className={ CLASSNAMES.list } scores={ scores } idSuffix={ idSuffix } /> }
				{ scores && <ScoreChart className={ CLASSNAMES.chart } scores={ scores } /> }
			</div>
		</>
	);
};
