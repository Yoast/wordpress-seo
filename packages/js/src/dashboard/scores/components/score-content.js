import { SkeletonLoader } from "@yoast/ui-library";
import { SCORE_META } from "../score-meta";
import { ContentStatusDescription } from "./content-status-description";
import { ScoreChart } from "./score-chart";
import { ScoreList } from "./score-list";

/**
 * @type {import("../index").Score} Score
 * @type {import("../index").ScoreType} ScoreType
 */

/**
 * @returns {JSX.Element} The element.
 */
const ScoreContentSkeletonLoader = () => (
	<>
		<SkeletonLoader className="yst-w-full">&nbsp;</SkeletonLoader>
		<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-7 yst-gap-6 yst-mt-6">
			<ul className="yst-col-span-4">
				{ Object.entries( SCORE_META ).map( ( [ name, { label } ] ) => (
					<li
						key={ `skeleton-loader--${ name }` }
						className="yst-flex yst-items-center yst-min-h-[1rem] yst-py-3 yst-border-b last:yst-border-b-0"
					>
						<SkeletonLoader className="yst-w-3 yst-h-3 yst-rounded-full" />
						<SkeletonLoader className="yst-ml-3 yst-mr-2">{ label }</SkeletonLoader>
						<SkeletonLoader className="yst-w-7">1</SkeletonLoader>
						<SkeletonLoader className="yst-ml-auto yst-button yst-button--small">View</SkeletonLoader>
					</li>
				) ) }
			</ul>
			<div className="yst-col-span-3 yst-relative">
				<SkeletonLoader className="yst-w-full yst-aspect-square yst-rounded-full" />
				<div className="yst-absolute yst-inset-5 yst-aspect-square yst-bg-white yst-rounded-full" />
			</div>
		</div>
	</>
);

/**
 * @param {Score[]} [scores=[]] The scores.
 * @param {boolean} isLoading Whether the scores are still loading.
 * @param {Object.<ScoreType,string>} descriptions The descriptions.
 * @returns {JSX.Element} The element.
 */
export const ScoreContent = ( { scores = [], isLoading, descriptions } ) => {
	if ( isLoading ) {
		return <ScoreContentSkeletonLoader />;
	}

	return (
		<>
			<ContentStatusDescription scores={ scores } descriptions={ descriptions } />
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-7 yst-gap-6 yst-mt-6">
				{ scores && <ScoreList scores={ scores } /> }
				{ scores && <ScoreChart scores={ scores } /> }
			</div>
		</>
	);
};
