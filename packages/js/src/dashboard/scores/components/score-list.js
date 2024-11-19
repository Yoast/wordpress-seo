import { Badge, Button } from "@yoast/ui-library";
import { SCORE_META } from "../score-meta";

/**
 * @type {import("../index").Score} Score
 */

/**
 * @param {Score[]} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreList = ( { scores } ) => (
	<ul className="yst-col-span-4">
		{ scores.map( ( score ) => (
			<li
				key={ score.name }
				className="yst-flex yst-items-center yst-min-h-[1rem] yst-py-3 yst-border-b last:yst-border-b-0"
			>
				<span className={ `yst-rounded-full yst-w-3 yst-h-3 ${ SCORE_META[ score.name ].color }` } />
				<span className="yst-ml-3 yst-mr-2 yst-leading-4 yst-py-1.5">{ SCORE_META[ score.name ].label }</span>
				<Badge variant="plain">{ score.amount }</Badge>
				{ score.links.view && (
					<Button as="a" variant="secondary" size="small" href={ score.links.view } className="yst-ml-auto">View</Button>
				) }
			</li>
		) ) }
	</ul>
);
