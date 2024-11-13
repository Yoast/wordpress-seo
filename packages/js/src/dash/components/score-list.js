import { SCORES } from "../util/scores";
import { Badge, Button } from "@yoast/ui-library";
/**
 * @type {import("../index").Scores} Scores
 */
/**
 * @param {Scores} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreList = ( { scores } ) => {
	return <ul className="yst-col-span-2">
		{ Object.values( scores ).map( ( score ) =>{
			return <li key={ score.name } className="yst-flex yst-items-center yst-min-h-[1rem] yst-gap-x-2 yst-py-3 yst-border-b last:yst-border-b-0">
				<span className={ `yst-rounded-full yst-w-3 yst-h-3 ${SCORES[ score.name ].color}` } />
				<span>{ SCORES[ score.name ].label } <Badge variant="plain" className="yst-ml-1">{ score.amount }</Badge></span>
				{ score.links.view && <Button as="a" variant="secondary" href={ score.links.view } className="yst-ml-auto">View</Button> }
			</li>;
		} ) }
	</ul>;
};
