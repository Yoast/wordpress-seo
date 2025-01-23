import classNames from "classnames";
import { SCORE_META } from "../scores/score-meta";

/**
 * The score bullet component.
 *
 * @param {string} score The score.
 * @returns {JSX.Element} The element.
 */
export const SeoScoreFormatter = ( { score } ) => (
	<div className="yst-flex yst-justify-end yst-items-center">
		<div className="yst-flex yst-justify-center yst-w-16">
			<span className={ classNames( "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full", SCORE_META[ score ].color ) }>
				<span className="yst-sr-only">{ SCORE_META[ score ].label }</span>
			</span>
		</div>
	</div>
);
