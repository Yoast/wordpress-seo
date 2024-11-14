import { Badge, Button } from "@yoast/ui-library";
import { SCORE_META } from "../util/score-meta";

/**
 * @type {import("../index").Score} Score
 */

/**
 * @param {Score[]} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreList = ( { scores } ) => (
	<ul className="yst-col-span-2">
		{ scores.map( ( score ) => (
			<li
				key={ score.name }
				className="yst-flex yst-items-center yst-min-h-[1rem] yst-gap-x-2 yst-py-3 yst-border-b last:yst-border-b-0"
			>
				<span className={ `yst-rounded-full yst-w-3 yst-h-3 ${ SCORE_META[ score.name ].color }` } />
				<span>{ SCORE_META[ score.name ].label } <Badge variant="plain" className="yst-ml-1">{ score.amount }</Badge></span>
				{ score.links.view && <Button as="a" variant="secondary" href={ score.links.view } className="yst-ml-auto">View</Button> }
			</li>
		) ) }
	</ul>
);
